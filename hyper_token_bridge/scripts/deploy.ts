import { ethers } from "hardhat";
import { CONSTANTS } from "../assets/constants";

async function main() {
  const ENDPOINT_ADDRESS = CONSTANTS.TESTNET.ENDPOINTS.MUMBAI;
  const SWAP_ROUTER_ADDRESS = CONSTANTS.TESTNET.UNISWAP_ROUTER_V3.MUMBAI;
  const STABLE_ASSET_ADDRESS = CONSTANTS.TESTNET.STABLE_ASSET.MUMBAI_USDC;
  const WRAPPED_ASSET_ADDRESS = CONSTANTS.TESTNET.WRAPPED_ASSET.WMATIC;
  const UNISWAP_FACTORY_V3_ADDRESS =
    CONSTANTS.TESTNET.UNISWAP_FACTORY_V3.MUMBAI;

  const TokenBridgeHyper = await ethers.getContractFactory("TokenBridgeHyper");
  const tokenBridgeHyper = await TokenBridgeHyper.deploy(
    ENDPOINT_ADDRESS,
    SWAP_ROUTER_ADDRESS,
    STABLE_ASSET_ADDRESS,
    WRAPPED_ASSET_ADDRESS,
    UNISWAP_FACTORY_V3_ADDRESS
  );

  await tokenBridgeHyper.deployed();

  console.log(tokenBridgeHyper);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
