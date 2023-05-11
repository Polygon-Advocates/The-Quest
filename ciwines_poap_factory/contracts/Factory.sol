// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IFactory.sol";
import "./POAP.sol"; 

contract Factory is Ownable, IFactory {
  mapping (uint => address) public deployedPoaps;
  uint public totoalPoaps;
  address public override  relayer;

  /**
   * @notice Constructor
   * @param _relayer Address of the relayer that can mint POAPs to addresses
   */
  constructor (
    address _relayer
  ) {
    relayer = _relayer;
  } 

  /**
   * @notice Create a POAP
   * @param _name Name of the POAP
   * @param _symbol Symbol of the POAP
   * @param _baseUri Url of the assets.
   * @param _maxSupply Maximim amount of token to mint. If 0, supply is unlimited.
   * @param _sameForAll If true, the asset of the poap is the same for every token. 
   * @param _isSBT If true, the POAP acts as a SBT.
   */
  function deployPOAP (
    string memory _name,
    string memory _symbol,
    string memory _baseUri,
    uint _maxSupply,
    bool _sameForAll,
    bool _isSBT
  ) external onlyOwner {
    POAP poap = new POAP(_name, _symbol, _baseUri, _maxSupply, _sameForAll, _isSBT);

    deployedPoaps[totoalPoaps] = address(poap);
    totoalPoaps += 1;

    emit POAPDeployed(_name, block.timestamp, address(poap));
  }

  /**
   * @notice Change relayer address
   * @param _relayer New relayer address
   * @dev Only owner can change this
   */ 
  function changeRelayer (
    address _relayer
  ) external onlyOwner {
    relayer = _relayer;
  }
}