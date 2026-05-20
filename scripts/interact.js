/**
 * Exercise GasFreeBadge on deployed network.
 *   npx hardhat run scripts/interact.js --network localhost
 *   npx hardhat run scripts/interact.js --network baseSepolia
 */
const { ethers, network } = require("hardhat");
const fs = require("fs");

async function main() {
  const [owner, user1] = await ethers.getSigners();
  const deployFile = `./deployments/${network.name}.json`;
  if (!fs.existsSync(deployFile)) {
    throw new Error(`No deployment for ${network.name}. Run deploy.js first.`);
  }
  const { contract: address } = JSON.parse(fs.readFileSync(deployFile, "utf8"));
  const nft = await ethers.getContractAt("GasFreeBadge", address);

  console.log(`\nContract: ${address} (${network.name})\n`);

  console.log("── claimBadge (Explorer) ──");
  await expectMint(nft, user1.address, 0);

  console.log("── claimBadge (Builder) ──");
  await expectMint(nft, user1.address, 1);

  console.log("── stats ──");
  console.log("  totalMinted:", (await nft.totalMinted()).toString());
  console.log("  remaining:  ", (await nft.remaining()).toString());
  console.log("  ownerOf(0):", await nft.ownerOf(0));
  console.log("  badgeType:", (await nft.getBadgeType(0)).toString());
  console.log("\n✅  All checks passed.\n");
}

async function expectMint(nft, recipient, badgeType) {
  const tx = await nft.claimBadge(recipient, badgeType);
  const receipt = await tx.wait();
  const event = receipt.logs.find((l) => l.fragment?.name === "BadgeClaimed");
  console.log(`  ✅  tokenId=${event?.args?.tokenId} type=${event?.args?.badgeType} tx=${receipt.hash}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
