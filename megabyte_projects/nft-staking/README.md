# STAKING DAPP

## What are we going to build?

In this tutorial we will be building an Staking dApp on Polygon zkEVM Testnet.

## Tech Stack Used

- Solidity
- Hardhat
- Ethers.js

## Prerequisites

- [Metamask Installed as extension in your Browser](https://www.geeksforgeeks.org/how-to-install-and-use-metamask-on-google-chrome/)

- [Nodejs](https://www.geeksforgeeks.org/installation-of-node-js-on-windows/) and [YARN](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable) Installed in your system

- [Knowledge of Git and GitHub](https://www.geeksforgeeks.org/ultimate-guide-git-github/?ref=gcse)

- [Install VS CODE](https://code.visualstudio.com/docs/setup/windows) or Any other IDE

## Let's start BUIDLing

### 1. Setting up the project

- Open your terminal and run the following commands

  - `mkdir nft-staking`
  - `npx hardhat`
  - Select JS Project and install all the dependencies
  - `cd nft-staking`

- Create `.env` file in the `nft-staking` directory.

  - Go to [Alchemy](https://dashboard.alchemy.com/) and create a new account. Then create a new app and copy the URL and paste it in the `.env` file. Like this:
    `ALCHEMY_ZKEVM_HTTP_URL = "https://polygonzkevm-testnet.g.alchemy.com/v2/your-api-key"`
  - Go to our Metamask Wallet, copy the Private Key from there and paste it like this:
    `PRIVATE_KEY = Your Private Key`
  - Go to [zkEVM Polygon Scan](https://zkevm.polygonscan.com/myapikey), sign in and then create an API Key. After that paste it like this:
    `ZKEVM_POLYGON_SCAN_KEY= Your zkEVM Polygon Scan Key`

- Go to `hardhat.config.js` and paste the following code in it:

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const ALCHEMY_ZKEVM_HTTP_URL = process.env.ALCHEMY_ZKEVM_HTTP_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ZKEVM_POLYGON_SCAN_KEY = process.env.ZKEVM_POLYGON_SCAN_KEY;

module.exports = {
  solidity: "0.8.18",
  networks: {
    polygonzkevmtestnet: {
      url: ALCHEMY_ZKEVM_HTTP_URL,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      polygonzkevmtestnet: ZKEVM_POLYGON_SCAN_KEY,
    },
    customChains: [
      {
        network: "polygonzkevmtestnet",
        chainId: 1442,
        urls: {
          apiURL: "https://testnet-zkevm.polygonscan.com/apis",
          browserURL: "https://testnet-zkevm.polygonscan.com",
        },
      },
    ],
  },
};
```

Here we are importing the `hardhat-toolbox` which will help us to deploy our contract on Polygon Polygon zkEVM Testnet. We are also importing the `dotenv` which will help us to import the environment variables from the `.env` file. We are also importing the `ALCHEMY_ZKEVM_HTTP_URL`, `PRIVATE_KEY` and `ZKEVM_POLYGON_SCAN_KEY` from the `.env` file. We are also specifying the `solidity` version and the `networks` we are going to use. We are also specifying the `etherscan` API key for verifying the contract on Polygon Scan.

> So our development environment is ready!!!

---

---

### 2. Writing the Smart Contract

- Delete the `Lock.sol` file from the `contracts` folder an create a new file named as `QuestNFT.sol`
- Now instead of me explaining how to build an NFT contract, [@Lucifer0x17](https://twitter.com/@Lucifer0x17) did a great job explaining it in his [repo here](https://github.com/Lucifer0x17/The-Quest/blob/main/lucifer0x17_projects/QUEStNft/contracts/QUESTNft.sol).

For the staking dapp we will be requiring two more contracts, one for the **QuestToken** and the other for the **Staking Contract**. QuestToken will be our test token which we will mint for the staker and staking contract will be the contract which will be responsible for staking the QuestNFT and minting the QuestToken.

---

- Create a new file named `QuestToken.sol` in the `contracts` directory.
- Intiate the file with the imports required by our QuestToken.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
```

here we are importing the ERC20.sol is the standard ERC20 contract provided by OpenZeppelin.

- Let's instantiate the contract with the following code:

```solidity
contract QuestToken is ERC20 {
    /// @dev Address of the owner.
    address owner;

    /// Constructor to initialize the ERC20 Token
    /// @param name token name
    /// @param symbol token symbol
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        owner = msg.sender;
    }
```

here we have instantiated the contract with the name `QuestToken` and we are inheriting the ERC20 contract from OpenZeppelin. We are also initializing the owner of the contract with the `msg.sender` which is the address of the account that deployed the contract. The constructor will take the name and symbol of the Token as parameters and will pass them to the constructor of the `ERC20` contract.

- Let's create Mint Function for the QuestToken

```solidity
    /// Function to mint the token for a particular address.
    /// @param to Address of the receiver.
    /// @param amount Amount of token to be minted.
    function mintToken(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
```

here we have created a function named `mintToken` which will take the address of the receiver and the amount of token to be minted as parameters. This function will be called by the Staking Contract to mint the QuestToken for the staker. The `_mint` function is provided by the `ERC20` contract which we have inherited.

---

- Create a new file named `Staking.sol` in the `contracts` directory.
- Intiate the file with the imports required by our Staking Contract.

```solidity

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

import "./QuestToken.sol";
```

here we are importing the `IERC721` which is the interface of the ERC721 contract provided by OpenZeppelin. We are also importing the `ERC721Holder` which is the contract provided by OpenZeppelin which will help us to receive the NFTs. We are also importing the `QuestToken` contract which we have created in the previous step.

- Let's instantiate the contract with the following code:

```solidity
contract Staking is ERC721Holder {
    /// @notice NFT contract
    IERC721 public questNFT;

    /// @notice Token contract
    QuestToken public questToken;

    /// @dev owner of the contract
    address owner;

    /// @notice Emission rate per second
    uint256 public EMISSION_RATE = ((10 ** 18) / (uint256(1 days)));

    /// @notice Staking start time
    mapping(address => uint256) public tokenStakedAt;

    /// @notice Token ID of the staked NFT
    mapping(address => uint256) public stakeTokenId;

    /// @notice Constructor
    /// @param nft  NFT contract address
    /// @param token Token contract address
    constructor(address nft, address token) {
        questNFT = IERC721(nft);
        questToken = QuestToken(token);
    }
```

here we have instantiated the contract with the name `Staking` and inherited the `ERC721Holder`.
Then we have intialised several variables, the `questNFT` for **NFT contract** and the `questToken`for **Token contract**. We are also initializing the **owner** of the contract with the `msg.sender` which is the address of the account that deployed the contract. We have intialised the `EMISSION_RATE` with the value of **1 token per day**. We have also created two **mappings** named `tokenStakedAt` and `stakeTokenId` which will store the time at which the NFT was staked and the token ID of the staked NFT respectively. The constructor will take the address of the NFT contract and the Token contract as parameters and will pass them to the variables `questNFT` and `questToken` respectively.

- Let's create the function to stake the NFT

```solidity
    /// Function to stake the NFT
    /// This will transfer the NFT to the contract, and start the staking timer for the user.
    /// @param tokenId Token ID of the NFT to stake
    function stakeNFT(uint256 tokenId) external {
        require(questNFT.ownerOf(tokenId) == msg.sender, "ERR:NO");
        questNFT.safeTransferFrom(msg.sender, address(this), tokenId);
        tokenStakedAt[msg.sender] = block.timestamp;
        stakeTokenId[msg.sender] = tokenId;
    }
```

here we have created a function named `stakeNFT` which will take the token ID of the NFT to be staked as a parameter. This function will be called by the user to stake the NFT. We are first checking if the user is the owner of the NFT, if yes then we are transferring the NFT to the contract using the `safeTransferFrom` function provided by the `IERC721` interface. We are also storing the time at which the NFT was staked in the `tokenStakedAt` mapping and the token ID of the staked NFT in the `stakeTokenId` mapping.

> Note: The `safeTransferFrom` function will only work if the owner of the NFT has approved the contract to transfer the NFT. For that we will be using the `approve` function provided by the `IERC721` interface which will be called by the user before calling the `stakeNFT` function directly from the frontend.

- Let's create a function to calculate reward amount user is going to receive when unstaking the NFT.

```solidity
    /// Function to calculate the reward for the staker
    /// @param staker Address of the staker
    function calculateReward(address staker) public view returns (uint256) {
        require(tokenStakedAt[staker] != 0, "ERR:NS");
        uint256 time = block.timestamp - tokenStakedAt[staker];
        return (time * EMISSION_RATE);
    }
```

here we have created a function named `calculateReward` which will take the address of the staker as a parameter. This function will be called by the user to calculate the reward amount he/she is going to receive when unstaking the NFT. We are first checking if the user has staked the NFT or not, if yes then we are calculating the time for which the NFT was staked and multiplying it with the `EMISSION_RATE` to get the reward amount.

- Let's create a function to unstake the NFT

```solidity
    /// Function to unstake the NFT
    /// This will transfer the NFT back to the user, and mint the reward for the user.
    /// @param tokenId Token ID of the NFT to unstake
    function unStakeNFT(uint256 tokenId) external {
        require(stakeTokenId[msg.sender] == tokenId, "ERR:NY");
        uint256 rewardAmount = calculateReward(msg.sender);

        questNFT.safeTransferFrom(address(this), msg.sender, tokenId);

        questToken.mintToken(msg.sender, rewardAmount);

        delete stakeTokenId[msg.sender];
        delete tokenStakedAt[msg.sender];
    }
}
```

here we have created a function named `unStakeNFT` which will take the token ID of the NFT to be unstaked as a parameter. This function will be called by the user to unstake the NFT. We are first checking if the user has staked the NFT or not, if yes then we are calculating the reward amount using the `calculateReward` function and minting the reward amount for the user using the `mintToken` function of the `QuestToken` contract. We are also transferring the NFT back to the user using the `safeTransferFrom` function provided by the `IERC721` interface. Then we are deleting the token ID of the staked NFT and the time at which the NFT was staked from the `stakeTokenId` and `tokenStakedAt` mappings respectively.

> So we have written all the contracts required by our staking dapp.

---

---

### 3. Testing the Smart Contract

Delete the `Lock.js` file from the `test` folder.

````javascript

##### 1. Testing the Deployment of the Smart Contracts.

- Create a new file named `deploy.js` in the `test` folder and add the following code:

```javascript
const hre = require("hardhat");
const { expect } = require("chai");

describe("Staking Contract Deployment", function () {
  it("Should deploy the Staking Contract", async function () {
    const [owner, user1] = await hre.ethers.getSigners();

    const NFT = await ethers.getContractFactory("QuestNFT");
    const nft = await NFT.deploy("QuestNFT", "QN");
    await nft.deployed().then((val) => {
      console.log("NFT Contract Deployed");
      console.log("Contract Address: " + nft.address);
    });

    const TOKEN = await ethers.getContractFactory("QuestToken");
    const token = await TOKEN.deploy("QuestToken", "QT");
    await token.deployed().then((val) => {
      console.log("Token Contract Deployed");
      console.log("Contract Address: " + token.address);
    });

    const STAKING = await ethers.getContractFactory("Staking");
    const staking = await STAKING.deploy(nft.address, token.address);
    await staking.deployed().then((val) => {
      console.log("Staking Contract Deployed");
      console.log("Contract Address: " + staking.address);
    });

    expect(await staking.questToken()).to.be.equal(token.address);
    expect(await staking.questNFT()).to.be.equal(nft.address);
  });
});
````

- Run `npx hardhat test test/deploy.js` to run the script.

This test is to check whether our contract is deployed successfully or not. We are first deploying the `QuestNFT` and `QuestToken` contracts and then deploying the `Staking` contract. We are also checking if the `questToken` and `questNFT` variables of the `Staking` contract are set to the address of the `QuestToken` and `QuestNFT` contracts respectively.

### 2. Testing the `stakeNFT` function

- Create a new file named `stake.js` in the `test` folder and add the following code:

```javascript
const hre = require("hardhat");
const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Staking Function", function () {
  async function fixture() {
    const [deployer, user1] = await hre.ethers.getSigners();

    const nft = await hre.ethers.getContractFactory("QuestNFT");
    const nftContract = await nft.deploy("QuestNFT", "QN");
    await nftContract.deployed();

    const token = await hre.ethers.getContractFactory("QuestToken");
    const tokenContract = await token.deploy("QuestToken", "QT");
    await tokenContract.deployed();

    const staking = await hre.ethers.getContractFactory("Staking");
    const stakingContract = await staking.deploy(
      nftContract.address,
      tokenContract.address
    );
    await stakingContract.deployed();

    await nftContract
      .connect(deployer)
      .safeMint(user1.address, "")
      .then((val) => {
        console.log("NFT Minted");
      });

    return { deployer, user1, nftContract, tokenContract, stakingContract };
  }

  it("Should stake the NFT", async function () {
    const { user1, nftContract, tokenContract, stakingContract } =
      await loadFixture(fixture);
    await nftContract
      .connect(user1)
      .setApprovalForAll(stakingContract.address, true)
      .then((val) => {
        console.log("NFT Approved");
      });

    await stakingContract
      .connect(user1)
      .stakeNFT(0)
      .then((val) => {
        console.log("NFT Staked");
      });

    expect(await nftContract.balanceOf(user1.address)).to.equal(0);
    expect(await nftContract.balanceOf(stakingContract.address)).to.equal(1);
  });
});
```

- Run `npx hardhat test test/stake.js` to run the script.

This test is to check whether the `stakeNFT` function is working properly or not. We are first deploying the `QuestNFT` and `QuestToken` contracts and then deploying the `Staking` contract. We are also minting an NFT for the user and approving the `Staking` contract to transfer the NFT on behalf of the user. Then we are calling the `stakeNFT` function of the `Staking` contract and checking if the NFT is transferred to the `Staking` contract or not.

### 3. Testing the `unStakeNFT` function

- Create a new file named `unstake.js` in the `test` folder and add the following code:

```javascript
const hre = require("hardhat");
const { expect } = require("chai");
const {
  loadFixture,
  time,
} = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("ethers");

describe("Unstaking Function", function () {
  async function fixture() {
    const [deployer, user1] = await hre.ethers.getSigners();

    const nft = await hre.ethers.getContractFactory("QuestNFT");
    const nftContract = await nft.deploy("QuestNFT", "QN");
    await nftContract.deployed();

    const token = await hre.ethers.getContractFactory("QuestToken");
    const tokenContract = await token.deploy("QuestToken", "QT");
    await tokenContract.deployed();

    const staking = await hre.ethers.getContractFactory("Staking");
    const stakingContract = await staking.deploy(
      nftContract.address,
      tokenContract.address
    );
    await stakingContract.deployed();

    await nftContract
      .connect(deployer)
      .safeMint(user1.address, "")
      .then((val) => {
        console.log("NFT Minted");
      });

    await nftContract
      .connect(user1)
      .setApprovalForAll(stakingContract.address, true)
      .then((val) => {
        console.log("NFT Approved");
      });

    await stakingContract
      .connect(user1)
      .stakeNFT(0)
      .then((val) => {
        console.log("NFT Staked");
      });

    return { deployer, user1, nftContract, tokenContract, stakingContract };
  }

  it("Should unstake the NFT", async function () {
    const { user1, nftContract, tokenContract, stakingContract } =
      await loadFixture(fixture);

    await time.increase(3600 * 24 + 1);

    const rewardAmount = await stakingContract.calculateReward(user1.address);
    console.log("Reward Amount: ", rewardAmount.toString());

    await stakingContract.connect(user1).unStakeNFT(0);

    expect(await nftContract.balanceOf(user1.address)).to.equal(1);
    expect(await nftContract.balanceOf(stakingContract.address)).to.equal(0);
    expect(await nftContract.ownerOf(0)).to.equal(user1.address);
    expect(await tokenContract.balanceOf(user1.address)).to.gt(rewardAmount);
  });
});
```

- Run `npx hardhat test test/unstake.js` to run the script.

This test is to check whether the `unStakeNFT` function is working properly or not. We are first deploying the `QuestNFT` and `QuestToken` contracts and then deploying the `Staking` contract. We are also minting an NFT for the user and approving the `Staking` contract to transfer the NFT on behalf of the user. Then we are calling the `stakeNFT` function of the `Staking` contract and checking if the NFT is transferred to the `Staking` contract or not. Then we are increasing the time by 1 day and calling the `unStakeNFT` function of the `Staking` contract and checking if the NFT is transferred back to the user or not.

> So now you have successfully written and tested your smart contract.

## --

### 4. Deploying and verifying the smart contracts to the Polygon Polygon zkEVM Testnet

- Delete the `Lock.js` file from `scripts` folder and create new file named `deploy.js`.

- Paste the following code.

```js
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  try {
    const NFT = await ethers.getContractFactory("QuestNFT");
    const nft = await NFT.deploy("QuestNFT", "QN");
    await nft.deployed();
    console.log("NFT Contract Address:", nft.address);

    const TOKEN = await ethers.getContractFactory("QuestToken");
    const token = await TOKEN.deploy("QuestToken", "QT");
    await token.deployed();
    console.log("Token Contract Address:", token.address);

    const STAKING = await ethers.getContractFactory("Staking");
    const staking = await STAKING.deploy(nft.address, token.address);
    await staking.deployed();
    console.log("Staking Contract Address:", staking.address);

    await hre.run("verify:verify", {
      address: nft.address,
      constructorArguments: ["QuestNFT", "QN"],
    });

    await hre.run("verify:verify", {
      address: token.address,
      constructorArguments: ["QuestToken", "QT"],
    });

    await hre.run("verify:verify", {
      address: staking.address,
      constructorArguments: [nft.address, token.address],
    });
  } catch (error) {
    console.error(error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

- Run `npx hardhat run scripts/deploy.js --network mumbai` to deploy and verify the contract on the Polygon zkEVM Testnet.

Through this script we are deploying the `QuestNFT`, `QuestToken` and `Staking` contracts and verifying them on the Polygon zkEVM Testnet. We are using `ethers` to interact with the smart contracts and `hardhat` to deploy and verify the contracts.

> So now you have successfully deployed and verified the smart contracts on the Polygon zkEVM Testnet.

---

---

If you have any queries PING ME on Telegram [@megabyte0x](https://t.me/megabyte0x)

Keep BUIDLing (:bricks:,:rocket:)

---

---
