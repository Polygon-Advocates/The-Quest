const { ethers: ethersjs } = require("ethers");

module.exports = async function (taskArgs, hre) {
    const signers = await ethers.getSigners();
    const owner = signers[0];
    console.log("Address : ", owner.address);

    // Staking Asset : LINK 
    // Loaned Asset : USDT

    const VLTK_TOKEN_ADDRESS = "0x0EA7bf5f7Afd9f4c176F1E9083595A8e06b06454";

    const balanceETH = await ethers.provider.getBalance(owner.address);
    console.log("BALANCE (ETH) :", ethersjs.utils.formatEther(balanceETH.toString()));

    const erc20VLTK = await ethers.getContractAt("ERC20", VLTK_TOKEN_ADDRESS);
    const erc20VLTKBal = await erc20VLTK.balanceOf(owner.address);
    console.log("BALANCE (VLTK) :", erc20VLTKBal.toNumber() / 10 ** 18);

}