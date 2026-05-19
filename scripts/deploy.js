const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  const balance = await ethers.provider.getBalance(deployer.address);

  console.log("\n╔═══════════════════════════════════════════════╗");
  console.log("║         GasFreeBadge NFT Deployment           ║");
  console.log("╚═══════════════════════════════════════════════╝\n");
  console.log("Network  :", network.name, `(chainId ${network.chainId})`);
  console.log("Deployer :", deployer.address);
  console.log("Balance  :", ethers.formatEther(balance), "ETH\n");

  const config = {
    initialOwner: deployer.address,
    baseURI: "ipfs://bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzgivvzsezcolaq",
  };

  console.log("Deployment config:");
  console.log(JSON.stringify(config, null, 2), "\n");
  console.log("Deploying…");

  const GasFreeBadge = await ethers.getContractFactory("GasFreeBadge");
  const contract = await GasFreeBadge.deploy(
    config.initialOwner,
    config.baseURI
  );
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  const tx = contract.deploymentTransaction();

  console.log("\n✅  Deployed!");
  console.log("    Contract :", address);
  console.log("    Tx hash  :", tx.hash);
  console.log("    Explorer : https://sepolia.basescan.org/address/" + address);

  // ── Print collection state ──────────────────────────────────────────────
  const total    = await contract.totalMinted();
  const maxSup   = await contract.MAX_SUPPLY();
  const remaining= await contract.remaining();
  const isPaused = await contract.paused();

  console.log("\n── Collection state ────────────────────────────────────");
  console.log("  Name          : GasFreeBadge");
  console.log("  Symbol        : GFB");
  console.log("  Max supply    :", maxSup.toString());
  console.log("  Total minted  :", total.toString());
  console.log("  Remaining     :", remaining.toString());
  console.log("  Paused        :", isPaused);
  console.log("────────────────────────────────────────────────────────\n");

  // ── Save deployment info ─────────────────────────────────────────────────
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) fs.mkdirSync(deploymentsDir);
  const info = {
    network: network.name,
    chainId: network.chainId.toString(),
    contract: address,
    deployer: deployer.address,
    txHash: tx.hash,
    deployedAt: new Date().toISOString(),
    config,
  };
  fs.writeFileSync(
    path.join(deploymentsDir, `${network.name}.json`),
    JSON.stringify(info, null, 2)
  );
  console.log("Deployment info saved → ./deployments/" + network.name + ".json");

  // ── Copy ABI to frontend ──────────────────────────────────────────────────
  const artifactPath = path.join(
    __dirname,
    "../artifacts/contracts/GasFreeBadge.sol/GasFreeBadge.json"
  );
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  const frontendAbiPath = path.join(__dirname, "../frontend/src/abi.json");
  fs.writeFileSync(frontendAbiPath, JSON.stringify(artifact.abi, null, 2));

  // ── Update frontend contractConfig.js ────────────────────────────────────
  const configPath = path.join(__dirname, "../frontend/src/contractConfig.js");
  const configContent = `import abi from './abi.json';

// Auto-updated by scripts/deploy.js on ${new Date().toISOString()}
// Network: ${network.name} (chainId ${network.chainId})

export const CONTRACT_ADDRESS = "${address}";

// The ABI for our smart contract is loaded from abi.json
export const CONTRACT_ABI = abi;
`;
  fs.writeFileSync(configPath, configContent);
  console.log("\n✅  Frontend updated → ./frontend/src/contractConfig.js");
  console.log("    CONTRACT_ADDRESS =", address);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
