const { getNamedAccounts, ethers, deployments } = require("hardhat");

async function main() {
    const { deployer } = await getNamedAccounts();
    const fundMeAddr = (await deployments.get("FundMe")).address;
    const fundMe = await ethers.getContractAt("FundMe", fundMeAddr);
    console.log("Funding contract...");

    const txResponse = await fundMe.fund({ value: "1000000000000000000" });
    await txResponse.wait(1);
    console.log("Funded!");
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });
