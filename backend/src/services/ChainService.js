import { ethers } from 'ethers';
import { config } from '../config.js';

const TYI_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function transfer(address to, uint256 value) returns (bool)',
];

const BADGE_ABI = [
  'function claimBadge(address recipient, uint8 badgeType) external returns (uint256)',
  'function totalMinted() view returns (uint256)',
  'function remaining() view returns (uint256)',
  'event BadgeClaimed(address indexed recipient, uint256 indexed tokenId, uint8 indexed badgeType)',
];

const WALLET_ABI = [
  'function balances(address) view returns (uint256)',
  'function deposit(uint256 amount, bytes32 refId)',
  'function withdraw(uint256 amount, bytes32 refId)',
  'function transferTo(address to, uint256 amount, bytes32 refId)',
  'function createPaymentRequest(bytes32 requestId, uint256 amount, uint40 ttlSeconds, bytes32 noteHash)',
  'function payRequest(bytes32 requestId)',
  'event Deposited(address indexed user, uint256 amount, uint256 newBalance, bytes32 indexed refId)',
  'event Withdrawn(address indexed user, uint256 amount, uint256 newBalance, bytes32 indexed refId)',
  'event InternalTransfer(address indexed from, address indexed to, uint256 amount, bytes32 indexed refId, uint256 fromBalance, uint256 toBalance)',
  'event PaymentRequestCreated(bytes32 indexed requestId, address indexed payee, uint256 amount, uint40 expiresAt, bytes32 noteHash)',
  'event PaymentRequestFulfilled(bytes32 indexed requestId, address indexed payer, address indexed payee, uint256 amount)',
];

export class ChainService {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(config.chain.rpcUrl, config.chain.id);
  }

  async getTyiBalance(address) {
    const tyi = new ethers.Contract(config.chain.tyiToken, TYI_ABI, this.provider);
    const [raw, dec] = await Promise.all([tyi.balanceOf(address), tyi.decimals()]);
    return parseFloat(ethers.formatUnits(raw, dec));
  }

  async getOnChainWalletBalance(address) {
    if (!config.chain.walletContract) return null;
    const wallet = new ethers.Contract(config.chain.walletContract, WALLET_ABI, this.provider);
    const raw = await wallet.balances(address);
    return parseFloat(ethers.formatUnits(raw, 18));
  }

  async getBadgeStats() {
    const badge = new ethers.Contract(config.chain.badgeContract, BADGE_ABI, this.provider);
    const [minted, remaining] = await Promise.all([badge.totalMinted(), badge.remaining()]);
    return { minted: Number(minted), remaining: Number(remaining), total: 10_000 };
  }

  buildTyiTransferPayload(from, to, amountDecimals) {
    const iface = new ethers.Interface(TYI_ABI);
    const amount = ethers.parseUnits(String(amountDecimals), 18);
    const data = iface.encodeFunctionData('transfer', [to.toLowerCase(), amount]);
    return {
      chainId: config.chain.id,
      from: from.toLowerCase(),
      to: config.chain.tyiToken.toLowerCase(),
      data,
      value: '0x0',
      txObject: {
        from: from.toLowerCase(),
        to: config.chain.tyiToken.toLowerCase(),
        data,
        value: '0x0',
      },
    };
  }

  buildClaimBadgePayload(recipient, badgeType) {
    const iface = new ethers.Interface(BADGE_ABI);
    const data = iface.encodeFunctionData('claimBadge', [recipient, badgeType]);
    return {
      chainId: config.chain.id,
      function: 'claimBadge',
      txObject: {
        from: recipient.toLowerCase(),
        to: config.chain.badgeContract.toLowerCase(),
        data,
        value: '0x0',
      },
    };
  }

  buildWalletDepositPayload(user, amountDecimals, referenceHex) {
    if (!config.chain.walletContract) return null;
    const iface = new ethers.Interface(WALLET_ABI);
    const amount = ethers.parseUnits(String(amountDecimals), 18);
    const ref = referenceHex.startsWith('0x') ? referenceHex : `0x${referenceHex}`;
    const data = iface.encodeFunctionData('deposit', [amount, ref]);
    return {
      txObject: {
        from: user.toLowerCase(),
        to: config.chain.walletContract.toLowerCase(),
        data,
        value: '0x0',
      },
    };
  }

  buildPaymentRequestPayload(requestIdHex, amountDecimals, ttlSeconds, note) {
    if (!config.chain.walletContract) return null;
    const iface = new ethers.Interface(WALLET_ABI);
    const amount = ethers.parseUnits(String(amountDecimals), 18);
    const noteHash = ethers.id(note || '');
    const data = iface.encodeFunctionData('createPaymentRequest', [
      requestIdHex,
      amount,
      ttlSeconds,
      noteHash,
    ]);
    return { txObject: { to: config.chain.walletContract.toLowerCase(), data } };
  }

  getContracts() {
    return {
      chainId: config.chain.id,
      tyiToken: config.chain.tyiToken,
      badgeContract: config.chain.badgeContract,
      walletContract: config.chain.walletContract || null,
    };
  }
}
