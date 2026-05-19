/**
 * interact.js — run after deploy.js to exercise every mint function
 *
 *   npx hardhat run scripts/interact.js --network localhost
 *   npx hardhat run scripts/interact.js --network baseSepolia
 */
const { ethers, network } = require("hardhat");
const fs = require("fs");

async function main() {
  const [owner, user1, user2] = await ethers.getSigners();

  // Load deployment info
  const deployFile = `./deployments/${network.name}.json`;
  if (!fs.existsSync(deployFile)) {
    throw new Error(`No deployment found for ${network.name}. Run deploy.js first.`);
  }
  const { contract: contractAddress } = JSON.parse(fs.readFileSync(deployFile));
  console.log(`\nUsing contract: ${contractAddress} on ${network.name}\n`);

  const nft = await ethers.getContractAt("GasFreeBadge", contractAddress, owner);
  const publicPrice    = await nft.PUBLIC_PRICE();
  const wlPrice        = await nft.WHITELIST_PRICE();

  // ── 1. Public mint (single) ────────────────────────────────────────────────
  console.log("── 1. Public mint (1 token) ──────────────────────");
  const mintTx = await nft.connect(user1).mint(1, { value: publicPrice });
  const mintReceipt = await mintTx.wait();
  const mintEvent = mintReceipt.logs.find(
    (l) => l.fragment?.name === "Minted"
  );
  console.log(`✅  Token #${mintEvent?.args?.tokenId} minted to ${user1.address}`);
  console.log(`    Tx: ${mintTx.hash}\n`);

  // ── 2. Public mint (batch) ─────────────────────────────────────────────────
  console.log("── 2. Public mint (3 tokens, batch) ──────────────");
  const batchTx = await nft.connect(user2).mint(3, { value: publicPrice * 3n });
  const batchReceipt = await batchTx.wait();
  const batchEvents = batchReceipt.logs.filter((l) => l.fragment?.name === "Minted");
  console.log(`✅  Minted tokens: ${batchEvents.map((e) => `#${e.args.tokenId}`).join(", ")}`);
  console.log(`    Tx: ${batchTx.hash}\n`);

  // ── 3. Whitelist mint ──────────────────────────────────────────────────────
  console.log("── 3. Whitelist mint ─────────────────────────────");
  const addWlTx = await nft.connect(owner).addToWhitelist([user1.address]);
  await addWlTx.wait();
  console.log(`   Added ${user1.address} to whitelist`);

  const enableWlTx = await nft.connect(owner).setWhitelistActive(true);
  await enableWlTx.wait();
  console.log("   Whitelist phase enabled");

  const wlMintTx = await nft.connect(user1).whitelistMint(1, { value: wlPrice });
  const wlReceipt = await wlMintTx.wait();
  const wlEvent = wlReceipt.logs.find((l) => l.fragment?.name === "Minted");
  console.log(`✅  WL token #${wlEvent?.args?.tokenId} minted to ${user1.address}`);
  console.log(`    Tx: ${wlMintTx.hash}\n`);

  // ── 4. Owner mint (free) ───────────────────────────────────────────────────
  console.log("── 4. Owner free mint ────────────────────────────");
  const ownerMintTx = await nft.connect(owner).ownerMint(owner.address, 2);
  await ownerMintTx.wait();
  console.log(`✅  2 tokens minted (free) to ${owner.address}\n`);

  // ── 5. Reveal ──────────────────────────────────────────────────────────────
  console.log("── 5. Reveal collection ──────────────────────────");
  const newBaseURI = "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi/";
  const revealTx = await nft.connect(owner).reveal(newBaseURI);
  await revealTx.wait();
  console.log(`✅  Revealed! Base URI: ${newBaseURI}\n`);

  // ── 6. Token URIs ──────────────────────────────────────────────────────────
  console.log("── 6. Token URIs ─────────────────────────────────");
  for (let id = 0; id < Math.min(3, Number(await nft.totalMinted())); id++) {
    console.log(`   tokenURI(${id}): ${await nft.tokenURI(id)}`);
  }

  // ── 7. Royalty check ───────────────────────────────────────────────────────
  console.log("\n── 7. Royalty info ───────────────────────────────");
  const [receiver, amount] = await nft.royaltyInfo(0, ethers.parseEther("1"));
  console.log(`   Token #0: receiver=${receiver}, royalty=${ethers.formatEther(amount)} ETH (on 1 ETH sale)`);

  // ── 8. Withdraw ───────────────────────────────────────────────────────────
  console.log("\n── 8. Withdraw funds ─────────────────────────────");
  const contractBalance = await ethers.provider.getBalance(contractAddress);
  console.log(`   Contract balance: ${ethers.formatEther(contractBalance)} ETH`);
  if (contractBalance > 0n) {
    const withdrawTx = await nft.connect(owner).withdraw();
    await withdrawTx.wait();
    console.log(`✅  Withdrawn ${ethers.formatEther(contractBalance)} ETH to owner`);
  }

  // ── Final state ────────────────────────────────────────────────────────────
  console.log("\n── Final collection state ────────────────────────");
  console.log(`   Total minted : ${await nft.totalMinted()}`);
  console.log(`   Remaining    : ${await nft.remaining()}`);
  console.log(`   Revealed     : ${await nft.revealed()}`);
  console.log(`   user1 owns   : ${(await nft.tokensOfOwner(user1.address)).join(", ")}`);
  console.log(`   user2 owns   : ${(await nft.tokensOfOwner(user2.address)).join(", ")}`);
  console.log("\n🎉  All functions verified!\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
