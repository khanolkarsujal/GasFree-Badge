import crypto from 'crypto';
import { config } from '../config.js';

export function hashToken(token) {
  return crypto.createHmac('sha256', config.jwtSecret).update(token).digest('hex');
}

export function generateSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}

export function generateRequestCode() {
  const n = crypto.randomInt(0, 1_000_000_000);
  return `GF${String(n).padStart(9, '0')}`;
}

export function toBytes32Reference(id) {
  return crypto.createHash('sha256').update(String(id)).digest('hex');
}
