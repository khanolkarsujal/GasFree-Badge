import { SubscriptionService } from '../services/SubscriptionService.js';
import { subscriptionSchema } from '../lib/validators.js';

const subs = new SubscriptionService();

export async function subscriptionRoutes(app) {
  app.get('/subscriptions', { preHandler: [app.authenticate] }, async (request) => {
    return { subscriptions: subs.list(request.user.address) };
  });

  app.post('/subscriptions', { preHandler: [app.authenticate] }, async (request) => {
    const body = subscriptionSchema.parse(request.body);
    return subs.create(request.user.address, body);
  });

  app.delete('/subscriptions/:id', { preHandler: [app.authenticate] }, async (request) => {
    return subs.cancel(request.user.address, request.params.id);
  });
}
