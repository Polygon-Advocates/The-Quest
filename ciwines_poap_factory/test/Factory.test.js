const { expectRevert } = require("@openzeppelin/test-helpers")
const { expect } = require("chai");

const poapABI = require("../artifacts/contracts/POAP.sol/POAP.json").abi

let owner, generic, relayer1, relayer2;
let factory;

describe("Factory", function () {

  describe("Setup", async () => {

    it("Get signers", async () => {
      [owner, generic, relayer1, relayer2] = await ethers.getSigners();
    })

    it("Deploy factory", async () => {
      const contractFactory = await ethers.getContractFactory("Factory");
      factory = await contractFactory.deploy(relayer1.address);

      await factory.deployed();
    })

  })

  describe("Deploy POAP", async () => {

    const baseUri = "ipfs://....";

    it("Deploy POAP", async () => {
      await factory.deployPOAP("Test", "TEST", baseUri, 1337, true, false);
    })

    it ("Only owner can deploy POAP", async () => {
      await expectRevert(factory.connect(generic).deployPOAP("Test", "TEST", baseUri, 1337, true, false), "Ownable: caller is not the owner");
    })

    it("Total poaps is correct", async () => {
      const total = await factory.totoalPoaps();

      expect(total).to.be.equal(1);
    })

    it("POAP address is stored correctly", async () => {
      const address = await factory.deployedPoaps(0);
      const poap = new ethers.Contract(address, poapABI, owner)

      const name = await poap.name();
      const symbol = await poap.symbol();
      const supply = await poap.maxSupply();
      const sameForAll = await poap.sameForAll();
      const isSBT = await poap.isSBT();

      expect(name).to.be.equal("Test")
      expect(symbol).to.be.equal("TEST")
      expect(supply).to.be.equal(1337)
      expect(sameForAll).to.be.equal(true)
      expect(isSBT).to.be.equal(false)

    })

    it("Change relayer address", async () => {
      await factory.changeRelayer(relayer2.address);

      const newRelayer = await factory.relayer();
      expect(newRelayer).to.be.equal(relayer2.address)
    })

    it("only owner can change relayer", async () => {
      await expectRevert(factory.connect(generic).changeRelayer(relayer2.address), "Ownable: caller is not the owner");
    })
  })

});
