import { buildApp } from './app.js';
import { config } from './config.js';
import { migrate } from './db/migrate.js';
import { ChainIndexer } from './services/ChainIndexer.js';

async function main() {
  migrate(config.db.path);
  console.log('[db] ready at', config.db.path);

  const app = await buildApp();
  const indexer = new ChainIndexer();

  if (config.chain.badgeContract) {
    indexer.start();
    console.log('[indexer] syncing Base Sepolia events');
  }

  const shutdown = async () => {
    indexer.stop();
    await app.close();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  await app.listen({ port: config.port, host: config.host });
  console.log(`[api] GasFree Wallet API → ${config.apiBaseUrl}/api/v1`);
  console.log(`[api] Health check      → ${config.apiBaseUrl}/api/v1/health`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
