import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { config } from './config.js';
import { authenticate } from './middleware/authenticate.js';
import { AppError } from './lib/errors.js';
import { authRoutes } from './routes/auth.js';
import { walletRoutes } from './routes/wallet.js';
import { paymentRoutes } from './routes/payments.js';
import { merchantRoutes } from './routes/merchants.js';
import { badgeRoutes } from './routes/badges.js';
import { subscriptionRoutes } from './routes/subscriptions.js';
import { webhookRoutes } from './routes/webhooks.js';
import { healthRoutes } from './routes/health.js';

export async function buildApp() {
  const app = Fastify({
    logger: config.nodeEnv !== 'test',
    trustProxy: true,
  });

  await app.register(cors, {
    origin: config.corsOrigins,
    credentials: true,
  });

  await app.register(helmet, { global: true });

  await app.register(rateLimit, {
    max: 120,
    timeWindow: '1 minute',
  });

  app.decorate('authenticate', authenticate);

  app.setErrorHandler((error, request, reply) => {
    if (error instanceof AppError) {
      return reply.code(error.statusCode).send({
        error: error.message,
        code: error.code,
      });
    }
    if (error?.name === 'ZodError') {
      return reply.code(400).send({
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: error.errors,
      });
    }
    request.log.error(error);
    return reply.code(500).send({
      error: config.nodeEnv === 'production' ? 'Internal server error' : error.message,
      code: 'INTERNAL_ERROR',
    });
  });

  await app.register(async (api) => {
    await healthRoutes(api);
    await authRoutes(api);
    await walletRoutes(api);
    await paymentRoutes(api);
    await merchantRoutes(api);
    await badgeRoutes(api);
    await subscriptionRoutes(api);
    await webhookRoutes(api);
  }, { prefix: '/api/v1' });

  return app;
}
