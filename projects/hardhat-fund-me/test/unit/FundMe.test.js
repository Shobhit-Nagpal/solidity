const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { assert, expect } = require("chai");

describe("Fund Me", async function() {
    
    let fundMe;
    let deployer;
    const sendValue = "1000000000000000000"

    beforeEach(async function() {

        //const accounts = await ethers.getSigners();
    
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);

        const fundMeAddr = (await deployments.get("FundMe")).address;
        fundMe = await ethers.getContractAt("FundMe", fundMeAddr);

    });

    describe("Constructor testing", async function() {
        it("Sets the aggregator addresses correctly", async function() {
            const response = await fundMe.getPriceFeed();
            const mockV3AggregatorAddr = (await deployments.get("MockV3Aggregator")).address;
            assert.equal(response, mockV3AggregatorAddr);
        });
    });

    describe("Fund function testing", async function() {
        it("Fails if you don't send enough ETH", async function() {
            await expect(fundMe.fund()).to.be.revertedWith("Value is less than the minimum");
        });


        it("Updates amount funded data structure", async function() {
            await fundMe.fund({ value: sendValue });
            const response = await fundMe.getAddressToAmtFunded(deployer);
            assert.equal(response.toString(), sendValue.toString());
        });

        it("Adds funders to funders array", async function() {
            await fundMe.fund({ value: sendValue });
            const funder = await fundMe.getFunder(0);
            assert.equal(funder.toString(), deployer.toString());
        });

    });

    describe("Withdraw function testing", async function() {
        beforeEach(async function() {
            await fundMe.fund({ value: sendValue });
        });

        it("Withdraw ETH from a single funder", async function() {
            // Arrange
            const startingFundMeBalance = await ethers.provider.getBalance(fundMe.getAddress());
            const startingDeployerBalance = await ethers.provider.getBalance(deployer);

            // Act 
            const txResponse = await fundMe.withdraw();
            const txReceipt = await txResponse.wait(1);
            const { gasUsed, gasPrice } = txReceipt;
            const gasCost = gasUsed * gasPrice;
            const endingFundMeBalance = await ethers.provider.getBalance(fundMe.getAddress());
            const endingDeployerBalance = await ethers.provider.getBalance(deployer);

            // Assert
            assert.equal(endingFundMeBalance, 0);
            assert.equal((startingFundMeBalance + startingDeployerBalance).toString(), (endingDeployerBalance + gasCost).toString());
        });

        it("Withdraw ETH from multiple funders", async function() {
                const accounts = await ethers.getSigners();

            for (let i = 1 ; i < 6 ; i++) {
                const fundMeConnectedContract = await fundMe.connect(accounts[i]);
                await fundMeConnectedContract.fund({ value: sendValue });
            }

            const startingFundMeBalance = await ethers.provider.getBalance(fundMe.getAddress());
            const startingDeployerBalance = await ethers.provider.getBalance(deployer);

            const txResponse = await fundMe.withdraw();
            const txReceipt = await txResponse.wait(1);
            const { gasUsed, gasPrice } = txReceipt;
            const gasCost = gasUsed * gasPrice;
            

            const endingFundMeBalance = await ethers.provider.getBalance(fundMe.getAddress());
            const endingDeployerBalance = await ethers.provider.getBalance(deployer);

            assert.equal(endingFundMeBalance, 0);
            assert.equal((startingFundMeBalance + startingDeployerBalance).toString(), (endingDeployerBalance + gasCost).toString());

            await expect(fundMe.getFunder(0)).to.be.reverted;

            for (let i = 1 ; i < 6 ; i++) {
                assert.equal(await fundMe.getAddressToAmtFunded(accounts[i].getAddress()), 0);
            }
        });

        it("Only allows owner to withdraw", async function() {
            const accounts = await ethers.getSigners();
            const attacker = accounts[1];

            const attackerConnectedContract = await fundMe.connect(attacker);
            await expect(attackerConnectedContract.withdraw()).to.be.revertedWithCustomError(fundMe, "FundMe__NotOwner");
        });
    });

    describe("Cheaper Withdraw function testing", async function() {
        beforeEach(async function() {
            await fundMe.fund({ value: sendValue });
        });

        it("Withdraw ETH from a single funder", async function() {
            // Arrange
            const startingFundMeBalance = await ethers.provider.getBalance(fundMe.getAddress());
            const startingDeployerBalance = await ethers.provider.getBalance(deployer);

            // Act 
            const txResponse = await fundMe.cheaperWithdraw();
            const txReceipt = await txResponse.wait(1);
            const { gasUsed, gasPrice } = txReceipt;
            const gasCost = gasUsed * gasPrice;
            const endingFundMeBalance = await ethers.provider.getBalance(fundMe.getAddress());
            const endingDeployerBalance = await ethers.provider.getBalance(deployer);

            // Assert
            assert.equal(endingFundMeBalance, 0);
            assert.equal((startingFundMeBalance + startingDeployerBalance).toString(), (endingDeployerBalance + gasCost).toString());
        });

        it("Withdraw ETH from multiple funders", async function() {
                const accounts = await ethers.getSigners();

            for (let i = 1 ; i < 6 ; i++) {
                const fundMeConnectedContract = await fundMe.connect(accounts[i]);
                await fundMeConnectedContract.fund({ value: sendValue });
            }

            const startingFundMeBalance = await ethers.provider.getBalance(fundMe.getAddress());
            const startingDeployerBalance = await ethers.provider.getBalance(deployer);

            const txResponse = await fundMe.cheaperWithdraw();
            const txReceipt = await txResponse.wait(1);
            const { gasUsed, gasPrice } = txReceipt;
            const gasCost = gasUsed * gasPrice;
            

            const endingFundMeBalance = await ethers.provider.getBalance(fundMe.getAddress());
            const endingDeployerBalance = await ethers.provider.getBalance(deployer);

            assert.equal(endingFundMeBalance, 0);
            assert.equal((startingFundMeBalance + startingDeployerBalance).toString(), (endingDeployerBalance + gasCost).toString());

            await expect(fundMe.getFunder(0)).to.be.reverted;

            for (let i = 1 ; i < 6 ; i++) {
                assert.equal(await fundMe.getAddressToAmtFunded(accounts[i].getAddress()), 0);
            }
        });

        it("Only allows owner to withdraw", async function() {
            const accounts = await ethers.getSigners();
            const attacker = accounts[1];

            const attackerConnectedContract = await fundMe.connect(attacker);
            await expect(attackerConnectedContract.cheaperWithdraw()).to.be.revertedWithCustomError(fundMe, "FundMe__NotOwner");
        });
    });
});

