import { ethers } from 'ethers';
import { CONTRACT_ADDRESS } from '../contractConfig';
import { UGFClient, UGFError } from '@tychilabs/ugf-testnet-js';

// Contract interface
const CONTRACT_ABI = [
  'function claimBadge(address recipient, uint8 badgeType) external returns (uint256)',
  'function totalMinted() external view returns (uint256)',
  'function remaining() external view returns (uint256)',
  'function getBadgeType(uint256 tokenId) external view returns (uint8)',
  'event BadgeClaimed(address indexed recipient, uint256 indexed tokenId, uint8 indexed badgeType)',
];

// Cache UGF client instance and contract interface
let cachedUGFClient = null;
let cachedInterface = null;

function getUGFClient() {
  if (!cachedUGFClient) {
    cachedUGFClient = new UGFClient();
  }
  return cachedUGFClient;
}

function getContractInterface() {
  if (!cachedInterface) {
    cachedInterface = new ethers.Interface(CONTRACT_ABI);
  }
  return cachedInterface;
}

// ── Public data functions ──────────────────────────────────────────────────────

export async function getCollectionStats(provider) {
  try {
    const c = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    const [minted, remaining] = await Promise.all([
      c.totalMinted(), c.remaining(),
    ]);
    return { minted: Number(minted), remaining: Number(remaining), total: 10_000 };
  } catch {
    return { minted: 0, remaining: 10_000, total: 10_000 };
  }
}

export async function getClaimedBadges(provider, address) {
  try {
    const c = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    const filter = c.filters.BadgeClaimed(address);
    const latest = await provider.getBlockNumber();
    const fromBlock = Math.max(0, latest - 500_000);
    const events = await c.queryFilter(filter, fromBlock, 'latest');
    return events.map(e => ({
      tokenId: Number(e.args.tokenId),
      badgeType: Number(e.args.badgeType),
      txHash:  e.transactionHash,
      block:   e.blockNumber,
    }));
  } catch {
    return [];
  }
}

// ── Core gasless claim ─────────────────────────────────────────────────────────

/**
 * Execute a gasless NFT badge claim via UGF.
 *
 * UGF Flow (No paymasters. No bundlers. No ERC-4337.):
 *  1. Auth    — EIP-191 wallet sign → JWT
 *  2. Quote   — tx calldata → digest + TYI settlement amount
 *  3. Settle  — ERC-3009 TYI_MOCK_USD signature (no ETH from user)
 *  4. Execute — UGF sponsors gas, claimBadge(recipient, badgeType) lands on-chain
 *
 * @param {ethers.Signer} signer    Connected signer (Base Sepolia required)
 * @param {number}        badgeType The badge type ID (0 = Explorer, 1 = Builder, 2 = Pioneer)
 * @param {Function}      onProgress Progress callback: receives percentage (0-100)
 * @returns {Promise<string>}       Confirmed on-chain tx hash
 */
export async function executeGaslessClaim(signer, badgeType, onProgress = () => {}) {
  const client       = getUGFClient();
  const iface        = getContractInterface();
  
  // Ultra-fast parallel initialization
  const [payerAddress] = await Promise.all([
    signer.getAddress(),
  ]);

  // Ultra-granular progress updates for maximum perceived speed
  onProgress(2);
  onProgress(4);
  onProgress(6);

  // ── 1. Authenticate ──────────────────────────────────────────────────────────
  try {
    onProgress(8);
    onProgress(10);
    onProgress(12);
    await client.auth.login(signer);
    onProgress(14);
    onProgress(16);
    onProgress(18);
    onProgress(20);
  } catch (err) {
    throw new Error(`Authentication failed: ${_msg(err)}`);
  }

  // ── 2. Quote — encode claimBadge(recipient, badgeType) ──────────────────────
  onProgress(22);
  onProgress(24);
  const data  = iface.encodeFunctionData('claimBadge', [payerAddress, badgeType]);
  let quote;
  try {
    onProgress(26);
    onProgress(28);
    quote = await client.quote.get({
      payer_address: payerAddress.toLowerCase(),
      tx_object: JSON.stringify({
        from:  payerAddress.toLowerCase(),
        to:    CONTRACT_ADDRESS.toLowerCase(),
        data,
        value: '0x0',
      }),
    });
    onProgress(30);
    onProgress(32);
    onProgress(34);
  } catch (err) {
    throw new Error(`Quote failed: ${_msg(err)}`);
  }

  // ── 3. Settle — ERC-3009 TYI signature (user pays zero ETH) ─────────────────
  onProgress(36);
  onProgress(38);
  try {
    onProgress(40);
    onProgress(42);
    await client.payment.x402.execute({ quote, signer });
    onProgress(44);
    onProgress(46);
    onProgress(48);
  } catch (err) {
    const msg = _msg(err);
    if (/400|insufficient|balance|HTTP 4/i.test(msg)) throw new Error('NO_MOCK_USD');
    throw new Error(`Payment failed: ${msg}`);
  }

  // ── 4. Execute — UGF sponsors ETH, confirms on-chain ────────────────────────
  onProgress(50);
  onProgress(52);
  try {
    onProgress(54);
    onProgress(56);
    const { userTxHash } = await client.chains.evm.sponsorAndExecute(
      quote.digest,
      signer,
      async () => ({ to: CONTRACT_ADDRESS.toLowerCase(), data, value: 0n })
    );
    onProgress(58);
    onProgress(60);
    onProgress(62);
    onProgress(64);
    onProgress(66);
    onProgress(68);
    onProgress(70);
    onProgress(72);
    onProgress(74);
    onProgress(76);
    onProgress(78);
    onProgress(80);
    onProgress(82);
    onProgress(84);
    onProgress(86);
    onProgress(88);
    onProgress(90);
    onProgress(92);
    onProgress(94);
    onProgress(96);
    onProgress(98);
    onProgress(100);
    return userTxHash;
  } catch (err) {
    const msg = _msg(err);
    if (msg.includes('MaxSupplyReached')) throw new Error('MAX_SUPPLY');
    if (msg.includes('ContractPaused'))   throw new Error('PAUSED');
    throw new Error(`Execution failed: ${msg}`);
  }
}

function _msg(err) {
  return err instanceof UGFError ? err.message : (err?.message ?? String(err));
}
