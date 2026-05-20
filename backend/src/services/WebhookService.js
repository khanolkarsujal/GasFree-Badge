import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { getDb } from '../db/index.js';

export class WebhookService {
  register(address, { url, events }) {
    const db = getDb();
    const id = uuidv4();
    const secret = crypto.randomBytes(24).toString('hex');
    db.prepare(`
      INSERT INTO webhooks (id, user_address, url, secret, events)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, address.toLowerCase(), url, secret, JSON.stringify(events));
    return { id, secret, url, events };
  }

  list(address) {
    const db = getDb();
    return db.prepare(`
      SELECT id, url, events, is_active, created_at FROM webhooks WHERE user_address = ?
    `).all(address.toLowerCase());
  }

  async dispatch(address, event, payload) {
    const db = getDb();
    const hooks = db.prepare(`
      SELECT id, url, secret, events FROM webhooks
      WHERE user_address = ? AND is_active = 1
    `).all(address.toLowerCase());

    for (const hook of hooks) {
      const allowed = JSON.parse(hook.events);
      if (!allowed.includes(event) && !allowed.includes('*')) continue;

      const body = JSON.stringify({ event, payload, timestamp: new Date().toISOString() });
      const sig = crypto.createHmac('sha256', hook.secret).update(body).digest('hex');

      fetch(hook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-GasFree-Signature': sig,
          'X-GasFree-Event': event,
        },
        body,
      }).catch(() => {});
    }
  }
}
