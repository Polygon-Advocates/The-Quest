# QUEST-NFT

## What are we going to build?

In this tutorial we will be building an QUEST-NFT on Polygon zkEVM Testnet.

## Tech Stack Used

- Solidity
- Hardhat
- Ethers.js

## Prerequisites

- [Metamask Installed as extension in your Browser](https://www.geeksforgeeks.org/how-to-install-and-use-metamask-on-google-chrome/)

- [Nodejs](https://www.geeksforgeeks.org/installation-of-node-js-on-windows/) and [YARN](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable) Installed in your system

- [Knowledge of Git and GitHub](https://www.geeksforgeeks.org/ultimate-guide-git-github/?ref=gcse)

- [Install VS CODE](https://code.visualstudio.com/docs/setup/windows)or Any other IDE

## Let's start BUIDLing

### 1. Setting up the project

- Open your terminal and run the following commands

  - `mkdir QUESTNft`
  - `npx hardhat`
  - Select JS Project and install all the dependencies
  - `cd QUESTNft`

- Create `.env` file in the `QUESTNft` directory.

  - Go to [Alchemy](https://dashboard.alchemy.com/) and create a new account. Then create a new app and copy the URL and paste it in the `.env` file. Like this:
    `ALCHEMY_ZKEVM_HTTP_URL = "https://polygonzkevm-testnet.g.alchemy.com/v2/your-api-key"`
  - Go to our Metamask Wallet, copy the Private Key from there and paste it like this:
    `PRIVATE_KEY = Your Private Key`
  - Go to [zkEVM Polygon Scan](https://zkevm.polygonscan.com/myapikey), sign in and then create an API Key. After that paste it like this:
    `ZKEVM_ZKEVM_POLYGON_SCAN_KEY= Your zkEVM Polygon Scan Key`

- Go to `hardhat.config.js` and paste the following code in it:

```javascript
require("@nomicfoundation/hardhat-toolbox");
// require("@nomicfoundation/hardhat-verify");
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
          browserURL: "https://testnet-zkevm.polygonscan.com"
        }
      }
    ]
  },
};
```

Here we are importing the `hardhat-toolbox` which will help us to deploy our contract on Polygon Mumbai Testnet. We are also importing the `dotenv` which will help us to import the environment variables from the `.env` file. We are also importing the `ALCHEMY_HTTP_URL`, `PRIVATE_KEY` and `POLYGON_SCAN_KEY` from the `.env` file. We are also specifying the `solidity` version and the `networks` we are going to use. We are also specifying the `etherscan` API key for verifying the contract on Polygon Scan.

> So our development environment is ready!!!

---

---

### 2. Writing the Smart Contract

- Create new file `QUESTNft.sol` in the contracts folder
- Intiate the file with the imports required by our QUEST-NFT.

```solidity
    // SPDX-License-Identifier: MIT
    pragma solidity 0.8.18;

    import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
    import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
    import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
    import "@openzeppelin/contracts/utils/Counters.sol";
```

- here we are importing the following:

  - `ERC721` is the standard NFT contract provided by OpenZeppelin.
  - `ERC721URIStorage` is the contract that allows us to store the NFT's metadata on the blockchain.
  - `Counters` is a library that provides counters that can only be incremented or decremented by one. This is used to keep track of the tokenIds.

- Let's instantiate the contract with the following code:

```solidity
    contract QUESTNft is ERC721, ERC721URIStorage, ERC721Enumerable {
        using Counters for Counters.Counter;

        /// @dev Counter to keep track of the token Id
        Counters.Counter private _tokenIdCounter;

        /// @dev Address of the owner
        address owner;
    }
```

- here we have instantiated the contract with the name `QUESTNft` and we are inheriting the `ERC721` and `ERC721URIStorage` contracts. We are also using the `Counters` library to keep track of the tokenIds and defining an `owner` variable that will be used to store the address of the owner of the contract. The `owner` variable will be used to restrict the access of some functions to the owner of the contract.

- Let's start with the constructor now. The constructor will take the name and symbol of the NFT as parameters and will pass them to the constructor of the `ERC721` contract.

```solidity
    /// Constructor to initialize the ERC721 Token
    /// @param name Name of the ERC721 Token
    /// @param symbol Symbol of the ERC721 Token
    constructor(string memory name, string memory symbol)
        ERC721(name, symbol)
    {
        owner = msg.sender;
    }
```

Also `owner` variable is initialised here which will store the address of the deployer as the contructor is only intiated when deployed.

- Let's create our first modifier `onlyOnwer` which will be used to restrict the access of some functions to the owner of the contract.

```solidity
    /// Modifier to check if the caller is the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "ERR:NO");
        _;
    }
```

We create modifiers so we can reuse them in multiple functions. Here we are checking if the address of the caller of the function is equal to the `owner` address. If it is equal then the function will be executed otherwise an error message will be displayed. The `_` is used to execute the function in which the modifier is used.

- Let's mint our first NFT with the metadata uri

```solidity
    /// Function to mint the NFT
    /// @param to Address of the receiver
    /// @param uri Token URI of the NFT
    function safeMint(address to, string memory uri) external onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }
```

This function takes an address and the token URI as parameters. The `to` is the adddress the NFT is minted to and the `uri` is the link to the metadata of the NFT. Before executing anything this function will parameters will pass to the modifier `onlyOwner` as required to check whether the conditions are met or not. If the conditions are met the function get executed else it will be reverted with error. The function will first get the current tokenId from the `_tokenIdCounter` and then increment it. Then it will mint the NFT to the address passed as a parameter and set the token URI of the NFT. The `_safeMint` function is used to mint the NFT and the `_setTokenURI` function is used to set the token URI of the NFT.

- Let's write the function to transfer NFT

```solidity
    /// Function to trasfer the NFT
    /// @param to Receiver address
    /// @param tokenId Token Id of the NFT
    function transfer(address to, uint256 tokenId) external {
        safeTransferFrom(msg.sender, to, tokenId);
    }
```
This function is to transfer the NFT from one address to another. It takes the address of the receiver and the tokenId of the NFT as parameters. The `safeTransferFrom` function is provided by the `ERC721` contract and is used to transfer the NFT from one address to another. The `msg.sender` is used to get the address of the caller of the function.

- Let's write the overrides functions

```solidity
    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

````

These override functions are required by the solidity compiler to work properly. The `_burn` function is used to burn the NFT and the `tokenURI` function is used to get the token URI of the NFT. We are overriding these functions to use the functions of the `ERC721URIStorage` contract. The `super` keyword is used to call the functions of the parent contract.

> So we have written our contract.

---

---

### 3. Testing the Smart Contract

- Delete the `Lock.js` file from **test** folder

#### 1. Deploying the Smart Contract

- Create new file named `deploy.js` in **test** and paste the following code in the file

```javascript
const hre = require("hardhat");
const { expect } = require("chai");

describe("QUEST NFT Deployment", function () {

    it("Should deploy the NFT Contract", async function () {
        const [owner, user1] = await hre.ethers.getSigners();

        const NFT = await ethers.getContractFactory("QUESTNft");
        const nft = await NFT.deploy("QUESTNft", "QN");
        await nft.deployed().then((val) => {
            console.log("NFT Contract Deployed");
            console.log("Contract Address: " + nft.address);
        });


        expect(await nft.name()).to.equal("QUESTNft");
        expect(await nft.symbol()).to.equal("QN");
    });

    it("Should not deploy the NFT Contract", async function () {
        const [owner, user1] = await hre.ethers.getSigners();

        const NFT = await ethers.getContractFactory("QUESTNft");
        expect(NFT.deploy("QUESTNft")).to.be.revertedWith("ERROR");

    });

});
```

- Run `npx hardhat test test/deploy.js` to run the script.

This test is to check if the contract is deployed properly or not.

- In the first case
  We are checking the name and symbol of the NFT to check if the contract is deployed properly. We are also checking if the contract is deployed with the correct name and symbol.
- In the second case
  We are checking if the function is reverted with the correct error message. We are expecting the function to be reverted with the error message `ERROR`.

#### 2. Minting the NFT

- Create new file named `mint.js` in **test** and paste the following code in the file

```javascript
const hre = require("hardhat");
const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
describe("QUEST NFT Minting", function () {

    async function fixture() {
        const [owner, user1] = await hre.ethers.getSigners();
        const NFT = await ethers.getContractFactory("QUESTNft");
        const nft = await NFT.deploy("QUESTNft", "QN");
        return { owner, user1, nft };
    }

    it("Should mint the NFT", async function () {
        const { owner, user1, nft } = await loadFixture(fixture);
        await nft.safeMint(user1.address, "");
        expect(await nft.balanceOf(user1.address)).to.equal(1);
    });

    it("Should not mint the NFT", async function () {
        const { owner, user1, nft } = await loadFixture(fixture);
        expect(nft.connect(user1).safeMint(user1.address, "")).to.be.revertedWith("ERR:NO");

    }
    );
});
```

- Run `npx hardhat test test/mint.js` to test the code.

This is a simple test to check if the NFT is minted or not. We are using the `loadFixture` function to load the fixture. The fixture is a function that returns the objects that we want to use in our tests. We are using the `expect` function to check if the NFT is minted or not. The `expect` function is provided by the `chai` library. We are using the `revertedWith` function to check if the function is reverted or not. The `revertedWith` function is provided by the `hardhat` library.

- In the first test case we are checking if the NFT is minted or not.
- In the second test case we are checking if the function is reverted or not.

#### 3. Trasnsfering the NFT

- Create a new file named `transfer.js` in **test** and paste the following code in the file

```javascript
const hre = require("hardhat");
const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
describe("QUEST NFT Transfer", function () {

    async function fixture() {
        const [owner, user1, user2] = await hre.ethers.getSigners();
        const NFT = await ethers.getContractFactory("QUESTNft");
        const nft = await NFT.deploy("QUESTNft", "QN");
        await nft.deployed();

        await nft.connect(owner).safeMint(user1.address, "").then((val) => {
            console.log("NFT Minted");
        });

        return { owner, user1, user2, nft };
    }


    it("Should transfer the NFT", async function () {
        const { user1, user2, nft } = await loadFixture(fixture);

        await nft.connect(user1).transfer(user2.address, 0);
        expect(await nft.balanceOf(user1.address)).to.equal(0);
        expect(await nft.balanceOf(user2.address)).to.equal(1);
    });

    it("Should not transfer the NFT", async function () {
        const { user1, user2, nft } = await loadFixture(fixture);

        expect(nft.connect(user2).transfer(user1.address, 0)).to.be.revertedWith("ERC721: transfer caller is not owner nor approved");
    });
});
```

- Run `npx hardhat test test/transfer.js` to test the code.

This test is to check if the NFT is transferred or not.

- In the first test case we are checking if the NFT is transferred or not.
- In the second test case we are checking if the function is reverted or not.

> So you have successfully written and tested your smart contract.

---

---

### 4. Deploying and Verifying the Smart Contract

- Delete the `Lock.js` file from **scripts** folder and create new file named `deploy.js`
- Paste the following code in the file

```javascript
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  try {
    const NFT = await ethers.getContractFactory("QUESTNft");
    const nft = await NFT.deploy("QUESTNft", "QN");
    await nft.deployed();
    console.log("Contract address:", nft.address);

    console.log("Sleeping.....");
    await sleep(40000);

    await hre.run("verify:verify", {
      address: nft.address,
      constructorArguments: ["QUESTNft", "QN"],
    });
  } catch (error) {
    console.error(error);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

- Run `npx hardhat run scripts/deploy.js --network mumbai` to deploy and verify the contract on the Mumbai Testnet.

In this script we are deploying the smart contract and verifying it on the Mumbai Testnet. We are using `ethers` to interact with the smart contract and `hre` to verify the smart contract.
From `ethers` we are getting the **signer** and then we are getting the **contract factory**. We are using the **_contract factory to deploy the smart contract_**. After the contract is deployed we are getting the address of the contract and printing it.
We are using `sleep` function to wait for the contract to be deployed on the Mumbai Testnet, it is used because the contract is not deployed immediately after the transaction is mined. The contract is deployed after some time.
After that we are using `hre` to **verify** the smart contract. We are passing the address of the contract and the **constructor arguments** to the `verify` function.

> So you have successfully deployed and verified your smart contract on Polygon Mumbai Testnet.

---

---

---
