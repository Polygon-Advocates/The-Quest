// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;


import "./sortUtils.sol";
contract Governance is QuickSort{
  struct members {
    address publicKey;
    uint256 points;
    string role;
  }

  struct proposals {
    uint256 proposalId;
    string title;
    address initiator;
    uint256 forVotes;
    uint256 againstVotes;
    uint256 forPercentage;
    uint256 againstPercentage;
    bool status;
    uint256 timeInitiated;
    uint256 totalVotes;
  }

  struct adminAllocations {
    uint256 contestantId;
    address candidate;
    string name;
    uint256 forVotes;
    uint256 againstVotes;
    uint256 forPercentage;
    uint256 againstPercentage;
    uint256 totalVotes;
    bool status;
  }

  adminAllocations[] public adminContestants;
  members[] public Members;
  proposals[] public Proposals;
  uint256[] public sortContestants;
  uint[] public sortedValue;

  uint256 _proposalId = 0;
  uint256 _contestantId = 0;

  mapping(address => bool) registered;
  mapping(address => bool) isAdmin;
  mapping(address => mapping(uint256 => bool)) voted;
  mapping(address => mapping(uint256 => bool)) adminVoted;

  //mapping(address => adminAllocations) adminContestants;

  constructor() {
    isAdmin[msg.sender] = true;
  }

  function addMembers() public payable returns (bool) {
    require(registered[msg.sender] != true, "Already In");
    require(msg.value == 2000000000000000, "e"); // 0.002 eth
    Members.push(members(msg.sender, 0, "member"));
    return true;
  }

  function addProposal(string memory title) public returns (bool) {
    require(registered[msg.sender] == true, "Not registered");
    Proposals.push(
      proposals(
        _proposalId,
        title,
        msg.sender,
        0,
        0,
        0,
        0,
        true,
        block.timestamp,
        0
      )
    );
    _proposalId++;
  }

  function votingOnProposals(
    uint256 vote,
    uint256 proposalId
  )
    public
    returns (
      bool // vote = 0-against 1-for
    )
  {
    require(registered[msg.sender] == true, "Not registered");
    require(
      Proposals[proposalId].status == true,
      "Proposal Not valid or ended"
    );
    require(voted[msg.sender][proposalId] == false, "Already Voted");
    if (vote == 0) {
      Proposals[proposalId].againstVotes++;
      Proposals[proposalId].totalVotes++;
      return true;
    } else if (vote == 1) {
      Proposals[proposalId].forVotes++;
      Proposals[proposalId].totalVotes++;
      return true;
    }
    voted[msg.sender][proposalId] == true;
  }

  function stopProposal(uint256 proposalId) public returns (bool) {
    require(
      Proposals[proposalId].initiator == msg.sender || isAdmin[msg.sender],
      "Not the propsal initiator or admin"
    );
    Proposals[proposalId].forPercentage =
      Proposals[proposalId].forVotes /
      Proposals[proposalId].totalVotes;
    Proposals[proposalId].againstPercentage =
      Proposals[proposalId].againstVotes /
      Proposals[proposalId].totalVotes;
    Proposals[proposalId].status = false;
    return true;
  }

  function contestForAdmin(string memory _name) public payable returns (bool) {
    require(registered[msg.sender] == true, "Not Member");
    require(msg.value == 3000000000000000, "Not enough");

    adminContestants.push(
      adminAllocations(_contestantId, msg.sender, _name, 0, 0, 0, 0, 0, true)
    );
    _contestantId++;
    return true;
  }

  function voteAdmin(
    uint256 _contestantId,
    uint256 vote
  ) public returns (bool) {
    require(registered[msg.sender] == true, "Not registered");
    require(adminContestants[_contestantId].status == true, "Not existing");

    if (vote == 1) {
      adminContestants[_contestantId].forVotes++;
      adminContestants[_contestantId].totalVotes++;
      return true;
    } else if (vote == 0) {
      adminContestants[_contestantId].againstVotes++;
      adminContestants[_contestantId].totalVotes++;
      return true;
    }
  }

  function closeVoting() public {
    for (uint256 i = 0; i <= _contestantId; i++) {
      adminContestants[i].forPercentage =
        adminContestants[i].forVotes /
        adminContestants[i].totalVotes;
      adminContestants[i].againstPercentage =
        adminContestants[i].againstVotes /
        adminContestants[i].totalVotes;
    }

    setAdmin();
  }

  function setAdmin() public {
    for (uint256 i = 0; i <= _contestantId; i++) {
      sortContestants.push(adminContestants[i].forPercentage);
    }
    sortedValue = sort(sortContestants); //top votes

    
    for (uint256 i = 0; i <= _contestantId; i++) {
      if(sortedValue[_contestantId]==adminContestants[i].forPercentage)
      {
        isAdmin[adminContestants[i].candidate] = true; // admin set
        break;
      }
    }
  }
}
