const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

async function deployFixture() {
  const [owner, user1, user2] = await ethers.getSigners();
  const Factory = await ethers.getContractFactory("GasFreeBadge");
  const nft = await Factory.deploy(owner.address, "ipfs://base/");
  await nft.waitForDeployment();
  return { nft, owner, user1, user2 };
}

describe("GasFreeBadge", function () {
  describe("Deployment", function () {
    it("sets name and symbol", async function () {
      const { nft } = await loadFixture(deployFixture);
      expect(await nft.name()).to.equal("GasFreeBadge");
      expect(await nft.symbol()).to.equal("GFB");
    });

    it("starts unpaused with zero minted", async function () {
      const { nft } = await loadFixture(deployFixture);
      expect(await nft.paused()).to.be.false;
      expect(await nft.totalMinted()).to.equal(0);
      expect(await nft.remaining()).to.equal(10_000);
    });

    it("exposes MAX_SUPPLY constant", async function () {
      const { nft } = await loadFixture(deployFixture);
      expect(await nft.MAX_SUPPLY()).to.equal(10_000);
    });
  });

  describe("claimBadge()", function () {
    it("mints to recipient and emits BadgeClaimed", async function () {
      const { nft, user1 } = await loadFixture(deployFixture);
      await expect(nft.claimBadge(user1.address, 0))
        .to.emit(nft, "BadgeClaimed")
        .withArgs(user1.address, 0, 0);

      expect(await nft.ownerOf(0)).to.equal(user1.address);
      expect(await nft.totalMinted()).to.equal(1);
      expect(await nft.getBadgeType(0)).to.equal(0);
    });

    it("allows multiple claims per wallet", async function () {
      const { nft, user1 } = await loadFixture(deployFixture);
      await nft.claimBadge(user1.address, 0);
      await nft.claimBadge(user1.address, 1);
      expect(await nft.balanceOf(user1.address)).to.equal(2);
    });

    it("reverts on invalid badge type", async function () {
      const { nft, user1 } = await loadFixture(deployFixture);
      await expect(nft.claimBadge(user1.address, 3)).to.be.revertedWithCustomError(
        nft,
        "InvalidBadgeType"
      );
    });

    it("reverts on zero address", async function () {
      const { nft } = await loadFixture(deployFixture);
      await expect(nft.claimBadge(ethers.ZeroAddress, 0)).to.be.revertedWithCustomError(
        nft,
        "ZeroAddress"
      );
    });

    it("reverts when paused", async function () {
      const { nft, owner, user1 } = await loadFixture(deployFixture);
      await nft.connect(owner).setPaused(true);
      await expect(nft.claimBadge(user1.address, 0)).to.be.revertedWithCustomError(
        nft,
        "ContractPaused"
      );
    });

    it("decrements remaining supply", async function () {
      const { nft, user1 } = await loadFixture(deployFixture);
      expect(await nft.remaining()).to.equal(10_000);
      await nft.claimBadge(user1.address, 2);
      expect(await nft.remaining()).to.equal(9_999);
    });
  });

  describe("Owner controls", function () {
    it("only owner can pause", async function () {
      const { nft, user1 } = await loadFixture(deployFixture);
      await expect(nft.connect(user1).setPaused(true)).to.be.reverted;
    });

    it("owner can update base URI", async function () {
      const { nft, owner } = await loadFixture(deployFixture);
      await nft.connect(owner).setBaseURI("ipfs://revealed/");
    });

    it("owner can restrict callers", async function () {
      const { nft, owner, user1, user2 } = await loadFixture(deployFixture);
      await nft.connect(owner).setRestrictCallers(true);
      await expect(nft.connect(user2).claimBadge(user1.address, 0)).to.be.revertedWithCustomError(
        nft,
        "UnauthorizedCaller"
      );
      await nft.connect(owner).setAuthorizedCaller(user2.address, true);
      await expect(nft.connect(user2).claimBadge(user1.address, 0)).to.emit(nft, "BadgeClaimed");
    });
  });
});
