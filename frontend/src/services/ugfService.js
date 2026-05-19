import { ethers } from 'ethers';
import { CONTRACT_ADDRESS } from '../contractConfig';
import { UGFClient, UGFError } from '@tychilabs/ugf-testnet-js';

// Contract interface
const CONTRACT_ABI = [
  'function claimBadge(address recipient) external returns (uint256)',
  'function totalMinted() external view returns (uint256)',
  'function remaining() external view returns (uint256)',
  'event BadgeClaimed(address indexed recipient, uint256 indexed tokenId)',
];

// TYI_MOCK_USD on Base Sepolia (from UGF registry)
const TYI_ADDRESS = '0x9b9deeea99C2B77c0e7F7bdCf0a01a0F0843e5DD';
const TYI_ABI    = [
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
];

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

export async function getTYIBalance(provider, address) {
  try {
    const tyi = new ethers.Contract(TYI_ADDRESS, TYI_ABI, provider);
    const [raw, dec] = await Promise.all([tyi.balanceOf(address), tyi.decimals()]);
    return parseFloat(ethers.formatUnits(raw, dec));
  } catch {
    return null; // can't check — don't block UX
  }
}

export async function getClaimedBadges(provider, address) {
  try {
    const c = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    const filter = c.filters.BadgeClaimed(address);
    const events = await c.queryFilter(filter, 0, 'latest');
    return events.map(e => ({
      tokenId: Number(e.args.tokenId),
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
 *  4. Execute — UGF sponsors gas, claimBadge(recipient) lands on-chain
 *
 * @param {ethers.Signer} signer   Connected signer (Base Sepolia required)
 * @param {Function}      onStep   Progress callback: receives 1-4
 * @returns {Promise<string>}      Confirmed on-chain tx hash
 */
export async function executeGaslessClaim(signer, onStep = () => {}) {
  const client       = new UGFClient();
  const payerAddress = await signer.getAddress();

  // ── 1. Authenticate ──────────────────────────────────────────────────────────
  onStep(1);
  try {
    await client.auth.login(signer);
  } catch (err) {
    throw new Error(`Authentication failed: ${_msg(err)}`);
  }

  // ── 2. Quote — encode claimBadge(recipient) ──────────────────────────────────
  onStep(2);
  const iface = new ethers.Interface(CONTRACT_ABI);
  const data  = iface.encodeFunctionData('claimBadge', [payerAddress]);
  let quote;
  try {
    quote = await client.quote.get({
      payer_address: payerAddress.toLowerCase(),
      tx_object: JSON.stringify({
        from:  payerAddress.toLowerCase(),
        to:    CONTRACT_ADDRESS.toLowerCase(),
        data,
        value: '0x0',
      }),
    });
  } catch (err) {
    throw new Error(`Quote failed: ${_msg(err)}`);
  }

  // ── 3. Settle — ERC-3009 TYI signature (user pays zero ETH) ─────────────────
  onStep(3);
  try {
    await client.payment.x402.execute({ quote, signer });
  } catch (err) {
    const msg = _msg(err);
    if (/400|insufficient|balance|HTTP 4/i.test(msg)) throw new Error('NO_MOCK_USD');
    throw new Error(`Payment failed: ${msg}`);
  }

  // ── 4. Execute — UGF sponsors ETH, confirms on-chain ────────────────────────
  onStep(4);
  try {
    const { userTxHash } = await client.chains.evm.sponsorAndExecute(
      quote.digest,
      signer,
      async () => ({ to: CONTRACT_ADDRESS.toLowerCase(), data, value: 0n })
    );
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

/**
 * Execute a generic gasless ERC-20 token transfer on-chain via UGF.
 * Used for custom Token Sends, Donations, and Checkouts.
 */
export async function executeGaslessTokenTransfer(signer, recipient, amountDecimals, onStep = () => {}) {
  const client       = new UGFClient();
  const payerAddress = await signer.getAddress();

  // ── 1. Authenticate ──────────────────────────────────────────────────────────
  onStep(1);
  try {
    await client.auth.login(signer);
  } catch (err) {
    throw new Error(`Authentication failed: ${_msg(err)}`);
  }

  // ── 2. Quote — encode transfer(recipient, amount) on TYI ERC-20 token ────────
  onStep(2);
  const tyiInterface = new ethers.Interface([
    'function transfer(address to, uint256 value) external returns (bool)'
  ]);
  const parsedAmount = ethers.parseUnits(amountDecimals.toString(), 18);
  const data = tyiInterface.encodeFunctionData('transfer', [recipient.toLowerCase(), parsedAmount]);
  
  let quote;
  try {
    quote = await client.quote.get({
      payer_address: payerAddress.toLowerCase(),
      tx_object: JSON.stringify({
        from:  payerAddress.toLowerCase(),
        to:    TYI_ADDRESS.toLowerCase(),
        data,
        value: '0x0',
      }),
    });
  } catch (err) {
    throw new Error(`Quote failed: ${_msg(err)}`);
  }

  // ── 3. Settle — ERC-3009 signature ──────────────────────────────────────────
  onStep(3);
  try {
    await client.payment.x402.execute({ quote, signer });
  } catch (err) {
    const msg = _msg(err);
    if (/400|insufficient|balance|HTTP 4/i.test(msg)) throw new Error('NO_MOCK_USD');
    throw new Error(`Payment failed: ${msg}`);
  }

  // ── 4. Execute ───────────────────────────────────────────────────────────────
  onStep(4);
  try {
    const { userTxHash } = await client.chains.evm.sponsorAndExecute(
      quote.digest,
      signer,
      async () => ({ to: TYI_ADDRESS.toLowerCase(), data, value: 0n })
    );
    return userTxHash;
  } catch (err) {
    throw new Error(`Execution failed: ${_msg(err)}`);
  }
}
