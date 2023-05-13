const { ethers: ethersjs } = require("ethers");

module.exports = async function (taskArgs, hre) {
    const signers = await ethers.getSigners();
    const owner = signers[0];

    // Staking Asset : [ETH]
    // Loaned Asset : VLTK [ETH]

    // const VLTK_TOKEN_ADDRESS = "0x0EA7bf5f7Afd9f4c176F1E9083595A8e06b06454";
    const CRYPTO_VAULT_ADDRESS = "0x96dA2E1A6e5FFAcf6d5bbAf55091A67caba5DC2e";

    // const cryptoVault = await ethers.getContractAt("CryptoVault", CRYPTO_VAULT_ADDRESS);

    // * Unlock Time
    const latestBlockTimestamp = (await ethers.provider.getBlock("latest")).timestamp;
    const timestampObj = new Date(latestBlockTimestamp * 1000);
    const unlockTime = timestampObj.setMinutes(timestampObj.getMinutes() + 10) / 1000;
    console.log("UnlockTime : ", unlockTime);

    // * amount
    // let num = 0.05;
    // const amount = ethersjs.utils.parseUnits(num.toString(), "ether");
    // console.log("Amount locked : ", amount);

    // * Lock Tokens
    // try {
    //     const txn = await cryptoVault.lockTokens(
    //         owner.address,
    //         amount,
    //         unlockTime,
    //         {
    //             gasLimit: 10000000,
    //             gasPrice: ethersjs.utils.parseUnits("10", "gwei"),
    //             value: ethersjs.utils.parseEther("0.01")
    //         });
    //     const res = await txn.wait();
    //     console.log(res);
    // } catch (error) {
    //     console.log(error);
    // }
}
