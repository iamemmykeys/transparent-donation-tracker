const { expect } = require("chai");

describe("Donation Contract", function () {

  it("Should accept donations", async function () {

    const Donation = await ethers.getContractFactory("Donation");

    const donation = await Donation.deploy();

    await donation.waitForDeployment();

    const [owner] = await ethers.getSigners();

    const tx = await owner.sendTransaction({
      to: donation.target,
      value: ethers.parseEther("0.1")
    });

    await tx.wait();

    const balance = await ethers.provider.getBalance(donation.target);

    expect(balance).to.equal(ethers.parseEther("0.1"));

  });

});