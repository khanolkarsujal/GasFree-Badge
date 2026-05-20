import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db/index.js';
import { AppError } from '../lib/errors.js';
import { UserService } from './UserService.js';

export class SubscriptionService {
  constructor() {
    this.users = new UserService();
  }

  list(address) {
    const db = getDb();
    return db.prepare(`
      SELECT s.*, m.name AS merchant_name, m.category
      FROM subscriptions s
      JOIN merchants m ON m.id = s.merchant_id
      WHERE s.user_address = ?
      ORDER BY s.created_at DESC
    `).all(address.toLowerCase());
  }

  create(address, { merchantId, planName, amount, intervalDays, agentAddress }) {
    const db = getDb();
    const merchant = db.prepare('SELECT id FROM merchants WHERE id = ? AND is_active = 1').get(merchantId);
    if (!merchant) throw new AppError('Merchant not found', 404);

    this.users.ensureUser(address);
    const id = uuidv4();
    const nextBilling = new Date(Date.now() + intervalDays * 86400_000).toISOString();

    db.prepare(`
      INSERT INTO subscriptions (
        id, user_address, merchant_id, plan_name, amount, interval_days, status, next_billing_at, agent_address
      ) VALUES (?, ?, ?, ?, ?, ?, 'active', ?, ?)
    `).run(
      id,
      address.toLowerCase(),
      merchantId,
      planName,
      String(amount),
      intervalDays,
      nextBilling,
      agentAddress?.toLowerCase() || null
    );

    return this.getById(id);
  }

  getById(id) {
    const db = getDb();
    return db.prepare(`
      SELECT s.*, m.name AS merchant_name FROM subscriptions s
      JOIN merchants m ON m.id = s.merchant_id WHERE s.id = ?
    `).get(id);
  }

  cancel(address, subscriptionId) {
    const db = getDb();
    const sub = db.prepare('SELECT * FROM subscriptions WHERE id = ?').get(subscriptionId);
    if (!sub || sub.user_address !== address.toLowerCase()) {
      throw new AppError('Subscription not found', 404);
    }
    db.prepare(`UPDATE subscriptions SET status = 'cancelled' WHERE id = ?`).run(subscriptionId);
    return this.getById(subscriptionId);
  }
}
