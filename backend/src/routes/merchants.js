import { getDb } from '../db/index.js';

export async function merchantRoutes(app) {
  app.get('/merchants', async (request) => {
    const db = getDb();
    const { category } = request.query;
    if (category) {
      return db.prepare(`
        SELECT id, name, category, logo_url, is_active FROM merchants
        WHERE is_active = 1 AND category = ? ORDER BY name
      `).all(category);
    }
    return db.prepare(`
      SELECT id, name, category, logo_url, is_active FROM merchants
      WHERE is_active = 1 ORDER BY category, name
    `).all();
  });

  app.get('/merchants/categories', async () => {
    const db = getDb();
    const rows = db.prepare(`
      SELECT category, COUNT(*) AS count FROM merchants WHERE is_active = 1 GROUP BY category
    `).all();
    return rows;
  });
}
