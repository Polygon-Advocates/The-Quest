# Governance Contract

This is the README file for the Governance contract deployed on the Polygon zkEVM testnet at address `0x0138A6124eCb4741058Faeef5e38C26638a4Ae26`.

## Introduction

The Governance contract is designed to facilitate decentralized governance within a system. It allows members to propose and vote on various proposals, as well as participate in the election of administrators. The contract provides functionality for adding members, creating proposals, voting on proposals, and contesting for administrator positions.

## Contract Structure

The Governance contract consists of the following main components:

1. **Members**: A struct representing the members of the governance system. It contains the member's public key, points, and role.

2. **Proposals**: A struct representing the proposals made within the governance system. Each proposal has a unique identifier, a title, an initiator, vote counts, percentages, status, and timestamp.

3. **AdminAllocations**: A struct representing the administrator contestants. It includes the contestant's identifier, address, name, vote counts, percentages, total votes, and status.

4. **AdminContestants**: An array storing all the admin contestants.

5. **Members**: An array storing all the members of the governance system.

6. **Proposals**: An array storing all the proposals made within the system.

7. **SortContestants**: An array used for sorting the admin contestants based on vote percentages.

8. **SortedValue**: An array storing the sorted values of the admin contestants.

9. **registered**: A mapping to keep track of registered members.

10. **isAdmin**: A mapping to determine if an address has admin privileges.

11. **voted**: A mapping to track if a member has voted on a specific proposal.

12. **adminVoted**: A mapping to track if a member has voted in the admin contest.

## Functionality

The Governance contract provides the following functionality:

1. **addMembers**: Allows new members to join the governance system by paying a membership fee.

2. **addProposal**: Enables registered members to create new proposals.

3. **votingOnProposals**: Allows registered members to vote on proposals.

4. **stopProposal**: Allows the proposal initiator or an admin to stop a proposal and calculate the vote percentages.

5. **contestForAdmin**: Allows registered members to contest for admin positions by paying a fee.

6. **voteAdmin**: Enables registered members to vote for admin contestants.

7. **closeVoting**: Closes the voting for admin contestants and calculates the vote percentages.

8. **setAdmin**: Sets the address with the highest vote percentage as the new admin.

## Deployment

The Governance contract has been deployed on the Polygon zkEVM testnet at address `0x0138A6124eCb4741058Faeef5e38C26638a4Ae26`. To interact with the contract, you can use any Ethereum-compatible tool or library.

## Usage

To utilize the Governance contract, follow these steps:

1. Start by adding members to the governance system. Call the `addMembers` function, ensuring that the membership fee of 0.002 ETH is paid. This function registers a new member with their address, assigns them a role as "member," and initializes their points as 0.

2. Create proposals within the governance system. Only registered members can create proposals. Use the `addProposal` function, providing the title of the proposal as a parameter. This function assigns a unique proposal ID, sets the initiator as the calling address, initializes the vote counts to 0, and marks the proposal as active.

3. Vote on proposals. Use the `votingOnProposals` function to cast your vote on a specific proposal. Provide the vote (0 for against, 1 for in favor) and the proposal ID as parameters. Ensure you are a registered member and haven't voted on the same proposal before.

4. Stop a proposal. If you are the initiator of a proposal or an admin, you can stop it using the `stopProposal` function. Pass the proposal ID as a parameter. This function calculates the voting percentages, marks the proposal as inactive, and prevents further voting.

5. Contest for admin positions. Registered members can participate in admin elections by using the `contestForAdmin` function. Pay the required fee of 0.003 ETH and provide your name as a parameter. This function adds you as a contestant with a unique contestant ID, associates your address and name, and sets the initial vote counts to 0.

6. Vote for admin contestants. Use the `voteAdmin` function to cast your vote for a specific admin contestant. Provide the contestant ID and your vote (0 for against, 1 for in favor) as parameters. Ensure you are a registered member and the contestant exists.

7. Close the voting for admin contestants. Call the `closeVoting` function to end the voting period. This function calculates the voting percentages for each admin contestant based on the received votes.

8. Set the new admin. Invoke the `setAdmin` function to determine the admin with the highest vote percentage. This address will be designated as the new admin.

Note: Ensure that you interact with the deployed Governance contract on the Polygon zkEVM testnet at address `0x0138A6124eCb4741058Faeef5e38C26638a4Ae26`. Use appropriate tools or libraries compatible with Ethereum for contract interaction.
