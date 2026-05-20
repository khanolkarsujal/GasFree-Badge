const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

async function walletFixture() {
  const [owner, alice, bob] = await ethers.getSigners();
  const Mock = await ethers.getContractFactory("MockERC20");
  const tyi = await Mock.deploy();
  await tyi.waitForDeployment();

  const TyiWallet = await ethers.getContractFactory("TyiWallet");
  const wallet = await TyiWallet.deploy(owner.address, await tyi.getAddress());
  await wallet.waitForDeployment();

  const fund = async (user, amount) => {
    await tyi.mint(user.address, amount);
    await tyi.connect(user).approve(await wallet.getAddress(), amount);
    await wallet.connect(user).deposit(amount, ethers.ZeroHash);
  };

  await fund(alice, ethers.parseEther("100"));
  await fund(bob, ethers.parseEther("50"));

  return { wallet, tyi, owner, alice, bob };
}

describe("TyiWallet", function () {
  it("deposits and tracks balance", async function () {
    const { wallet, alice } = await loadFixture(walletFixture);
    expect(await wallet.balances(alice.address)).to.equal(ethers.parseEther("100"));
  });

  it("transfers between users instantly", async function () {
    const { wallet, alice, bob } = await loadFixture(walletFixture);
    const ref = ethers.id("p2p-1");
    await wallet.connect(alice).transferTo(bob.address, ethers.parseEther("10"), ref);
    expect(await wallet.balances(alice.address)).to.equal(ethers.parseEther("90"));
    expect(await wallet.balances(bob.address)).to.equal(ethers.parseEther("60"));
  });

  it("fulfills payment request", async function () {
    const { wallet, alice, bob } = await loadFixture(walletFixture);
    const requestId = ethers.id("req-1");
    const amount = ethers.parseEther("5");
    await wallet.connect(bob).createPaymentRequest(requestId, amount, 3600, ethers.ZeroHash);
    await wallet.connect(alice).payRequest(requestId);
    expect(await wallet.balances(alice.address)).to.equal(ethers.parseEther("95"));
    expect(await wallet.balances(bob.address)).to.equal(ethers.parseEther("55"));
  });

  it("reverts insufficient balance", async function () {
    const { wallet, alice, bob } = await loadFixture(walletFixture);
    await expect(
      wallet.connect(alice).transferTo(bob.address, ethers.parseEther("500"), ethers.ZeroHash)
    ).to.be.revertedWithCustomError(wallet, "InsufficientBalance");
  });
});
