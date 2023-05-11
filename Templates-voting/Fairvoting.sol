// SPDX-License-Identifier: MIT  
//This contract lets one address vote only once.
pragma solidity ^0.8.0;

contract Fairvoting {
    string public question = "who is cooler";
    string public optionA = "superman";
    string public optionB = "spiderman";
    uint public optionAVotes;
    uint public optionBVotes;

    mapping(address => bool) public hasVoted;
    mapping(address => string) public userVotes;

    function voteForOptionA() public {
        require(!hasVoted[msg.sender], "You have already voted.");
        optionAVotes++;
        hasVoted[msg.sender] = true;
        userVotes[msg.sender] = optionA;
    }

    function voteForOptionB() public {
        require(!hasVoted[msg.sender], "You have already voted.");
        optionBVotes++;
        hasVoted[msg.sender] = true;
        userVotes[msg.sender] = optionB;
    }

}
