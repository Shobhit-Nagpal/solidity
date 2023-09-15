import { ethers } from "./ethers-6.7.0.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectBtn = document.querySelector("#connectBtn");
const fundBtn = document.querySelector("#fundBtn");
const balanceBtn = document.querySelector("#balanceBtn");
const withdrawBtn = document.querySelector("#withdrawBtn");

console.log(ethers);


connectBtn.addEventListener("click", function() {
    getAccount();
});

fundBtn.addEventListener("click", function() {
    fund();
});

balanceBtn.addEventListener("click", function() {
    getBalance();
});

withdrawBtn.addEventListener("click", function() {
    withdraw();
});
async function getAccount() {
    try {
        if (typeof window.ethereum !== "undefined") {
            console.log("Metamask detected");
            await window.ethereum.request({ method: 'eth_requestAccounts' })
            connectBtn.innerHTML = "Connected";
            console.log("Connected!");
        }
        else {
            console.log("No Metamask detected");
            connectBtn.innerHTML = "Please connect Metamask";
        }
    } catch(err) {
        console.log(err);
    }
}

async function fund(/* ethAmt */) {

    const ethAmt = document.getElementById("ethAmt").value;
    
    console.log(`Funding contract with ${ethers.parseEther(ethAmt)}`);
    
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.BrowserProvider(window.ethereum);
        console.log(provider);
        const signer = await provider.getSigner();
        console.log(signer);
        const contract =  new ethers.Contract(contractAddress, abi, signer);
        try {
        const txResponse = await contract.fund({ value: ethers.parseEther(ethAmt)});
        await listenForTxMine(txResponse, provider);
        } catch (err) {
            console.log(err);
        }
    }
}

function listenForTxMine(txResponse, provider) {
    console.log(`Mining ${txResponse.hash}...`);

    return new Promise( (resolve, reject) => {
        provider.once(txResponse.hash, (txReceipt) => {
            console.log(txReceipt);
            console.log(`Completed with ${txReceipt.confirmations} confirmations`);
            resolve();
        });
    });
}

async function getBalance() {
    
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const balance = await provider.getBalance(contractAddress);
        console.log(ethers.formatEther(balance));
    }
}

async function withdraw() {
    if (typeof window.ethereum !== "undefined") {

        console.log("Withdrawing...");
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract =  new ethers.Contract(contractAddress, abi, signer);
        
        try {

            const txResponse = await contract.withdraw();

        } catch (err) {
            console.log(err);
        }
    } 
}
