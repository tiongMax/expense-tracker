import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set. Copy .env.example to .env.local.');
}

const globalForDb = globalThis as unknown as { postgresPool?: Pool };

const pool = globalForDb.postgresPool ?? new Pool({
  connectionString,
  max: 5,
  idleTimeoutMillis: 30_000,
});

if (process.env.NODE_ENV !== 'production') globalForDb.postgresPool = pool;

export const db = drizzle(pool, { schema });
