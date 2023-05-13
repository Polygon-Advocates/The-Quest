const { ethers: ethersjs } = require("ethers");

module.exports = async function (taskArgs, hre) {
    const signers = await ethers.getSigners();

    // Staking Asset : [ETH]
    // Loaned Asset : VLTK [ETH]

    const VLTK_TOKEN_ADDRESS = "0x0EA7bf5f7Afd9f4c176F1E9083595A8e06b06454";
    const CRYPTO_VAULT_ADDRESS = "0x96dA2E1A6e5FFAcf6d5bbAf55091A67caba5DC2e";

    // erc 20 : instance usdt [loaned type]
    const erc20VLTK = await ethers.getContractAt("ERC20", VLTK_TOKEN_ADDRESS);
    // approval of erc20
    await erc20VLTK.approve(CRYPTO_VAULT_ADDRESS, 50000 * 10 ** 18);
    console.log("ERC20 [VLTK] approved value : 5000 VLTK ✅");
}