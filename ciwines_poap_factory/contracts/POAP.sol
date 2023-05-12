// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import"@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import"@openzeppelin/contracts/utils/Strings.sol";
import "./interfaces/IFactory.sol";

contract POAP is ERC721Enumerable {
  using Strings for uint;

  IFactory public factory;
  string private baseUri;
  uint public maxSupply;
  bool public sameForAll;
  bool public isSBT;

  /**
   * @notice Constructor
   * @param _name Name of the POAP
   * @param _symbol Symbol of the POAP
   * @param _baseUri Url of the assets.
   * @param _maxSupply Maximim amount of token to mint. If 0, supply is unlimited.
   * @param _sameForAll If true, the asset of the poap is the same for every token. 
   * @param _isSBT If true, the POAP acts as a SBT.
   */
  constructor (
    string memory _name,
    string memory _symbol,
    string memory _baseUri,
    uint _maxSupply,
    bool _sameForAll,
    bool _isSBT
  ) ERC721 (_name, _symbol) {
    factory = IFactory(msg.sender);

    baseUri = _baseUri;
    maxSupply = _maxSupply;
    sameForAll = _sameForAll;
    isSBT = _isSBT;
  }

  /**
   * @notice Mint a POAP
   */
  function mint() external {
    require (maxSupply == 0 || this.totalSupply() + 1 <= maxSupply, "POAP: max supply reached.");

    _mint(msg.sender, totalSupply());
  }

  /**
   * @notice Mint a POAP to a specific address
   * @param _recipient Address that will receive the POAP
   * @dev This function can only be called by the relayer.
   */
  function mintTo(
    address _recipient
  ) external {
    require (_recipient != address(0), "POAP: invalid recipient");
    require (maxSupply == 0 || this.totalSupply() + 1 <= maxSupply, "POAP: max supply reached.");
    require (msg.sender == factory.relayer(), "POAP: not relayer");

    _mint(_recipient, totalSupply());
  }

  // OVERRIDES
  // compute base uri based on the sameForAll parameter
  function tokenURI(
    uint _tokenId
  ) public view override returns (string memory) {
    _requireMinted(_tokenId);

    string memory uri = baseUri;
    if (! sameForAll) {
      uri = bytes(uri).length > 0 ? string(abi.encodePacked(uri, _tokenId.toString())) : "";
    }

    return uri;
  }

  // add checks for SBTs
  function _beforeTokenTransfer(
    address from,
    address to,
    uint tokenId,
    uint batchSize
  ) internal override {
    super._beforeTokenTransfer(from, to, tokenId, batchSize);

    require(! isSBT || from == address(0), "POAP: token is SB");
  }
}