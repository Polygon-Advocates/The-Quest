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