const { expectRevert } = require("@openzeppelin/test-helpers")
const { expect } = require("chai");

const poapABI = require("../artifacts/contracts/POAP.sol/POAP.json").abi

let deployer, user1, user2, relayer;
let poap;
let factory;

const name = "Name";
const symbol = "NAME";

const baseUriSameForAll = "ipfs://...............";
const baseUri = "ipfs://......../";

describe("POAP", function () {

  describe("Setup", async () => {

    it("Get signers", async () => {
      [deployer, user1, user2, relayer] = await ethers.getSigners();
    })

    it("Deploy factory", async () => {
      const contractFactory = await ethers.getContractFactory("Factory");
      factory = await contractFactory.deploy(relayer.address);

      await factory.deployed();
    })

  })

  describe("POAP as NFT with unlimited supply and same metadata for all", async () => {

    it("Deploy POAP", async () => {
      await factory.deployPOAP(name, symbol, baseUriSameForAll, 0, true, false);
      const address = await factory.deployedPoaps(0);
      poap = new ethers.Contract(address, poapABI, deployer)

      await poap.deployed();
    })

    it("Mint a token", async () => {
      await poap.connect(user1).mint();
    })

    it("User1 has the token 0", async () => {
      const owner = await poap.ownerOf(0);

      expect(owner).to.be.equal(user1.address);
    })

    it("POAP name is correct", async () => {
      const effName = await poap.name();

      expect(effName).to.be.equal(name);
    })

    it("POAP symbol is correct", async () => {
      const effSymbol = await poap.symbol();

      expect(effSymbol).to.be.equal(symbol);
    })

    it("POAP supply is correct", async () => {
      const supply = await poap.totalSupply();

      expect(supply).to.be.equal(1);
    })

    it("POAP total supply is correct", async () => {
      const supply = await poap.maxSupply();

      expect(supply).to.be.equal(0);
    })

    it("POAP should not be SBT", async () => {
      const isSBT = await poap.isSBT();

      expect(isSBT).to.be.equal(false);
    })

    it("POAP uri is correct", async () => {
      const uri = await poap.tokenURI(0);

      expect(uri).to.be.equal(baseUriSameForAll);
    })

    it("User1 can transfer token", async () => {
      await poap.connect(user1).transferFrom(user1.address, user2.address, 0);
    })

    it("User2 is owner of token 0", async () => {
      const owner = await poap.ownerOf(0);

      expect(owner).to.be.equal(user2.address);
    })

    it("Relayer mint to user 2", async () => {
      await poap.connect(relayer).mintTo(user2.address);
      const owner = await poap.ownerOf(1);

      expect(owner).to.be.equal(user2.address);
    })

    it("Only relayer can mint to other addresses", async () => {
      await expectRevert(poap.mintTo(user2.address), "POAP: not relayer");
    })

    it("Supply is actually not limited", async () => {
      for (let i = 0; i < 1000; i++) {
        await poap.mint();
      }
    })

  })

  describe("POAP as SBT with limited supply and different metadata for all", async () => {

    it("Deploy POAP", async () => {
      await factory.deployPOAP(name, symbol, baseUri, 15, false, true);
      const address = await factory.deployedPoaps(1);
      poap = new ethers.Contract(address, poapABI, deployer)
      await poap.deployed();
    })

    it("Mint a token", async () => {
      await poap.connect(user1).mint();
    })

    it("User1 has the token 0", async () => {
      const owner = await poap.ownerOf(0);

      expect(owner).to.be.equal(user1.address);
    })

    it("POAP supply is correct", async () => {
      const supply = await poap.totalSupply();

      expect(supply).to.be.equal(1);
    })

    it("POAP total supply is correct", async () => {
      const supply = await poap.maxSupply();

      expect(supply).to.be.equal(15);
    })

    it("POAP should be SBT", async () => {
      const isSBT = await poap.isSBT();

      expect(isSBT).to.be.equal(true);
    })

    it("POAP uri is correct", async () => {
      const uri = await poap.tokenURI(0);

      expect(uri).to.be.equal(baseUri + "0");
    })

    it("User1 cannot transfer token", async () => {
      await expectRevert(poap.connect(user1).transferFrom(user1.address, user2.address, 0), "POAP: token is SB");
    })

    it("Supply is limited", async () => {
      for (let i = 0; i < 14; i++) {
        await poap.mint();
      }

      await expectRevert(poap.mint(), "POAP: max supply reached.");
    })

  })

});
