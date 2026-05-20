import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db/index.js';
import { AppError } from '../lib/errors.js';

/**
 * Double-entry ledger — every money movement creates balanced debit/credit rows.
 */
export class LedgerService {
  postTransfer({ from, to, amount, category, narration, referenceId, metadata }) {
    const db = getDb();
    const amt = parseFloat(amount);
    if (!(amt > 0)) throw new AppError('Amount must be positive', 400, 'INVALID_AMOUNT');

    const groupId = uuidv4();
    const fromAcct = db.prepare('SELECT available_balance FROM wallet_accounts WHERE address = ?').get(from);
    const toAcct = db.prepare('SELECT available_balance FROM wallet_accounts WHERE address = ?').get(to);

    if (!fromAcct || !toAcct) {
      throw new AppError('Wallet account not found', 404, 'WALLET_NOT_FOUND');
    }

    const fromBal = parseFloat(fromAcct.available_balance);
    if (fromBal < amt) {
      throw new AppError('Insufficient wallet balance', 402, 'INSUFFICIENT_BALANCE');
    }

    const newFromBal = (fromBal - amt).toFixed(6);
    const newToBal = (parseFloat(toAcct.available_balance) + amt).toFixed(6);

    const insertEntry = db.prepare(`
      INSERT INTO ledger_entries (
        id, txn_group_id, account_address, entry_type, amount, balance_after,
        category, narration, reference_id, metadata_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const tx = db.transaction(() => {
      db.prepare(`UPDATE wallet_accounts SET available_balance = ?, updated_at = datetime('now') WHERE address = ?`)
        .run(newFromBal, from);
      db.prepare(`UPDATE wallet_accounts SET available_balance = ?, updated_at = datetime('now') WHERE address = ?`)
        .run(newToBal, to);

      insertEntry.run(uuidv4(), groupId, from, 'debit', String(amt), newFromBal, category, narration, referenceId, metadata ? JSON.stringify(metadata) : null);
      insertEntry.run(uuidv4(), groupId, to, 'credit', String(amt), newToBal, category, narration, referenceId, metadata ? JSON.stringify(metadata) : null);
    });
    tx();

    return { txnGroupId: groupId, fromBalance: newFromBal, toBalance: newToBal };
  }

  credit({ address, amount, category, narration, referenceId }) {
    const db = getDb();
    const amt = parseFloat(amount);
    const acct = db.prepare('SELECT available_balance FROM wallet_accounts WHERE address = ?').get(address);
    if (!acct) throw new AppError('Wallet not found', 404);

    const newBal = (parseFloat(acct.available_balance) + amt).toFixed(6);
    const groupId = uuidv4();

    const tx = db.transaction(() => {
      db.prepare(`UPDATE wallet_accounts SET available_balance = ?, updated_at = datetime('now') WHERE address = ?`)
        .run(newBal, address);
      db.prepare(`
        INSERT INTO ledger_entries (id, txn_group_id, account_address, entry_type, amount, balance_after, category, narration, reference_id)
        VALUES (?, ?, ?, 'credit', ?, ?, ?, ?, ?)
      `).run(uuidv4(), groupId, address, String(amt), newBal, category, narration, referenceId);
    });
    tx();
    return { txnGroupId: groupId, balance: newBal };
  }
}
