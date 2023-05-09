// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DAO {
    // Events
    event Log(bytes mesg, address newJoinee); // For emitting message and new joined member
    event Voted(address voter, string question, bool vote); // For emitting message when a member votes

    // Variables
    address[] public members;  // This will contain all the members in the DAO
    mapping(address => bool) public isMember;  // This will contain the boolean value whether the member exists or not
    string[] public questions;
    mapping(string => mapping(address => bool)) public didVoted;
    mapping(string => uint) public yesVotes;
    mapping(string => uint) public noVotes;
  
    // Modifiers
    modifier onlyMembers() {
        require(isMember[msg.sender] == true);
        _;
    }

    // Function to enter DAO
    function joinDAO() public {
        members.push(msg.sender);
        isMember[msg.sender] = true;
        emit Log("New member joined", msg.sender);
    } 

    // Function for creating voting questions
    function createVotingQuestion(string memory _question) public onlyMembers {
        questions.push(_question);
        yesVotes[_question] = 0;
        noVotes[_question] = 0;
    }                       

    // Function for voting on questions
    function vote(string memory _question, bool _vote) public onlyMembers {
        require(didVoted[_question][msg.sender] == false, "You have already voted on this question.");
        didVoted[_question][msg.sender] = true;
        if (_vote == true) {
            yesVotes[_question] += 1;
        } else {
            noVotes[_question] += 1;
        }
        emit Voted(msg.sender, _question, _vote);
    }
}
