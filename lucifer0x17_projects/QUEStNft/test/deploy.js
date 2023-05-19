const hre = require("hardhat");
const { expect } = require("chai");

describe("NFT Collection Deployment", function () {

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