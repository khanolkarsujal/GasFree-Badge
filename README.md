# Gasless NFT Badge Claim App (Team Setup)

Welcome to your hackathon project! This project is structured so a 4-person team can work independently without file conflicts.

## Folder Structure

```text
NFT Blockchain project/
├── contracts/                 # Teammate 1 (Smart Contract)
│   └── BadgeNFT.sol
├── frontend/                  # React Application
│   ├── src/
│   │   ├── App.jsx            # Teammate 2 (Frontend UI)
│   │   ├── ugfService.js      # Teammate 3 (UGF Integration)
│   │   └── contractConfig.js  # Teammate 1 & 4 (Config Update)
└── README.md                  # Teammate 4 (Testing & Deployment)
```

## Team Roles

### Teammate 1: Smart Contract Developer
**Files to edit:** `contracts/BadgeNFT.sol`
- Write and verify the ERC-721 contract.
- Work with Teammate 4 to deploy it.

### Teammate 2: Frontend Developer
**Files to edit:** `frontend/src/App.jsx`, `frontend/src/App.css`
- Build the UI layout, connect wallet button, and success state.
- Call the `executeGaslessClaim(signer)` function from `ugfService.js` without worrying about how the transaction works.

### Teammate 3: Web3 / UGF Integrator
**Files to edit:** `frontend/src/ugfService.js`
- Focus entirely on the Universal Gas Framework (UGF) integration.
- Implement the "intent" builder using Mock USD inside the `executeGaslessClaim` function.

### Teammate 4: DevOps / Deployment
**Files to edit:** `frontend/src/contractConfig.js`, `README.md`
- Deploy the contract to Base Sepolia (using Remix or Hardhat).
- Update the `CONTRACT_ADDRESS` in `contractConfig.js`.
- Make sure everyone's pieces connect and the app runs locally.

## Setup Instructions

1. `cd frontend`
2. `npm install`
3. `npm run dev`
