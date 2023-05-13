import { ethers } from "hardhat";

async function main() {
  const signer = ethers.getSigners();

  const VaultToken = await ethers.getContractFactory("VaultToken");
  const deployedVaultToken = await VaultToken.deploy();
  console.log(`Contract deployed to address: ${deployedVaultToken.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
