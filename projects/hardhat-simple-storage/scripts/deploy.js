const { ethers, run, network } = require("hardhat");
require("dotenv").config();

async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");

    console.log("Deploying contract...");
    const simpleStorage = await SimpleStorageFactory.deploy();
    const txReceipt =  await simpleStorage.deploymentTransaction().wait(1);
    console.log(txReceipt);
    console.log(`Deployed contract to ${txReceipt.contractAddress}`);

    if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
        
        await simpleStorage.deploymentTransaction().wait(6);
        await verify(txReceipt.contractAddress, []);
    }

    const currentValue = await simpleStorage.retrieve();
    console.log(`Current value is: ${currentValue}`);

    const txResponse = await simpleStorage.store(420);
    await txResponse.wait(1);
    const updatedValue = await simpleStorage.retrieve();
    console.log(`Updated value is: ${updatedValue}`);
}


// As our SimpleStorage contract does not have a constructor, the args will be empty. When a contract does have a constructor, we will pass in any necessary args that are there.

async function verify(contractAddr, args) {
    console.log("Verifying contract...");

    try {
        await run("verify:verify", {
            address: contractAddr,
            constructorArgs: args
        });
    }
    catch (err) {
        if (err.message.toLowerCase().includes("already verified")) {
            console.log("Already verified");
        }
        else {
            console.log(err);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });
