const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

const TYI_BASE_SEPOLIA = "0x9b9deeea99C2B77c0e7F7bdCf0a01a0F0843e5DD";

async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();

  console.log("\n╔═══════════════════════════════════════════════╗");
  console.log("║         TyiWallet (SaaS) Deployment           ║");
  console.log("╚═══════════════════════════════════════════════╝\n");
  console.log("Network  :", network.name, `(chainId ${network.chainId})`);
  console.log("Deployer :", deployer.address);

  let tyiAddress = TYI_BASE_SEPOLIA;

  if (network.chainId === 31337n) {
    const Mock = await ethers.getContractFactory("MockERC20");
    const mock = await Mock.deploy();
    await mock.waitForDeployment();
    tyiAddress = await mock.getAddress();
    console.log("Mock TYI deployed:", tyiAddress);
    await (await mock.mint(deployer.address, ethers.parseEther("1000000"))).wait();
  } else if (network.chainId !== 84532n) {
    throw new Error("Unsupported network. Use hardhat local or baseSepolia.");
  }

  return deployWallet(deployer, tyiAddress, network);
}

async function deployWallet(deployer, tyiAddress, network) {
  const TyiWallet = await ethers.getContractFactory("TyiWallet");
  const wallet = await TyiWallet.deploy(deployer.address, tyiAddress);
  await wallet.waitForDeployment();
  const address = await wallet.getAddress();
  const tx = wallet.deploymentTransaction();

  console.log("\n✅  TyiWallet deployed!");
  console.log("    Contract :", address);
  console.log("    TYI Token:", tyiAddress);
  console.log("    Tx hash  :", tx.hash);

  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) fs.mkdirSync(deploymentsDir);
  const info = {
    network: network.name,
    chainId: network.chainId.toString(),
    tyiWallet: address,
    tyiToken: tyiAddress,
    deployer: deployer.address,
    txHash: tx.hash,
    deployedAt: new Date().toISOString(),
  };
  fs.writeFileSync(
    path.join(deploymentsDir, `tyi-wallet-${network.name}.json`),
    JSON.stringify(info, null, 2)
  );

  const backendEnvPath = path.join(__dirname, "../backend/.env");
  const envLine = `WALLET_CONTRACT_ADDRESS=${address}`;
  if (fs.existsSync(backendEnvPath)) {
    let content = fs.readFileSync(backendEnvPath, "utf8");
    if (content.includes("WALLET_CONTRACT_ADDRESS=")) {
      content = content.replace(/WALLET_CONTRACT_ADDRESS=.*/g, envLine);
    } else {
      content += `\n${envLine}\n`;
    }
    fs.writeFileSync(backendEnvPath, content);
  } else {
    const example = path.join(__dirname, "../backend/.env.example");
    if (fs.existsSync(example)) {
      let content = fs.readFileSync(example, "utf8");
      content = content.replace(/WALLET_CONTRACT_ADDRESS=.*/g, envLine);
      fs.writeFileSync(backendEnvPath, content);
    }
  }

  console.log("\n✅  backend/.env updated with WALLET_CONTRACT_ADDRESS");
  console.log("    Run: npm run api:dev");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
