// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Imports
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract CryptoVault is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    // * Address of tokens
    address public ETH_ADDRESS_TESTNET =
        0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6;
    address public VLTK_ADDRESS_TESTNET =
        0x0EA7bf5f7Afd9f4c176F1E9083595A8e06b06454;

    // * Address of price feeds
    address public ETH_PRICE_FEED_ADDRESS =
        0x694AA1769357215DE4FAC081bf1f309aDC325306;

    // * Items struct
    struct Items {
        address withdrawer;
        uint256 amount;
        uint256 unlockTimeStamp;
        bool withdrawn;
        bool deposited;
        uint256 tokensLoaned;
    }

    // * Vars & Mappings
    uint256 public depositsCount;

    mapping(address => uint256[]) public depositsByTokenAddress;
    mapping(address => uint256[]) public depositsByWithdrawers;
    mapping(uint256 => Items) public lockedToken;
    mapping(address => mapping(address => uint256)) public walletTokenBalance;

    address public contractOwnerAddress;
    AggregatorV3Interface internal priceFeed;

    constructor() {
        contractOwnerAddress = msg.sender;
    }

    // * EVENTS
    event tokensLocked(
        address _withdrawer,
        uint256 _amount,
        uint256 _unlockTimestamp
    );
    event tokensWithdrawn(address _withdrawer, uint256 _amount);

    /// @dev This is a function to lock the tokens in a vault and recieve a loan amount
    /// @param _withdrawer Address of the wallet who will be able to withdraw the amount
    /// @param _amount Amount of token deposited
    /// @param _unlockTimestamp Timestamp at which vault will be available for withdraw
    function lockTokens(
        address _withdrawer,
        uint256 _amount,
        uint256 _unlockTimestamp
    ) public payable returns (uint256 _id) {
        // Checks
        require(
            _unlockTimestamp < 10000000000,
            "Unlock timestamp is not in seconds!"
        );
        require(
            _unlockTimestamp > block.timestamp,
            "Unlock timestamp is not in the future!"
        );

        // * Transfering tokens User => System
        require(msg.value >= _amount, "Unsufficient Native Token balance");

        uint256 price = _getTokenPrice(_amount);

        // * Transfering tokens System => User
        // USDT has 6 decimal places
        IERC20(VLTK_ADDRESS_TESTNET).transfer(msg.sender, price);

        // adding the token balance in the wallet of particular address
        walletTokenBalance[ETH_ADDRESS_TESTNET][
            msg.sender
        ] = walletTokenBalance[ETH_ADDRESS_TESTNET][msg.sender].add(_amount);

        _id = ++depositsCount;
        lockedToken[_id].withdrawer = _withdrawer;
        lockedToken[_id].amount = _amount;
        lockedToken[_id].unlockTimeStamp = _unlockTimestamp;
        lockedToken[_id].withdrawn = false;
        lockedToken[_id].deposited = true;
        lockedToken[_id].tokensLoaned = price;

        depositsByTokenAddress[ETH_ADDRESS_TESTNET].push(_id);
        depositsByWithdrawers[_withdrawer].push(_id);
        emit tokensLocked(_withdrawer, _amount, _unlockTimestamp);
        return _id;
    }

    /// @dev Function to get the latest price of the token in USD
    /// @param _amount amount of the tokens deposited
    function _getTokenPrice(uint256 _amount) private returns (uint256) {
        priceFeed = AggregatorV3Interface(ETH_PRICE_FEED_ADDRESS);
        (, int256 answer, , , ) = priceFeed.latestRoundData();
        uint256 _price = uint256(answer * 100000000000);
        return ((_price * _amount) / 10 ** 18);
    }

    /// @dev Function to withdraw the vault tokens
    /// @param _id ID of the vault
    function withdrawTokens(uint256 _id) external payable {
        require(
            block.timestamp >= lockedToken[_id].unlockTimeStamp,
            "Tokens are still locked!"
        );
        require(
            msg.sender == lockedToken[_id].withdrawer,
            "You are not the withdrawer!"
        );
        require(lockedToken[_id].deposited, "Tokens are not yet deposited!");
        require(!lockedToken[_id].withdrawn, "Tokens are already withdrawn!");
        require(
            IERC20(VLTK_ADDRESS_TESTNET).allowance(msg.sender, address(this)) >=
                lockedToken[_id].tokensLoaned,
            "You need to approve the loaned token!"
        );
        require(
            IERC20(VLTK_ADDRESS_TESTNET).balanceOf(msg.sender) >=
                lockedToken[_id].tokensLoaned,
            "You don't have enough balances to unlock your vault!"
        );

        lockedToken[_id].withdrawn = true;

        walletTokenBalance[ETH_ADDRESS_TESTNET][
            msg.sender
        ] = walletTokenBalance[ETH_ADDRESS_TESTNET][msg.sender].sub(
            lockedToken[_id].amount
        );

        // * Transfering funds from User => Contract

        IERC20(VLTK_ADDRESS_TESTNET).transferFrom(
            msg.sender,
            address(this),
            lockedToken[_id].tokensLoaned
        );

        // * Transfering funds from Contract => User

        (bool success, ) = payable(msg.sender).call{
            value: lockedToken[_id].amount
        }("");
        require(success, "transaction failed");

        emit tokensWithdrawn(msg.sender, lockedToken[_id].amount);
    }

    function getDepositsByTokenAddress(
        address _id
    ) external view returns (uint256[] memory) {
        return depositsByTokenAddress[_id];
    }

    function getDepositsByWithdrawer(
        address _token,
        address _withdrawer
    ) external view returns (uint256) {
        return walletTokenBalance[_token][_withdrawer];
    }

    function getVaultsByWithdrawer(
        address _withdrawer
    ) external view returns (uint256[] memory) {
        return depositsByWithdrawers[_withdrawer];
    }

    function getVaultById(uint256 _id) external view returns (Items memory) {
        return lockedToken[_id];
    }

    function getTokenTotalLockedBalance(
        address _token
    ) external view returns (uint256) {
        return IERC20(_token).balanceOf(address(this));
    }
}
