const { deployments, ethers, network ,getNamedAccounts } = require("hardhat");
const { assert } = require("chai");
const { developmentChains } = require("../../helper-hardhat-config");

developmentChains.includes(network.name) ? describe.skip 

    : describe("Fund Me", async function() {
    
    let fundMe;
    const sendValue = "1000000000000000000"

    beforeEach(async function() {

        //const accounts = await ethers.getSigners();
    
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);

        const fundMeAddr = (await deployments.get("FundMe")).address;
        fundMe = await ethers.getContractAt("FundMe", fundMeAddr);

        });

    it("Allows people to fund and withdraw", async function() {
        await fundMe.fund({ value: sendValue });
        await fund.withdraw();
        const endingBalance = await ethers.provider.getBalance(fundMe.getAddress());
        assert.equal(endingBalance.toString(), "0");
    });
    });

