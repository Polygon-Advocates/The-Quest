// SPDX-License-Identifier: MIT
// This comment specifies the license under which the code is distributed. In this case, it uses the MIT license.

pragma solidity ^0.8.0;
// This line specifies the version of the Solidity compiler that should be used to compile the code. The caret (^) symbol indicates that any compatible compiler version greater than or equal to 0.8.0 can be used.

contract Fairvoting {
    string public question = "Who is cooler?";
    // This line declares a public string variable named "question" and assigns it the value "Who is cooler?". Public variables can be accessed from outside the contract.

    string public optionA;
    // This line declares a public string variable named "optionA" to store the first voting option. Public variables can be accessed from outside the contract.

    string public optionB;
    // This line declares a public string variable named "optionB" to store the second voting option. Public variables can be accessed from outside the contract.

    uint public optionAVotes;
    // This line declares a public uint (unsigned integer) variable named "optionAVotes" to track the number of votes for option A. Public variables can be accessed from outside the contract.

    uint public optionBVotes;
    // This line declares a public uint (unsigned integer) variable named "optionBVotes" to track the number of votes for option B. Public variables can be accessed from outside the contract.

    mapping(address => bool) public hasVoted;
    // This line declares a public mapping variable named "hasVoted" that maps addresses to booleans. It is used to keep track of whether an address has voted. Public mappings can be accessed from outside the contract.

    mapping(address => string) public userVotes;
    // This line declares a public mapping variable named "userVotes" that maps addresses to strings. It is used to store the voting choice of each address. Public mappings can be accessed from outside the contract.

    function setOptions(string memory _optionA, string memory _optionB) public {
        optionA = _optionA;
        optionB = _optionB;
    }
    // This function allows the contract owner or authorized parties to set the options (option A and option B) by passing them as parameters.

    function vote(string memory choice) public {
        require(!hasVoted[msg.sender], "You have already voted.");
        // This line uses the require statement to check if the sender's address has already voted. If the condition is false, it throws an exception with the error message "You have already voted."

        require(keccak256(bytes(choice)) == keccak256(bytes(optionA)) || keccak256(bytes(choice)) == keccak256(bytes(optionB)), "Invalid choice.");
        // This line uses the require statement to check if the choice matches either option A or option B. If the condition is false, it throws an exception with the error message "Invalid choice."

        if (keccak256(bytes(choice)) == keccak256(bytes(optionA))) {
            optionAVotes++;
            // If the choice matches option A, this line increments the vote count for option A by one.
        } else if (keccak256(bytes(choice)) == keccak256(bytes(optionB))) {
            optionBVotes++;
            // If the choice matches option B, this line increments the vote count for option B by one.
        }

        hasVoted[msg.sender] = true;
        // This line marks the sender's address as having voted by setting its corresponding value in the "hasVoted" mapping to true.

        userVotes[msg.sender] = choice;
        //
