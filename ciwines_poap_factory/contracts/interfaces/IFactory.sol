// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IFactory {
  function relayer() external view returns (address);

  event POAPDeployed(string indexed name, uint indexed timestamp, address indexed poap);
}