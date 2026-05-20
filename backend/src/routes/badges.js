import { BadgeService } from '../services/BadgeService.js';
import { AppError } from '../lib/errors.js';

const badges = new BadgeService();

export async function badgeRoutes(app) {
  app.get('/badges/catalog', async () => {
    const catalog = badges.getCatalog();
    return { badges: catalog };
  });

  app.get('/badges/mine', { preHandler: [app.authenticate] }, async (request) => {
    const claimed = badges.getUserBadgesFromIndexer(request.user.address);
    return { claimed };
  });

  app.post('/badges/claim/prepare', { preHandler: [app.authenticate] }, async (request) => {
    const { badgeId } = request.body || {};
    if (!badgeId) throw new AppError('badgeId required', 400);
    return badges.prepareClaim(request.user.address, badgeId);
  });
}
