// SPDX-License-Identifier: MIT
// This line specifies the license under which the code is distributed. In this case, it uses the MIT license.

pragma solidity ^0.8.0;
// This line specifies the version of the Solidity compiler that should be used to compile the code. The caret (^) symbol indicates that any compatible compiler version greater than or equal to 0.8.0 can be used.

contract Voting {
    string public question = "who is cooler";
    // This line declares a public string variable named "question" and assigns it the value "who is cooler". Public variables can be accessed from outside the contract.

    string public optionA = "superman";
    // This line declares a public string variable named "optionA" and assigns it the value "superman". Public variables can be accessed from outside the contract.

    string public optionB = "spiderman";
    // This line declares a public string variable named "optionB" and assigns it the value "spiderman". Public variables can be accessed from outside the contract.

    uint public optionAVotes;
    // This line declares a public uint (unsigned integer) variable named "optionAVotes". Public variables can be accessed from outside the contract.

    uint public optionBVotes;
    // This line declares a public uint (unsigned integer) variable named "optionBVotes". Public variables can be accessed from outside the contract.

    function voteForOptionA() public {
        optionAVotes++;
        // This line increments the vote count for option A by one.
    }

    function voteForOptionB() public {
        optionBVotes++;
        // This line increments the vote count for option B by one.
    }
}
