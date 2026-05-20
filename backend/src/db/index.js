import Database from 'better-sqlite3';
import { config } from '../config.js';
import { migrate } from './migrate.js';

let db;

export function getDb() {
  if (!db) {
    migrate(config.db.path);
    db = new Database(config.db.path);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}
