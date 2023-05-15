

const hre = require("hardhat");
async function main() {
  const verifierContract = "zkNFTAGEMINT";
  // We get the contract to deploy
  const spongePoseidonLib = "0x12d8C87A61dAa6DD31d8196187cFa37d1C647153";
  const poseidon6Lib = "0xb588b8f07012Dc958aa90EFc7d3CF943057F17d7";

  const Cave = await hre.ethers.getContractFactory(verifierContract,{
    libraries: {
      SpongePoseidon: spongePoseidonLib,
      PoseidonUnit6L: poseidon6Lib
    },
  });
  // We set the constructor of the contract within a message
  const caveContract = await Cave.deploy();
  await caveContract.deployed();
  console.log("Cave deployed to:", caveContract.address);
  //console.log(process.env.ETHERSCAN_API_KEY);

  // console.log("verifying...");
  // await verify(caveContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });