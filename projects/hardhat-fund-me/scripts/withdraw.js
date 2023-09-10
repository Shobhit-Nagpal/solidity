const { getNamedAccounts, ethers, deployments } = require("hardhat");

async function main() {
    const { deployer } = await getNamedAccounts();
    const fundMeAddr = (await deployments.get("FundMe")).address;
    const fundMe = await ethers.getContractAt("FundMe", fundMeAddr);
    console.log("Funding...");

    const txResponse = await fundMe.withdraw();
    await txResponse.wait(1);
    console.log("Funds withdrawn!");
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });
