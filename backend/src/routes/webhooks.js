import { WebhookService } from '../services/WebhookService.js';
import { webhookSchema } from '../lib/validators.js';

const webhooks = new WebhookService();

export async function webhookRoutes(app) {
  app.get('/webhooks', { preHandler: [app.authenticate] }, async (request) => {
    return { webhooks: webhooks.list(request.user.address) };
  });

  app.post('/webhooks', { preHandler: [app.authenticate] }, async (request) => {
    const body = webhookSchema.parse(request.body);
    return webhooks.register(request.user.address, body);
  });
}
