const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    try {
        const NFT = await ethers.getContractFactory("QuestNFT");
        const nft = await NFT.deploy("QuestNFT", "BN");
        await nft.deployed();
        console.log("NFT Contract Address:", nft.address);

        const TOKEN = await ethers.getContractFactory("QuestToken");
        const token = await TOKEN.deploy("QuestToken", "BT");
        await token.deployed();
        console.log("Token Contract Address:", token.address);

        const STAKING = await ethers.getContractFactory("Staking");
        const staking = await STAKING.deploy(nft.address, token.address);
        await staking.deployed();
        console.log("Staking Contract Address:", staking.address);

        await hre.run("verify:verify", {
            address: nft.address,
            constructorArguments: ["QuestNFT", "BN"],
        });

        await hre.run("verify:verify", {
            address: token.address,
            constructorArguments: ["QuestToken", "BT"],
        });

        await hre.run("verify:verify", {
            address: staking.address,
            constructorArguments: [nft.address, token.address],
        });

    } catch (error) {
        console.error(error);
    }

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});