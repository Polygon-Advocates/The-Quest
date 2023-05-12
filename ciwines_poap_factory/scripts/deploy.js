const hre = require("hardhat");

async function main() {
  // NOTE: If you plan to use a relayer, change this address before the deploy
  // in order to save one transaction
  const relayerAddress = "0x0000000000000000000000000000000000000000";

  console.log("Deploying POAP Factory...");
  const contractFactory = await ethers.getContractFactory("Factory");
  const factory = await contractFactory.deploy(relayerAddress);
  await factory.deployed();
  console.log("POAP Factory deployed at address:", factory.address);

  console.log("Await 10 seconds for contract code verification...")
  await new Promise((f) => setTimeout(f, 10000));

  if (network.name !== "hardhat" && network.name !== "localhost") {
    try{
      run("verify:verify", {
        address: factory.address,
        constructorArguments: [relayerAddress],
      });  
    } catch (e) {
      console.log("POAP Factory already verified")
    } 
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
