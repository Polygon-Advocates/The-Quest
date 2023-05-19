// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @title QuestNFT Contract
/// @author Megabyte
/// @notice This contract is used to mint NFTs and transfer them.
contract QuestNFT is ERC721, ERC721URIStorage, ERC721Enumerable {
    using Counters for Counters.Counter;

    /// @dev Counter to keep track of the token Id
    Counters.Counter private _tokenIdCounter;

    /// @dev Address of the owner
    address owner;

    /// Constructor to initialize the ERC721 Token
    /// @param name Name of the ERC721 Token
    /// @param symbol Symbol of the ERC721 Token
    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        owner = msg.sender;
    }

    /// Modifier to check if the caller is the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "ERR:NO");
        _;
    }

    /// Function to get the Token URI of the NFT
    /// @param tokenId Token Id of the NFT
    function getTokenURI(uint256 tokenId) public view returns (string memory) {
        return tokenURI(tokenId);
    }

    /// Function to mint the NFT
    /// @param to Address of the receiver
    /// @param uri Token URI of the NFT
    function safeMint(address to, string memory uri) external onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    /// Function to trasfer the NFT
    /// @param to Receiver address
    /// @param tokenId Token Id of the NFT
    function transfer(address to, uint256 tokenId) external {
        safeTransferFrom(msg.sender, to, tokenId);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}