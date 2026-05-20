import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

function env(key, fallback) {
  const v = process.env[key];
  return v !== undefined && v !== '' ? v : fallback;
}

export const config = {
  port: Number(env('PORT', '3001')),
  host: env('HOST', '0.0.0.0'),
  nodeEnv: env('NODE_ENV', 'development'),
  apiBaseUrl: env('API_BASE_URL', 'http://localhost:3001'),
  corsOrigins: env('CORS_ORIGINS', 'http://localhost:5173').split(',').map((s) => s.trim()),
  jwtSecret: env('JWT_SECRET', 'dev-only-change-in-production'),
  siwe: {
    domain: env('SIWE_DOMAIN', 'localhost'),
    uri: env('SIWE_URI', 'http://localhost:3001'),
  },
  chain: {
    id: Number(env('CHAIN_ID', '84532')),
    rpcUrl: env('RPC_URL', 'https://sepolia.base.org'),
    tyiToken: env('TYI_TOKEN_ADDRESS', '0x9b9deeea99C2B77c0e7F7bdCf0a01a0F0843e5DD'),
    badgeContract: env('BADGE_CONTRACT_ADDRESS', '0x866d057Af43F711d7C3023fdCBFC474C4B12F187'),
    walletContract: env('WALLET_CONTRACT_ADDRESS', ''),
  },
  indexer: {
    startBlock: Number(env('INDEXER_START_BLOCK', '0')),
    pollMs: Number(env('INDEXER_POLL_MS', '12000')),
  },
  db: {
    path: env('DATABASE_PATH', path.join(__dirname, '../data/wallet.db')),
  },
  limits: {
    dailySendTyi: Number(env('DAILY_SEND_LIMIT_TYI', '10000')),
    perTxMaxTyi: Number(env('PER_TX_MAX_TYI', '5000')),
    minSendTyi: Number(env('MIN_SEND_TYI', '0.01')),
  },
};
