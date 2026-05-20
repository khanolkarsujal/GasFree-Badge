import { getDb } from '../db/index.js';

const CATEGORY_LABELS = {
  send_money: 'Sent',
  receive_money: 'Received',
  wallet_load: 'Added Money',
  wallet_withdraw: 'Withdrawn',
  merchant_pay: 'Paid',
  badge_claim: 'Badge',
  subscription: 'Subscription',
  cashback: 'Cashback',
  refund: 'Refund',
  gas_fee: 'Gas Fee',
  request_paid: 'Request Paid',
};

export class PassbookService {
  getPassbook(address, { limit = 30, offset = 0, category, fromDate, toDate } = {}) {
    const db = getDb();
    let sql = `
      SELECT id, direction, amount, currency, category, status, narration,
             counterparty, merchant_id, chain_tx_hash, reference_id, created_at, completed_at
      FROM transactions
      WHERE user_address = ?
    `;
    const params = [address.toLowerCase()];

    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }
    if (fromDate) {
      sql += ' AND created_at >= ?';
      params.push(fromDate);
    }
    if (toDate) {
      sql += ' AND created_at <= ?';
      params.push(toDate);
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const rows = db.prepare(sql).all(...params);

    const summary = db.prepare(`
      SELECT
        COUNT(*) AS total_count,
        COALESCE(SUM(CASE WHEN direction = 'credit' AND status = 'success' THEN CAST(amount AS REAL) ELSE 0 END), 0) AS total_received,
        COALESCE(SUM(CASE WHEN direction = 'debit' AND status = 'success' THEN CAST(amount AS REAL) ELSE 0 END), 0) AS total_spent
      FROM transactions WHERE user_address = ?
    `).get(address.toLowerCase());

    return {
      entries: rows.map((r) => ({
        ...r,
        label: CATEGORY_LABELS[r.category] || r.category,
        displayAmount: r.direction === 'credit' ? `+${r.amount}` : `-${r.amount}`,
      })),
      summary: {
        totalTransactions: summary.total_count,
        totalReceived: summary.total_received.toFixed(2),
        totalSpent: summary.total_spent.toFixed(2),
      },
      pagination: { limit, offset, hasMore: rows.length === limit },
    };
  }

  getMonthlyStatement(address, year, month) {
    const start = `${year}-${String(month).padStart(2, '0')}-01`;
    const end = `${year}-${String(month).padStart(2, '0')}-31`;
    return this.getPassbook(address, { limit: 500, fromDate: start, toDate: end });
  }
}
