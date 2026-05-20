const nodeEnv = process.env.NODE_ENV || 'development';
const jwtSecret = process.env.JWT_SECRET || 'dev-only-change-me';

if (nodeEnv === 'production' && jwtSecret === 'dev-only-change-me') {
  throw new Error('JWT_SECRET must be set in production');
}

export default () => ({
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv,
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3001',
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173')
    .split(',')
    .map((s) => s.trim()),
  topupSecret: process.env.TOPUP_SECRET || '',
  allowDevTopup: process.env.ALLOW_DEV_TOPUP === 'true' || nodeEnv !== 'production',
  jwt: {
    secret: jwtSecret,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  siwe: {
    domain: process.env.SIWE_DOMAIN || 'localhost',
    uri: process.env.SIWE_URI || 'http://localhost:3001',
  },
  formance: {
    url: process.env.FORMANCE_LEDGER_URL || 'http://localhost:3068',
    ledgerName: process.env.FORMANCE_LEDGER_NAME || 'gasfree',
    asset: process.env.FORMANCE_ASSET || 'TYI/18',
    worldAccount: 'world',
  },
  chain: {
    id: parseInt(process.env.CHAIN_ID || '84532', 10),
    rpcUrl: process.env.RPC_URL || 'https://sepolia.base.org',
    tyiToken: process.env.TYI_TOKEN_ADDRESS,
    badgeContract: process.env.BADGE_CONTRACT_ADDRESS,
    walletContract: process.env.WALLET_CONTRACT_ADDRESS,
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
});
