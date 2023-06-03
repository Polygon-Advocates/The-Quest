import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config();
import "./tasks";

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    hardhat: {},
    goerli: {
      url: process.env.ETH_GOERLI_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
    mumbai: {
      url: process.env.POL_MUMBAI_RPC_URL,
      accounts: [PRIVATE_KEY],
      gas: 2100000,
      gasPrice: 250000000000,
    },
  },
};

export default config;
