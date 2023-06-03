// import { CONSTANTS } from "../assets/constants";
const { CONSTANTS } = require("../assets/constants");

module.exports = async function (taskArgs, hre) {
  const signers = await ethers.getSigners();
  const owner = signers[0];
  //   console.log("SIGNER ADDRESS :", owner);

  const HyperTokenBridgeAddress = CONSTANTS.DEPLOYED_ADDRESSES.POLYGON_MUMBAI;
  const USDC_token_address = CONSTANTS.TESTNET.STABLE_ASSET.MUMBAI_USDC;

  const balanceNativeContract = await ethers.provider.getBalance(
    HyperTokenBridgeAddress
  );
  const balanceNativeUser = await ethers.provider.getBalance(owner.address);

  const USDC_contract = await ethers.getContractAt("ERC20", USDC_token_address);
  const balanceUSDCContract = await USDC_contract.balanceOf(
    HyperTokenBridgeAddress
  );
  const balanceUSDCUser = await USDC_contract.balanceOf(owner.address);

  console.log("Balances :\n-----------");
  console.log("NATIVE BALANCE [USER] :", balanceNativeUser);
  console.log("NATIVE BALANCE [CONTRACT] :", balanceNativeContract);
  console.log("USDC BALANCE [USER] :", balanceUSDCUser);
  console.log("USDC BALANCE [CONTRACT] :", balanceUSDCContract);
};
