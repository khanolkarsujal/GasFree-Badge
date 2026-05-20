# Legacy API (deprecated)

This Fastify + SQLite backend is **superseded** by [`platform/api`](../platform/api) (NestJS + Formance + PostgreSQL).

Use the platform stack instead:

```bash
cd platform
docker compose up -d
cd api && npm install && npx prisma migrate deploy && npm run start:dev
```

Root scripts: `npm run api` → platform API. `npm run api:legacy` runs this folder only for reference.
