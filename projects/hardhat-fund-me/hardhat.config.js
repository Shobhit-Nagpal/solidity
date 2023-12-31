require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("hardhat-deploy");
require("hardhat-gas-reporter");
require('@nomicfoundation/hardhat-ethers');
require("@nomicfoundation/hardhat-verify");

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "";
const LOCALHOST_RPC_URL = process.env.LOCALHOST_RPC_URL || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    defaultNetwork: "hardhat",
   networks: {
        sepolia: {
            url: SEPOLIA_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 11155111,
            blockConfirmations: 6
        },
        localhost: {
            url: LOCALHOST_RPC_URL,
            chainId: 31337
        }

  },
    solidity: {
        compilers: [
            { version: "0.8.7" },
            { version: "0.6.6"  }
        ]
    },

    etherscan: {
        apiKey: ETHERSCAN_API_KEY
    },

    namedAccounts: {
        deployer: {
            default: 0,
        },
        user: {
            default: 1
        }
    },
    gasReporter: {
        enabled: true,
        noColors: true,
        outputFile: "gas-report.txt",
        currency: "USD",
        //coinmarketcap: COINMARKETCAP_API_KEY
    }

};
