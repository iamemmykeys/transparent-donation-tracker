const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

// Load ABI & contract address
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // replace with your deployed address
const abiPath = path.join(__dirname, "../smart-contract/artifacts/contracts/DonationTracker.sol/DonationTracker.json");
const contractJson = JSON.parse(fs.readFileSync(abiPath));
const abi = contractJson.abi;

// Connect to Hardhat local node
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const donationTracker = new ethers.Contract(contractAddress, abi, provider);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Get total donations
app.get("/total-donations", async (req, res) => {
    try {
        const total = await donationTracker.totalDonations();
        res.json({ total: total.toString() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Donate endpoint
app.post("/donate", async (req, res) => {
    try {
        const { amount, senderPrivateKey } = req.body;

        const wallet = new ethers.Wallet(senderPrivateKey, provider);
        const contractWithSigner = donationTracker.connect(wallet);

        const tx = await contractWithSigner.donate({ value: ethers.parseEther(amount) });
        await tx.wait();

        res.json({ success: true, txHash: tx.hash });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start server
app.listen(3000, () => console.log("Backend running on http://localhost:3000"));