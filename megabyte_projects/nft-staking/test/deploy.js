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
        const token = await TOKEN.deploy("QuestToken", "BT");
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
        expect(await staking.QuestNFT()).to.be.equal(nft.address);
    });
});