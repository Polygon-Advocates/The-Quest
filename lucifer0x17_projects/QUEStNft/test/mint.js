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