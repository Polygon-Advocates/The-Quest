import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("@nomiclabs/hardhat-etherscan");
import "./tasks";
import "dotenv/config";

const mnemonic = process.env.MNEMONIC || "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: "goerli",
  networks: {
    goerli: {
      url: process.env.RPC_URL,
      accounts: [mnemonic],
    },
  },
};

export default config;
