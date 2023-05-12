require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");
module.exports = {
  defaultNetwork: "hardhat",
  solidity: {
    compilers: [
      {
        version: "0.8.0",
      },
      {
        version: "0.8.9",
      },
      {
        version: "0.8.16",
      },
      {
        version: "0.4.25",
      },
      {
        version: "0.4.19",
      },
    ],
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [process.env.PRIVATE_KEY],
      blockConfirmations: 6,
    },
    polygon: {
      chainId: 137,
      url: process.env.POLYGON_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      blockConfirmations: 6,
    },
  },
  etherscan: {
    apiKey: "SXEJJXGJMR8G3CDDDAY75VC1PJGRI22AER",
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
};