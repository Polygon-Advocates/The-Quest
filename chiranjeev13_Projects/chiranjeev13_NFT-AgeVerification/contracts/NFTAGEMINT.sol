// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "../contracts-Pid/contracts/lib/GenesisUtils.sol";
import "../contracts-Pid/contracts/interfaces/ICircuitValidator.sol";
import "../contracts-Pid/contracts/verifiers/ZKPVerifier.sol";

contract zkNFTAGEMINT is ERC721, ZKPVerifier {
  uint64 public constant TRANSFER_REQUEST_ID = 1;

  mapping(uint256 => address) public idToAddress;
  mapping(address => uint256) public addressToId;

  constructor() ERC721("Birthday", "BPID") {
    baseUri = "https://gateway.pinata.cloud/ipfs/QmUqTDneahHpdaYSeKGMd5x1bccmBFC2jiFuFi7k3uJ7fx/json/";
    tokenId = 1;
  }
  string public baseUri;
  uint256 chk;

  uint cp = 0;
  uint256 public tokenId;

  function _beforeProofSubmit(
    uint64 /* requestId */,
    uint256[] memory inputs,
    ICircuitValidator validator
  ) internal view override {
    address addr = GenesisUtils.int256ToAddress(
      inputs[validator.getChallengeInputIndex()]
    );
    require(
      _msgSender() == addr,
      "address in the proof is not a sender address"
    );
  }

  function _afterProofSubmit(
    uint64 requestId,
    uint256[] memory inputs,
    ICircuitValidator validator
  ) internal override {
    require(
      requestId == TRANSFER_REQUEST_ID && addressToId[_msgSender()] == 0,
      "proof can not be submitted more than once"
    );
    uint256 id = inputs[validator.getChallengeInputIndex()];
    if (idToAddress[id] == address(0)) {
      
      _safeMint(msg.sender, tokenId);
      tokenId++;
      addressToId[_msgSender()] = id;
      idToAddress[id] = _msgSender();
    }
  }

  
}
