// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
//here the options and voting is through frontend


contract Fairvoting {
    string public question = "Who is cooler?";
    string public optionA;
    string public optionB;
    uint public optionAVotes;
    uint public optionBVotes;

    mapping(address => bool) public hasVoted;
    mapping(address => string) public userVotes;

    function setOptions(string memory _optionA, string memory _optionB) public {
        optionA = _optionA;
        optionB = _optionB;
    }

    function vote(string memory choice) public {
        require(!hasVoted[msg.sender], "You have already voted.");
        require(keccak256(bytes(choice)) == keccak256(bytes(optionA)) || keccak256(bytes(choice)) == keccak256(bytes(optionB)), "Invalid choice.");

        if (keccak256(bytes(choice)) == keccak256(bytes(optionA))) {
            optionAVotes++;
        } else if (keccak256(bytes(choice)) == keccak256(bytes(optionB))) {
            optionBVotes++;
        }

        hasVoted[msg.sender] = true;
        userVotes[msg.sender] = choice;
    }
}