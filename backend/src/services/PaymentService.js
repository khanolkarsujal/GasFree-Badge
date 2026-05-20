import { v4 as uuidv4 } from 'uuid';
import { ethers } from 'ethers';
import { getDb } from '../db/index.js';
import { config } from '../config.js';
import { AppError, assert } from '../lib/errors.js';
import { generateRequestCode, toBytes32Reference } from '../lib/crypto.js';
import { UserService } from './UserService.js';
import { LedgerService } from './LedgerService.js';
import { ChainService } from './ChainService.js';
import { WebhookService } from './WebhookService.js';

export class PaymentService {
  constructor() {
    this.users = new UserService();
    this.ledger = new LedgerService();
    this.chain = new ChainService();
    this.webhooks = new WebhookService();
  }

  checkDailyLimit(address, amount) {
    const db = getDb();
    const day = new Date().toISOString().slice(0, 10);
    const row = db.prepare('SELECT sent_amount FROM daily_limits WHERE user_address = ? AND day = ?')
      .get(address, day);
    const sent = row ? parseFloat(row.sent_amount) : 0;
    const next = sent + amount;
    if (next > config.limits.dailySendTyi) {
      throw new AppError('Daily send limit exceeded', 429, 'DAILY_LIMIT');
    }
    return { day, sent, next };
  }

  bumpDailyLimit(address, amount) {
    const db = getDb();
    const day = new Date().toISOString().slice(0, 10);
    db.prepare(`
      INSERT INTO daily_limits (user_address, day, sent_amount) VALUES (?, ?, ?)
      ON CONFLICT(user_address, day) DO UPDATE SET sent_amount = CAST(sent_amount AS REAL) + ?
    `).run(address, day, String(amount), amount);
  }

  recordTransaction(row) {
    const db = getDb();
    db.prepare(`
      INSERT INTO transactions (
        id, user_address, counterparty, direction, amount, currency, category,
        status, narration, merchant_id, idempotency_key, chain_tx_hash, reference_id, metadata_json, completed_at
      ) VALUES (
        @id, @user_address, @counterparty, @direction, @amount, @currency, @category,
        @status, @narration, @merchant_id, @idempotency_key, @chain_tx_hash, @reference_id, @metadata_json,
        CASE WHEN @status = 'success' THEN datetime('now') ELSE NULL END
      )
    `).run(row);
  }

  sendMoney(sender, { to, amount, narration, idempotencyKey }) {
    const amt = parseFloat(amount);
    assert(amt >= config.limits.minSendTyi, `Minimum send is ${config.limits.minSendTyi} TYI`);
    assert(amt <= config.limits.perTxMaxTyi, `Maximum per transaction is ${config.limits.perTxMaxTyi} TYI`);

    const from = this.users.ensureUser(sender);
    const recipient = this.users.ensureUser(to);

    const db = getDb();
    if (idempotencyKey) {
      const dup = db.prepare('SELECT id, status FROM transactions WHERE idempotency_key = ?').get(idempotencyKey);
      if (dup) return { duplicate: true, transactionId: dup.id, status: dup.status };
    }

    this.checkDailyLimit(from, amt);

    const txnId = uuidv4();
    const referenceId = toBytes32Reference(txnId);

    const { txnGroupId, fromBalance, toBalance } = this.ledger.postTransfer({
      from,
      to: recipient,
      amount: amt,
      category: 'send_money',
      narration: narration || `Sent to ${recipient.slice(0, 6)}...${recipient.slice(-4)}`,
      referenceId: txnId,
    });

    this.bumpDailyLimit(from, amt);

    this.recordTransaction({
      id: txnId,
      user_address: from,
      counterparty: recipient,
      direction: 'debit',
      amount: String(amt),
      currency: 'TYI',
      category: 'send_money',
      status: 'success',
      narration: narration || 'Send Money',
      merchant_id: null,
      idempotency_key: idempotencyKey || null,
      chain_tx_hash: null,
      reference_id: referenceId,
      metadata_json: JSON.stringify({ txnGroupId, mode: 'internal_wallet' }),
    });

    const recvId = uuidv4();
    this.recordTransaction({
      id: recvId,
      user_address: recipient,
      counterparty: from,
      direction: 'credit',
      amount: String(amt),
      currency: 'TYI',
      category: 'receive_money',
      status: 'success',
      narration: `Received from ${from.slice(0, 6)}...${from.slice(-4)}`,
      merchant_id: null,
      idempotency_key: null,
      chain_tx_hash: null,
      reference_id: referenceId,
      metadata_json: JSON.stringify({ txnGroupId, linkedTxn: txnId }),
    });

    const ugfPayload = this.chain.buildTyiTransferPayload(from, recipient, amt);

    this.webhooks.dispatch(from, 'payment.sent', { txnId, amount: amt, to: recipient });
    this.webhooks.dispatch(recipient, 'payment.received', { txnId: recvId, amount: amt, from });

    return {
      transactionId: txnId,
      status: 'success',
      referenceId,
      balances: { sender: fromBalance, recipient: toBalance },
      /** Client can pass this to UGF for on-chain settlement mirror */
      onChainSettlement: ugfPayload,
    };
  }

  createPaymentRequest(payee, { amount, note, ttlMinutes }) {
    const amt = parseFloat(amount);
    assert(amt > 0, 'Invalid amount');

    const address = this.users.ensureUser(payee);
    const id = uuidv4();
    const requestCode = generateRequestCode();
    const expiresAt = new Date(Date.now() + ttlMinutes * 60_000).toISOString();
    const onChainId = ethers.id(`payreq:${id}`);

    const db = getDb();
    db.prepare(`
      INSERT INTO payment_requests (id, request_code, payee_address, amount, note, status, on_chain_id, expires_at)
      VALUES (?, ?, ?, ?, ?, 'pending', ?, ?)
    `).run(id, requestCode, address, String(amt), note || null, onChainId, expiresAt);

    const walletCalldata = config.chain.walletContract
      ? this.chain.buildPaymentRequestPayload(onChainId, amt, ttlMinutes * 60, note)
      : null;

    return {
      requestId: id,
      requestCode,
      amount: String(amt),
      currency: 'TYI',
      payee: address,
      note,
      expiresAt,
      shareLink: `${config.apiBaseUrl}/pay/${requestCode}`,
      qrPayload: `gasfree://pay?code=${requestCode}&amount=${amt}`,
      onChain: walletCalldata,
    };
  }

  payRequest(payer, requestCode) {
    const db = getDb();
    const req = db.prepare('SELECT * FROM payment_requests WHERE request_code = ?').get(requestCode);
    if (!req) throw new AppError('Payment request not found', 404, 'NOT_FOUND');
    if (req.status !== 'pending') throw new AppError(`Request is ${req.status}`, 409, 'INVALID_STATE');
    if (new Date(req.expires_at) < new Date()) {
      db.prepare(`UPDATE payment_requests SET status = 'expired' WHERE id = ?`).run(req.id);
      throw new AppError('Payment request expired', 410, 'EXPIRED');
    }

    const from = this.users.ensureUser(payer);
    if (from === req.payee_address) throw new AppError('Cannot pay your own request', 400);

    const result = this.sendMoney(from, {
      to: req.payee_address,
      amount: req.amount,
      narration: req.note || `Paid request ${requestCode}`,
    });

    db.prepare(`
      UPDATE payment_requests SET status = 'paid', payer_address = ?, paid_at = datetime('now'), chain_tx_hash = ?
      WHERE id = ?
    `).run(from, result.onChainSettlement?.txObject?.data ? null : null, req.id);

    return { ...result, requestCode, requestId: req.id };
  }

  billPay(sender, { merchantId, amount, accountRef, idempotencyKey }) {
    const db = getDb();
    const merchant = db.prepare('SELECT * FROM merchants WHERE id = ? AND is_active = 1').get(merchantId);
    if (!merchant) throw new AppError('Merchant not found', 404);

    const treasury = merchant.wallet_address || config.chain.walletContract || config.chain.badgeContract;
    return this.sendMoney(sender, {
      to: treasury,
      amount,
      narration: `${merchant.name}${accountRef ? ` · ${accountRef}` : ''}`,
      idempotencyKey,
    });
  }
}
