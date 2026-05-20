import { getDb } from '../db/index.js';
import { ChainService } from './ChainService.js';

const BADGE_CATALOG = [
  { id: 'explorer', type: 0, name: 'Explorer', tier: 'Common', feeTyi: '0.10' },
  { id: 'builder', type: 1, name: 'Builder', tier: 'Rare', feeTyi: '0.15' },
  { id: 'pioneer', type: 2, name: 'Pioneer', tier: 'Epic', feeTyi: '0.20' },
];

export class BadgeService {
  constructor() {
    this.chain = new ChainService();
  }

  getCatalog() {
    return BADGE_CATALOG;
  }

  async prepareClaim(address, badgeId) {
    const badge = BADGE_CATALOG.find((b) => b.id === badgeId);
    if (!badge) throw new Error('Unknown badge');

    const ugf = this.chain.buildClaimBadgePayload(address, badge.type);
    const stats = await this.chain.getBadgeStats();

    return {
      badge,
      collection: stats,
      ugfTransaction: ugf,
      steps: [
        'Authenticate with EIP-191',
        'Get gas quote in TYI',
        'Sign ERC-3009 settlement',
        'UGF sponsors and mints badge',
      ],
    };
  }

  getUserBadgesFromIndexer(address) {
    const db = getDb();
    const events = db.prepare(`
      SELECT payload_json, tx_hash, block_number, created_at
      FROM chain_events
      WHERE event_name = 'BadgeClaimed'
        AND json_extract(payload_json, '$.recipient') = ?
      ORDER BY block_number DESC
    `).all(address.toLowerCase());

    return events.map((e) => {
      const p = JSON.parse(e.payload_json);
      const meta = BADGE_CATALOG.find((b) => b.type === p.badgeType);
      return {
        tokenId: p.tokenId,
        badgeType: p.badgeType,
        badgeId: meta?.id,
        name: meta?.name,
        txHash: e.tx_hash,
        block: e.block_number,
        claimedAt: e.created_at,
      };
    });
  }
}
