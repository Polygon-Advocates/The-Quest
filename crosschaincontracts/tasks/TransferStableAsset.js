// import { CONSTANTS } from "../assets/constants";
const { CONSTANTS } = require("../assets/constants");

module.exports = async function (taskArgs, hre) {
  const signers = await ethers.getSigners();
  const owner = signers[0];
  //   console.log("SIGNER ADDRESS :", owner);

  const HyperTokenBridgeAddress = CONSTANTS.DEPLOYED_ADDRESSES.POLYGON_MUMBAI;
  const USDCAddress = CONSTANTS.TESTNET.STABLE_ASSET.MUMBAI_USDC;

  const hyperTokenBridge = await ethers.getContractAt(
    "TokenBridgeHyper",
    HyperTokenBridgeAddress
  );
  const usdcContract = await ethers.getContractAt("ERC20", USDCAddress);

  const amount = ethers.utils.parseUnits("100", 6);

  const transferUSDCToContractFromSigner = async () => {
    const txn = await usdcContract.transfer(HyperTokenBridgeAddress, amount);
    await txn.wait();
    console.log(txn);
  };

  try {
    await transferUSDCToContractFromSigner();
    console.log("[USDC] ", amount, " User -> Contract success");
  } catch (error) {
    console.log(error);
  }
};
