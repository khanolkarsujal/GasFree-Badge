import crypto from 'crypto';
import { SiweMessage } from 'siwe';
import { getDb } from '../db/index.js';
import { config } from '../config.js';
import { AppError } from '../lib/errors.js';
import { generateSessionToken, hashToken } from '../lib/crypto.js';
import { UserService } from './UserService.js';

const SESSION_HOURS = 24;

export class AuthService {
  constructor() {
    this.users = new UserService();
  }

  createNonce(address) {
    const nonce = cryptoRandom();
    const db = getDb();
    db.prepare(`
      INSERT OR REPLACE INTO indexer_state (key, value) VALUES (?, ?)
    `).run(`siwe_nonce:${address.toLowerCase()}`, nonce);
    return nonce;
  }

  getNonce(address) {
    const db = getDb();
    const row = db.prepare('SELECT value FROM indexer_state WHERE key = ?')
      .get(`siwe_nonce:${address.toLowerCase()}`);
    return row?.value;
  }

  async verifySiwe({ message, signature }) {
    let fields;
    try {
      const siwe = new SiweMessage(message);
      fields = await siwe.verify({ signature });
    } catch (e) {
      throw new AppError('Invalid SIWE signature', 401, 'AUTH_FAILED');
    }

    const address = fields.data.address.toLowerCase();
    const expectedNonce = this.getNonce(address);
    if (!expectedNonce || fields.data.nonce !== expectedNonce) {
      throw new AppError('Invalid or expired nonce', 401, 'AUTH_FAILED');
    }

    if (fields.data.chainId !== config.chain.id) {
      throw new AppError('Wrong network in SIWE message', 401, 'WRONG_CHAIN');
    }

    this.users.ensureUser(address);

    const token = generateSessionToken();
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + SESSION_HOURS * 3600_000).toISOString();

    const db = getDb();
    db.prepare(`
      INSERT INTO auth_sessions (token, address, siwe_message, expires_at)
      VALUES (?, ?, ?, ?)
    `).run(tokenHash, address, message, expiresAt);

    db.prepare('DELETE FROM indexer_state WHERE key = ?').run(`siwe_nonce:${address}`);

    return {
      accessToken: token,
      tokenType: 'Bearer',
      expiresAt,
      address,
    };
  }

  resolveSession(bearerToken) {
    if (!bearerToken) return null;
    const tokenHash = hashToken(bearerToken);
    const db = getDb();
    const row = db.prepare(`
      SELECT address, expires_at FROM auth_sessions WHERE token = ?
    `).get(tokenHash);

    if (!row) return null;
    if (new Date(row.expires_at) < new Date()) {
      db.prepare('DELETE FROM auth_sessions WHERE token = ?').run(tokenHash);
      return null;
    }
    return row.address;
  }

  logout(bearerToken) {
    const db = getDb();
    db.prepare('DELETE FROM auth_sessions WHERE token = ?').run(hashToken(bearerToken));
  }

  buildMessage(address, nonce) {
    return new SiweMessage({
      domain: config.siwe.domain,
      address,
      statement: 'Sign in to GasFree Wallet — secure access to your passbook and payments.',
      uri: config.siwe.uri,
      version: '1',
      chainId: config.chain.id,
      nonce,
    }).prepareMessage();
  }
}

function cryptoRandom() {
  return crypto.randomBytes(16).toString('hex');
}
