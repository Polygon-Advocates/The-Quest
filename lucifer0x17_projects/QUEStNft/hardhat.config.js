require("@nomicfoundation/hardhat-toolbox");
// require("@nomicfoundation/hardhat-verify");
require("dotenv").config();

const ALCHEMY_ZKEVM_HTTP_URL = process.env.ALCHEMY_ZKEVM_HTTP_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ZKEVM_POLYGON_SCAN_KEY = process.env.ZKEVM_POLYGON_SCAN_KEY;



module.exports = {
  solidity: "0.8.18",
  networks: {
    polygonzkevmtestnet: {
      url: ALCHEMY_ZKEVM_HTTP_URL,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      polygonzkevmtestnet: ZKEVM_POLYGON_SCAN_KEY,
    },
    customChains: [
      {
        network: "polygonzkevmtestnet",
        chainId: 1442,
        urls: {
          apiURL: "https://testnet-zkevm.polygonscan.com/apis",
          browserURL: "https://testnet-zkevm.polygonscan.com"
        }
      }
    ]
  },
};