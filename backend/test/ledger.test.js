import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { migrate } from '../src/db/migrate.js';
import { getDb, closeDb } from '../src/db/index.js';
import { UserService } from '../src/services/UserService.js';
import { LedgerService } from '../src/services/LedgerService.js';
import { PaymentService } from '../src/services/PaymentService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testDb = path.join(__dirname, '../data/test-wallet.db');

before(() => {
  if (fs.existsSync(testDb)) fs.unlinkSync(testDb);
  process.env.DATABASE_PATH = testDb;
  migrate(testDb);
});

describe('SaaS wallet ledger', () => {
  it('creates users and transfers balance', async () => {
    const users = new UserService();
    const ledger = new LedgerService();

    const alice = users.ensureUser('0x1111111111111111111111111111111111111111');
    const bob = users.ensureUser('0x2222222222222222222222222222222222222222');

    ledger.credit({ address: alice, amount: 100, category: 'wallet_load', narration: 'Test load' });
    const result = ledger.postTransfer({
      from: alice,
      to: bob,
      amount: 25,
      category: 'send_money',
      narration: 'Test send',
      referenceId: 'tx-1',
    });

    assert.equal(result.fromBalance, '75.000000');
    assert.equal(result.toBalance, '25.000000');

    const profile = users.getProfile(bob);
    assert.equal(profile.available_balance, '25.000000');
    closeDb();
  });

  it('send money records passbook entries', async () => {
    if (fs.existsSync(testDb)) fs.unlinkSync(testDb);
    migrate(testDb);

    const payments = new PaymentService();
    const alice = '0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
    const bob = '0xBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB';

    new UserService().ensureUser(alice);
    new LedgerService().credit({
      address: alice,
      amount: 500,
      category: 'wallet_load',
      narration: 'Seed',
    });

    const out = payments.sendMoney(alice, { to: bob, amount: '10', narration: 'Lunch' });
    assert.equal(out.status, 'success');

    const db = getDb();
    const rows = db.prepare('SELECT * FROM transactions WHERE user_address = ?').all(alice);
    assert.ok(rows.length >= 1);
    closeDb();
  });
});
