import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import { config } from '../config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function migrate(dbPath = config.db.path) {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const db = new Database(dbPath);
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  db.exec(schema);
  seedMerchants(db);
  db.close();
  return dbPath;
}

function seedMerchants(db) {
  const count = db.prepare('SELECT COUNT(*) AS c FROM merchants').get().c;
  if (count > 0) return;

  const insert = db.prepare(`
    INSERT INTO merchants (id, name, category, logo_url, is_active)
    VALUES (@id, @name, @category, @logo_url, 1)
  `);

  const merchants = [
    { id: 'm_recharge', name: 'Mobile Recharge', category: 'recharge', logo_url: null },
    { id: 'm_electricity', name: 'Electricity Bill', category: 'utilities', logo_url: null },
    { id: 'm_dth', name: 'DTH & Cable', category: 'entertainment', logo_url: null },
    { id: 'm_metro', name: 'Metro Card', category: 'travel', logo_url: null },
    { id: 'm_insurance', name: 'Insurance Premium', category: 'insurance', logo_url: null },
    { id: 'm_education', name: 'School Fees', category: 'education', logo_url: null },
    { id: 'm_grocery', name: 'Quick Grocery', category: 'shopping', logo_url: null },
    { id: 'm_gasfree', name: 'GasFreeBadge Store', category: 'nft', logo_url: null },
  ];

  const tx = db.transaction((rows) => {
    for (const row of rows) insert.run(row);
  });
  tx(merchants);
}

if (process.argv[1] && process.argv[1].endsWith('migrate.js')) {
  const p = migrate();
  console.log('Database migrated:', p);
}
