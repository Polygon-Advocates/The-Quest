// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
pragma abicoder v2;

/**
 * @title Token Bridge Hyper
 * @notice This is the main contract that will have all the 0Layer & uniswap implementation
 */

// IMPORTS
import "./NonblockingLzApp.sol";
// [FOR REMIX] import "https://github.com/LayerZero-Labs/solidity-examples/blob/main/contracts/lzApp/NonblockingLzApp.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-core/contracts/libraries/FixedPoint96.sol";
import "@uniswap/v3-core/contracts/libraries/FullMath.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenBridgeHyper is Ownable, NonblockingLzApp {
    ISwapRouter public immutable swapRouter;
    IUniswapV3Factory public immutable uniswapV3Factory;
    address public priceFeedAddress;
    address public stableAssetAddressUSDC;
    address public wrappedAssetAddressNative;
    uint24 public constant POOL_FEE = 3000;

    /**
     * @notice Getting the native balance of the contract
     * @param _endpoint - Endpoint address of Zero Layer Interface
     * @param _swapRouter - UniswapV3 swap router address
     */
    constructor(
        address _endpoint,
        ISwapRouter _swapRouter,
        address _stableAssetAddressUSDC,
        address _wrappedAssetAddressNative,
        IUniswapV3Factory _uniswapV3Factory
    ) NonblockingLzApp(_endpoint) {
        swapRouter = _swapRouter;
        stableAssetAddressUSDC = _stableAssetAddressUSDC;
        wrappedAssetAddressNative = _wrappedAssetAddressNative;
        uniswapV3Factory = _uniswapV3Factory;
    }

    /**
     * @notice To set the trusted remote address
     * @param _remoteChainId - Remote chain ID (zero layer id)
     * @param _remoteAddress - Remote address of contract deployed on the other chain
     */
    function setTrustedRemoteAddressLayerZeroApp(
        uint16 _remoteChainId,
        bytes calldata _remoteAddress
    ) external onlyOwner {
        trustedRemoteLookup[_remoteChainId] = abi.encodePacked(
            _remoteAddress,
            address(this)
        );
        emit SetTrustedRemoteAddress(_remoteChainId, _remoteAddress);
    }

    /**
     * @notice To initiate the Token Swap
     * @param _amount - Amount of token to be swapped
     * @param _dstChainId - Destination chain id of the other chain (zero layer id)
     */
    function bridgeToken(uint256 _amount, uint16 _dstChainId) public payable {
        require(
            msg.value >= _amount,
            "You need to send the exact amount of tokens !!"
        );

        uint256 amountToSwap = _getAssetPrice(_amount);
        bytes memory payload = abi.encodePacked(amountToSwap, msg.sender);

        uint16 version = 1;
        uint gasForDestinationLzReceive = 350000;
        bytes memory adapterParams = abi.encodePacked(
            version,
            gasForDestinationLzReceive
        );

        // Sending the params to the other chain
        _lzSend(
            _dstChainId,
            payload,
            payable(address(this)),
            address(0x0),
            adapterParams,
            msg.value
        );
    }

    /**
     * @notice To be executed when message is recieved
     * @param _srcChainId - chain id of the message (zero layer id)
     * @param _srcAddress - source address of the message (contract address)
     * @param _payload - Payload of the message received
     */
    function _nonblockingLzReceive(
        uint16 _srcChainId,
        bytes memory _srcAddress,
        uint64,
        bytes memory _payload
    ) internal override {
        address sendBackToAddress;
        assembly {
            sendBackToAddress := mload(add(_srcAddress, 20))
        }

        // uint16 srcChainId = _srcChainId;

        (uint256 _amountOfTokenSwapUSD, address _recieverAddress) = abi.decode(
            _payload,
            (uint256, address)
        );

        _performAssetSwapOnReceiving(_amountOfTokenSwapUSD, _recieverAddress);
    }

    /**
     * @notice To execute the swaps on the behalf of the contract
     * @param _amountIn - the sent amount
     * @param _recipient - address of the receiver of the assets
     */
    function _performAssetSwapOnReceiving(
        uint256 _amountIn,
        address _recipient
    ) private returns (uint256 _amountOut) {
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: stableAssetAddressUSDC,
                tokenOut: wrappedAssetAddressNative,
                fee: POOL_FEE,
                recipient: _recipient,
                deadline: block.timestamp,
                amountIn: _amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        _amountOut = swapRouter.exactInputSingle(params);
        return _amountOut;
    }

    /**
     * @notice To get the price of the native asset
     * @param _amount - The amount of native token that needs to be swapped
     */
    function _getAssetPrice(uint256 _amount) private view returns (uint256) {
        IUniswapV3Pool pool = IUniswapV3Pool(
            uniswapV3Factory.getPool(
                stableAssetAddressUSDC,
                wrappedAssetAddressNative,
                POOL_FEE
            )
        );
        (uint160 sqrtPriceX96, , , , , , ) = pool.slot0();
        uint256 amount0 = FullMath.mulDiv(
            pool.liquidity(),
            FixedPoint96.Q96,
            sqrtPriceX96
        );
        uint256 amount1 = FullMath.mulDiv(
            pool.liquidity(),
            sqrtPriceX96,
            FixedPoint96.Q96
        );
        uint256 priceFromLiquidityPool = (amount1 *
            10 ** ERC20(stableAssetAddressUSDC).decimals()) / amount0;

        return _amount * priceFromLiquidityPool;
    }

    /**
     * @notice Getting the native balance of the contract
     */
    function getContractBalanceNatve() public view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @notice Withdrawing the Native Balance from the smart contract
     * @dev Only owner function
     */
    function withdrawNative() public onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "Withdraw Failed !!!");
    }

    receive() external payable {}
}
