import { config } from '../config.js';
import { getDb } from '../db/index.js';

export async function healthRoutes(app) {
  app.get('/health', async () => {
    const db = getDb();
    const users = db.prepare('SELECT COUNT(*) AS c FROM users').get().c;
    return {
      status: 'ok',
      service: 'gasfree-wallet-api',
      version: '1.0.0',
      environment: config.nodeEnv,
      chainId: config.chain.id,
      registeredUsers: users,
    };
  });
}
