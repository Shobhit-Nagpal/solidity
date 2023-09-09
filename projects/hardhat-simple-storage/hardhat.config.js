require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@nomicfoundation/hardhat-verify");
require("./tasks/block_number");
require("hardhat-gas-reporter");
require("solidity-coverage");

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "";
const LOCALHOST_RPC_URL = process.env.LOCALHOST_RPC_URL || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    sepolia: {
        url: SEPOLIA_RPC_URL,
        accounts: [PRIVATE_KEY],
        chainId: 11155111
    },
    localhost: {
        url: LOCALHOST_RPC_URL,
        chainId: 31337
    }

  },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY
    },

  solidity: "0.8.7",

    gasReporter: {
        enabled: true,
        noColors: true,
        outputFile: "gas-report.txt",
        currency: "USD",
        coinmarketcap: COINMARKETCAP_API_KEY
    }
};
