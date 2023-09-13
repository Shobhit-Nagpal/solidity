console.log("AYO WHAT IS GOOD, BRUV");

const connectBtn = document.querySelector("#connectBtn");

if (typeof window.ethereum !== "undefined") {
    console.log("Look at that, we do have a metamask");
}
else {
    console.log("L + ratio");
}

async function getAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
    .then(console.log("Connected!"))
    .catch((err) => {
        console.log("Get trolled by JS");
        console.log(err);
    });
    connectBtn.innerHTML = "Connected";
}

connectBtn.addEventListener("click", function () {
    console.log("Before getAccoutn");
    getAccount();
    console.log("After getAccount");
});
