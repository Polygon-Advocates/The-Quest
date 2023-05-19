// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title QuestToken Contract
/// @author Megabyte
/// @notice This contract is used to mint tokens.
contract QuestToken is ERC20 {
    /// @dev Address of the owner.
    address owner;

    /// Constructor to initialize the ERC20 Token
    /// @param name token name
    /// @param symbol token symbol
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        owner = msg.sender;
    }

    /// Function to mint the token for a particular address.
    /// @param to Address of the receiver.
    /// @param amount Amount of token to be minted.
    function mintToken(address to, uint256 amount) external {
        _mint(to, amount);
    }
}