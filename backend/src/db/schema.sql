-- GasFree Wallet SaaS schema (Paytm-style passbook + ledger)

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  address       TEXT PRIMARY KEY COLLATE NOCASE,
  display_name  TEXT,
  phone_hash    TEXT,
  kyc_tier      TEXT NOT NULL DEFAULT 'basic' CHECK (kyc_tier IN ('basic', 'verified', 'premium')),
  pin_set       INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS wallet_accounts (
  address           TEXT PRIMARY KEY COLLATE NOCASE REFERENCES users(address),
  available_balance TEXT NOT NULL DEFAULT '0',
  locked_balance    TEXT NOT NULL DEFAULT '0',
  currency          TEXT NOT NULL DEFAULT 'TYI',
  on_chain_balance  TEXT,
  last_synced_at    TEXT,
  updated_at        TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS ledger_entries (
  id              TEXT PRIMARY KEY,
  txn_group_id    TEXT NOT NULL,
  account_address TEXT NOT NULL COLLATE NOCASE,
  entry_type      TEXT NOT NULL CHECK (entry_type IN ('debit', 'credit')),
  amount          TEXT NOT NULL,
  currency        TEXT NOT NULL DEFAULT 'TYI',
  balance_after   TEXT,
  category        TEXT NOT NULL,
  narration       TEXT,
  reference_id    TEXT,
  metadata_json   TEXT,
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (account_address) REFERENCES users(address)
);

CREATE INDEX IF NOT EXISTS idx_ledger_account_time ON ledger_entries(account_address, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ledger_group ON ledger_entries(txn_group_id);

CREATE TABLE IF NOT EXISTS transactions (
  id                TEXT PRIMARY KEY,
  user_address      TEXT NOT NULL COLLATE NOCASE,
  counterparty      TEXT COLLATE NOCASE,
  direction         TEXT NOT NULL CHECK (direction IN ('credit', 'debit')),
  amount            TEXT NOT NULL,
  currency          TEXT NOT NULL DEFAULT 'TYI',
  category          TEXT NOT NULL,
  status            TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'success', 'failed', 'cancelled', 'expired')),
  narration         TEXT,
  merchant_id       TEXT,
  payment_method    TEXT NOT NULL DEFAULT 'wallet',
  idempotency_key   TEXT UNIQUE,
  chain_tx_hash     TEXT,
  chain_block       INTEGER,
  reference_id      TEXT,
  metadata_json     TEXT,
  created_at        TEXT NOT NULL DEFAULT (datetime('now')),
  completed_at      TEXT,
  FOREIGN KEY (user_address) REFERENCES users(address)
);

CREATE INDEX IF NOT EXISTS idx_txn_user_time ON transactions(user_address, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_txn_status ON transactions(status);

CREATE TABLE IF NOT EXISTS payment_requests (
  id              TEXT PRIMARY KEY,
  request_code    TEXT NOT NULL UNIQUE,
  payee_address   TEXT NOT NULL COLLATE NOCASE,
  payer_address   TEXT COLLATE NOCASE,
  amount          TEXT NOT NULL,
  currency        TEXT NOT NULL DEFAULT 'TYI',
  note            TEXT,
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled', 'expired')),
  on_chain_id     TEXT,
  expires_at      TEXT NOT NULL,
  paid_at         TEXT,
  chain_tx_hash   TEXT,
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (payee_address) REFERENCES users(address)
);

CREATE INDEX IF NOT EXISTS idx_payreq_code ON payment_requests(request_code);
CREATE INDEX IF NOT EXISTS idx_payreq_payee ON payment_requests(payee_address, status);

CREATE TABLE IF NOT EXISTS payment_intents (
  id                TEXT PRIMARY KEY,
  sender_address    TEXT NOT NULL COLLATE NOCASE,
  recipient_address TEXT NOT NULL COLLATE NOCASE,
  amount            TEXT NOT NULL,
  currency          TEXT NOT NULL DEFAULT 'TYI',
  category          TEXT NOT NULL DEFAULT 'send_money',
  narration         TEXT,
  status            TEXT NOT NULL DEFAULT 'created',
  idempotency_key   TEXT UNIQUE,
  ugf_payload_json  TEXT,
  chain_tx_hash     TEXT,
  expires_at        TEXT NOT NULL,
  created_at        TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (sender_address) REFERENCES users(address)
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id              TEXT PRIMARY KEY,
  user_address    TEXT NOT NULL COLLATE NOCASE,
  merchant_id     TEXT NOT NULL,
  plan_name       TEXT NOT NULL,
  amount          TEXT NOT NULL,
  currency        TEXT NOT NULL DEFAULT 'TYI',
  interval_days   INTEGER NOT NULL DEFAULT 30,
  status          TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled')),
  next_billing_at TEXT,
  last_billed_at  TEXT,
  agent_address   TEXT COLLATE NOCASE,
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_address) REFERENCES users(address),
  FOREIGN KEY (merchant_id) REFERENCES merchants(id)
);

CREATE TABLE IF NOT EXISTS merchants (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  category      TEXT NOT NULL,
  logo_url      TEXT,
  wallet_address TEXT COLLATE NOCASE,
  is_active     INTEGER NOT NULL DEFAULT 1,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS chain_events (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  tx_hash       TEXT NOT NULL,
  log_index     INTEGER NOT NULL,
  block_number  INTEGER NOT NULL,
  event_name    TEXT NOT NULL,
  contract      TEXT NOT NULL COLLATE NOCASE,
  payload_json  TEXT NOT NULL,
  processed     INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (tx_hash, log_index)
);

CREATE TABLE IF NOT EXISTS indexer_state (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS auth_sessions (
  token         TEXT PRIMARY KEY,
  address       TEXT NOT NULL COLLATE NOCASE,
  siwe_message  TEXT,
  expires_at    TEXT NOT NULL,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (address) REFERENCES users(address)
);

CREATE TABLE IF NOT EXISTS webhooks (
  id          TEXT PRIMARY KEY,
  user_address TEXT NOT NULL COLLATE NOCASE,
  url         TEXT NOT NULL,
  secret      TEXT NOT NULL,
  events      TEXT NOT NULL,
  is_active   INTEGER NOT NULL DEFAULT 1,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS daily_limits (
  user_address  TEXT NOT NULL COLLATE NOCASE,
  day           TEXT NOT NULL,
  sent_amount   TEXT NOT NULL DEFAULT '0',
  PRIMARY KEY (user_address, day)
);
