const ethers = require("ethers");
const fs = require("fs");
require("dotenv").config();

async function encrypt() {
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
    const encryptedJsonKey = await wallet.encrypt(process.env.PRIVATE_KEY_PASSWORD, process.env.PRIVATE_KEY);
    fs.writeFileSync("./.encryptedKey.json", encryptedJsonKey);
}

encrypt()
    .then(() => process.exit(0))
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });
