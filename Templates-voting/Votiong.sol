// SPDX-License-Identifier: MIT  
pragma solidity ^0.8.0;

contract Voting {
    string public question="who is cooler";
    string public optionA="superman";
    string public optionB="spiderman";
    uint public optionAVotes;
    uint public optionBVotes;

    function voteForOptionA() public {
        optionAVotes++;
    }

    function voteForOptionB() public {
        optionBVotes++;
    }

}
