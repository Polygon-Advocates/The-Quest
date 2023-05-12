require('dotenv').config()
require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-web3");
require('hardhat-abi-exporter');

module.exports = {
  solidity: "0.8.19",
  networks: {
    zkEVM_testnet: {
      url: `https://rpc.public.zkevm-test.net`,
      accounts: [process.env.PRIVATE_KEY],
    },
    zkEVM: {
      url: `https://zkevm-rpc.com`,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: process.env.EXPLORER_API_KEY,
    customChains: [
      {
        network: "zkEVM Testnet",
        chainId: 1442,
        urls: {
          apiURL: "https://api-testnet-zkevm.polygonscan.com/api",
          browserURL: "https://testnet-zkevm.polygonscan.com"
        }
      },
      {
        network: "zkEVM",
        chainId: 1101,
        urls: {
          apiURL: "https://api-zkevm.polygonscan.com/api",
          browserURL: "https://zkevm.polygonscan.com"
        }
      }
    ]
 },
 abiExporter: {
  path: './abi',
  runOnCompile: true,
  clear: true,
  flat: true,
  only: [':Factory', 'POAP'],
  spacing: 2,
}
};
