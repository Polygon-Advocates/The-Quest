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
        const tokenContract = await token.deploy("QuestToken", "BT");
        await tokenContract.deployed();

        const staking = await hre.ethers.getContractFactory("Staking");
        const stakingContract = await staking.deploy(nftContract.address, tokenContract.address);
        await stakingContract.deployed();

        await nftContract.connect(deployer).safeMint(user1.address, "").then((val) => {
            console.log("NFT Minted");
        });



        return { deployer, user1, nftContract, tokenContract, stakingContract };
    }

    it("Should stake the NFT", async function () {
        const { user1, nftContract, tokenContract, stakingContract } = await loadFixture(fixture);
        await nftContract.connect(user1).setApprovalForAll(stakingContract.address, true).then((val) => {
            console.log("NFT Approved");
        });

        await stakingContract.connect(user1).stakeNFT(0).then((val) => {
            console.log("NFT Staked");
        });

        expect(await nftContract.balanceOf(user1.address)).to.equal(0);
        expect(await nftContract.balanceOf(stakingContract.address)).to.equal(1);
    });

})