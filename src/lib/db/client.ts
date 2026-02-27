/**
 * Drizzle ORM Database Client
 * PostgreSQL connection
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema.postgres';

/**
 * Drizzle ORM Database Client
 * PostgreSQL connection
 */

const databaseUrl =
  process.env.DATABASE_URL ||
  "postgresql://vns_user@localhost:5433/vns_db";

// Create Drizzle instance using lazy client initialization to avoid build-time errors
export const db = drizzle(
  postgres(databaseUrl, {
    prepare: false,
    onnotice: () => {}, // Suppress notices
  }),
  { schema, logger: false }
);

export type DB = typeof db;
