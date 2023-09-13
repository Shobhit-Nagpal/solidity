const connectBtn = document.querySelector("#connectBtn");

if (typeof window.ethereum !== "undefined") {
    console.log("Metamask detected");
}
else {
    console.log("No Metamask detected");
}

async function getAccount() {
    try {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        console.log("Connected!");
        connectBtn.innerHTML = "Connected";
    } catch(err) {
        console.log(err);
    }
}

connectBtn.addEventListener("click", function () {
    getAccount();
});
