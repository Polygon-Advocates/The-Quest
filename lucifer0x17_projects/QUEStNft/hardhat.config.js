require("@nomicfoundation/hardhat-toolbox");
// require("@nomicfoundation/hardhat-verify");
require("dotenv").config();

// const ALCHEMY_ZKEVM_HTTP_URL = process.env.ALCHEMY_ZKEVM_HTTP_URL;
// const PRIVATE_KEY = process.env.PRIVATE_KEY;
// const ZKEVM_POLYGON_SCAN_KEY = process.env.ZKEVM_POLYGON_SCAN_KEY;
const ALCHEMY_ZKEVM_HTTP_URL = "https://polygonzkevm-testnet.g.alchemy.com/v2/S6BF2cqF_Z6klqsOV8owhJP-cxZvEG26"
const PRIVATE_KEY = "98cece1882b4a49edf4afb148da887f7b01823e50db04c5b81868a27d4c99ad1"
const ZKEVM_POLYGON_SCAN_KEY = "G287WS8N43NCE4ZEKABJP68FQ7KFPG8PY5"


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