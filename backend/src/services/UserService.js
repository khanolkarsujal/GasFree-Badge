import { getDb } from '../db/index.js';

export class UserService {
  ensureUser(address) {
    const db = getDb();
    const normalized = address.toLowerCase();
    const existing = db.prepare('SELECT address FROM users WHERE address = ?').get(normalized);
    if (existing) return normalized;

    const tx = db.transaction(() => {
      db.prepare(`
        INSERT INTO users (address, kyc_tier) VALUES (?, 'basic')
      `).run(normalized);
      db.prepare(`
        INSERT INTO wallet_accounts (address, available_balance, locked_balance, currency)
        VALUES (?, '0', '0', 'TYI')
      `).run(normalized);
    });
    tx();
    return normalized;
  }

  getProfile(address) {
    const db = getDb();
    const user = db.prepare(`
      SELECT u.address, u.display_name, u.kyc_tier, u.created_at,
             w.available_balance, w.locked_balance, w.on_chain_balance, w.last_synced_at
      FROM users u
      JOIN wallet_accounts w ON w.address = u.address
      WHERE u.address = ?
    `).get(address.toLowerCase());

    return user;
  }

  updateProfile(address, { displayName }) {
    const db = getDb();
    this.ensureUser(address);
    db.prepare(`
      UPDATE users SET display_name = ?, updated_at = datetime('now')
      WHERE address = ?
    `).run(displayName ?? null, address.toLowerCase());
    return this.getProfile(address);
  }
}
