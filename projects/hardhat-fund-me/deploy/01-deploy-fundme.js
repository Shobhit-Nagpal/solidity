const { networkConfig, developmentChains } = require("../helper-hardhat-config");
const { network } = require("hardhat");
const { verify } = require("../utils/verify");
require("dotenv").config();

module.exports= async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    let ethUsdPriceFeedAddr;
    
    if (developmentChains.includes(network.name)) {
        ethUsdAggregator = await deployments.get("MockV3Aggregator");
        ethUsdPriceFeedAddr = ethUsdAggregator.address;
    }
    else {
        ethUsdPriceFeedAddr = networkConfig[chainId]["ethUsdPriceFeedAddr"];
    }

    // If the contract address for getting price feed does not exist for cases like deploying to localhost or hardhat, we use a minimal version of it for our local testing.

    // When using localhost or hardhat network, we want to use mocks

    const args = [ethUsdPriceFeedAddr];

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1
    });

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        // verify
        await verify(fundMe.address, args);
    }

    log("------------------------");
}

module.exports.tags = ["all", "fundme"];
