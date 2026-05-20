import { ethers } from 'ethers';
import { getDb } from '../db/index.js';
import { config } from '../config.js';
import { UserService } from './UserService.js';
import { LedgerService } from './LedgerService.js';

const BADGE_ABI = [
  'event BadgeClaimed(address indexed recipient, uint256 indexed tokenId, uint8 indexed badgeType)',
];

const WALLET_ABI = [
  'event Deposited(address indexed user, uint256 amount, uint256 newBalance, bytes32 indexed refId)',
  'event InternalTransfer(address indexed from, address indexed to, uint256 amount, bytes32 indexed refId, uint256 fromBalance, uint256 toBalance)',
  'event PaymentRequestFulfilled(bytes32 indexed requestId, address indexed payer, address indexed payee, uint256 amount)',
];

const TYI_ABI = [
  'event Transfer(address indexed from, address indexed to, uint256 value)',
];

export class ChainIndexer {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(config.chain.rpcUrl, config.chain.id);
    this.users = new UserService();
    this.ledger = new LedgerService();
    this.running = false;
  }

  getLastBlock() {
    const db = getDb();
    const row = db.prepare(`SELECT value FROM indexer_state WHERE key = 'last_block'`).get();
    return row ? Number(row.value) : config.indexer.startBlock;
  }

  setLastBlock(n) {
    const db = getDb();
    db.prepare(`
      INSERT INTO indexer_state (key, value) VALUES ('last_block', ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `).run(String(n));
  }

  async syncOnce() {
    const latest = await this.provider.getBlockNumber();
    let from = this.getLastBlock();
    if (from === 0 && config.indexer.startBlock > 0) from = config.indexer.startBlock;

    const to = Math.min(from + 2000, latest);
    if (to <= from) return { from, to: latest, processed: 0 };

    const contracts = [
      { address: config.chain.badgeContract, abi: BADGE_ABI, name: 'badge' },
      { address: config.chain.tyiToken, abi: TYI_ABI, name: 'tyi' },
    ];
    if (config.chain.walletContract) {
      contracts.push({ address: config.chain.walletContract, abi: WALLET_ABI, name: 'wallet' });
    }

    let processed = 0;
    const db = getDb();
    const insertEvent = db.prepare(`
      INSERT OR IGNORE INTO chain_events (tx_hash, log_index, block_number, event_name, contract, payload_json)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    for (const c of contracts) {
      if (!c.address) continue;
      const contract = new ethers.Contract(c.address, c.abi, this.provider);
      const eventNames = contract.interface.fragments
        .filter((f) => f.type === 'event')
        .map((f) => f.name);

      const logs = [];
      for (const eventName of eventNames) {
        const batch = await contract.queryFilter(eventName, from + 1, to);
        logs.push(...batch);
      }

      for (const log of logs) {
        const parsed = contract.interface.parseLog(log);
        if (!parsed) continue;

        const payload = formatPayload(parsed);
        insertEvent.run(
          log.transactionHash,
          log.index,
          log.blockNumber,
          parsed.name,
          c.address.toLowerCase(),
          JSON.stringify(payload)
        );
        await this.applyEvent(parsed.name, payload, log);
        processed++;
      }
    }

    this.setLastBlock(to);
    return { from, to, latest, processed };
  }

  async applyEvent(name, payload, log) {
    const db = getDb();

    if (name === 'BadgeClaimed') {
      this.users.ensureUser(payload.recipient);
      const exists = db.prepare(`
        SELECT id FROM transactions WHERE chain_tx_hash = ? AND user_address = ?
      `).get(log.transactionHash, payload.recipient);
      if (!exists) {
        db.prepare(`
          INSERT INTO transactions (id, user_address, direction, amount, category, status, narration, chain_tx_hash, chain_block, reference_id, completed_at)
          VALUES (?, ?, 'debit', '0', 'badge_claim', 'success', ?, ?, ?, ?, datetime('now'))
        `).run(
          `${log.transactionHash}-${log.index}`,
          payload.recipient,
          `Claimed ${['Explorer', 'Builder', 'Pioneer'][payload.badgeType] || 'Badge'} #${payload.tokenId}`,
          log.transactionHash,
          log.blockNumber,
          String(payload.tokenId)
        );
      }
    }

    if (name === 'InternalTransfer') {
      const amount = ethers.formatUnits(payload.amount, 18);
      const ref = payload.refId;
      const synced = db.prepare(`SELECT 1 FROM transactions WHERE reference_id = ? LIMIT 1`).get(ref);
      if (!synced) {
        this.users.ensureUser(payload.from);
        this.users.ensureUser(payload.to);
        try {
          this.ledger.postTransfer({
            from: payload.from,
            to: payload.to,
            amount,
            category: 'receive_money',
            narration: 'On-chain wallet transfer',
            referenceId: ref,
          });
        } catch {
          // Balances may already reflect internal state
        }
      }
    }
  }

  start() {
    if (this.running) return;
    this.running = true;
    const tick = async () => {
      if (!this.running) return;
      try {
        await this.syncOnce();
      } catch (e) {
        console.error('[indexer]', e.message);
      }
      setTimeout(tick, config.indexer.pollMs);
    };
    tick();
  }

  stop() {
    this.running = false;
  }
}

function formatPayload(parsed) {
  const args = {};
  parsed.fragment.inputs.forEach((input, i) => {
    let v = parsed.args[i];
    if (typeof v === 'bigint') v = v.toString();
    if (typeof v === 'object' && v !== null && 'toLowerCase' in v) v = v.toLowerCase();
    args[input.name || i] = v;
  });
  return args;
}
