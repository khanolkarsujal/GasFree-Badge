# GasFree Platform v2 — Production Payments Stack

PayPal/Stripe-grade backend built from **proven open-source production systems**, not custom reinvented logic.

## Architecture (copied from industry leaders)

| Layer | Technology | Source / standard |
|-------|------------|-------------------|
| **Financial ledger** | [Formance Ledger](https://github.com/formancehq/ledger) v2.4 | Double-entry, atomic postings, idempotent transactions |
| **API** | [NestJS](https://nestjs.com) 10 | Enterprise Node framework (wallet-system, Paymnts patterns) |
| **ORM** | [Prisma](https://prisma.io) + PostgreSQL 16 | Production metadata store |
| **Cache** | Redis 7 | Sessions, rate limits |
| **Auth** | [SIWE](https://login.xyz) (EIP-4361) + JWT | Web3 industry standard |
| **API design** | Stripe-compatible resources | `payment_intents`, `transfers`, `balance`, `payouts` |
| **On-chain** | `TyiWallet.sol` + UGF | Base Sepolia settlement |

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│   Clients   │────▶│  NestJS API :3001 │────▶│  Formance Ledger    │
│  (future)   │     │  /v1/*  Stripe-ish│     │  :3068  PostgreSQL  │
└─────────────┘     └────────┬─────────┘     └─────────────────────┘
                             │
                    ┌────────▼─────────┐
                    │ App PostgreSQL   │
                    │ Prisma metadata  │
                    └──────────────────┘
```

## Quick start

```bash
cd platform
cp .env.example .env
docker compose up -d
```

Wait ~30s for Formance ledger boot, then:

```bash
cd api
npm install
npx prisma migrate deploy
npm run start:dev
```

- **API:** http://localhost:3001/v1/health  
- **OpenAPI:** http://localhost:3001/docs  
- **Formance Ledger:** http://localhost:3068  

## API flow (PayPal-like)

### 1. Sign in (SIWE)
```http
POST /v1/auth/nonce
{ "address": "0x..." }

POST /v1/auth/verify
{ "message": "...", "signature": "0x..." }
→ { "access_token": "..." }
```

### 2. Add money
```http
POST /v1/balance/topup
Authorization: Bearer <token>
{ "amount": "100.00" }
```

### 3. Send money (P2P)
```http
POST /v1/transfers
Idempotency-Key: unique-key-123
{ "amount": "25.00", "destination": "0xRecipient...", "description": "Rent" }
```

### 4. Pay merchant (PaymentIntent)
```http
POST /v1/payment_intents
{ "amount": "9.99", "description": "Premium plan" }

POST /v1/payment_intents/:id/confirm
```

### 5. Withdraw
```http
POST /v1/payouts
{ "amount": "50.00" }
```

## References

- Formance Ledger standalone: https://github.com/formancehq/ledger/tree/main/examples/standalone  
- Formance API: https://docs.formance.com/api-reference/ledgerv2  
- Stripe Payment Intents: https://docs.stripe.com/api/payment_intents  
- NestJS wallet-system: https://github.com/sheygs/wallet-system  
- Hyperswitch (payments switch): https://github.com/juspay/hyperswitch  

## Legacy API

The v1 Fastify API in `/backend` is superseded by this platform. Use **platform/** for all new integrations.
