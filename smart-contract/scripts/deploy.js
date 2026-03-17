const { ethers } = require("hardhat");

async function main() {

    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with account:", deployer.address);

    const DonationTracker = await ethers.getContractFactory("DonationTracker");

    const donationTracker = await DonationTracker.deploy();

    await donationTracker.waitForDeployment();

    console.log("DonationTracker deployed to:", await donationTracker.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});