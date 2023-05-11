// SPDX-License-Identifier: MIT
// This line specifies the license under which the code is distributed. In this case, it uses the MIT license.

pragma solidity ^0.8.0;
// This line specifies the version of the Solidity compiler that should be used to compile the code. The caret (^) symbol indicates that any compatible compiler version greater than or equal to 0.8.0 can be used.

contract Fairvotingcommented {
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

    mapping(address => bool) public hasVoted;
    // This line declares a public mapping variable named "hasVoted" that maps addresses to booleans. It is used to keep track of whether an address has voted. Public mappings can be accessed from outside the contract.

    mapping(address => string) public userVotes;
    // This line declares a public mapping variable named "userVotes" that maps addresses to strings. It is used to store the voting choice of each address. Public mappings can be accessed from outside the contract.

    function voteForOptionA() public {
        require(!hasVoted[msg.sender], "You have already voted.");
        // This line uses the require statement to check if the sender's address has already voted. If the condition is false, it throws an exception with the error message "You have already voted."

        optionAVotes++;
        // This line increments the vote count for option A by one.

        hasVoted[msg.sender] = true;
        // This line marks the sender's address as having voted by setting its corresponding value in the "hasVoted" mapping to true.

        userVotes[msg.sender] = optionA;
        // This line stores the sender's vote choice (option A) in the "userVotes" mapping using their address as the key.
    }

    function voteForOptionB() public {
        require(!hasVoted[msg.sender], "You have already voted.");
        // This line uses the require statement to check if the sender's address has already voted. If the condition is false, it throws an exception with the error message "You have already voted."

        optionBVotes++;
        // This line increments the vote count for option B by one.

        hasVoted[msg.sender] = true;
        // This line marks the sender's address as having voted by setting its corresponding value in the "hasVoted" mapping to true.

        userVotes[msg.sender] = optionB;
        // This line stores the sender's vote choice (option B) in the "userVotes" mapping using their address as the key.
    }
}
