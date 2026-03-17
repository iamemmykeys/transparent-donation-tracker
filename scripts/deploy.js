const hre = require("hardhat");

async function main() {

  const Donation = await hre.ethers.getContractFactory("Donation");

  const donation = await Donation.deploy();

  await donation.waitForDeployment();

  console.log("Donation contract deployed to:", donation.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});