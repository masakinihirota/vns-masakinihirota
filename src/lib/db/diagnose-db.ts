

import { config } from "dotenv";
import postgres from "postgres";
import { logger } from "@/lib/logger";

config({ path: ".env.local" });

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://vns_user@localhost:5433/vns_db";

/**
 *
 */
async function diagnose() {
  logger.info("🔍 Connection String:", { connectionString });
  const sql = postgres(connectionString);

  try {
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `;
    logger.info("Tables in public schema:", { tables: tables.map(t => t.table_name) });

    const sessionExists = tables.some(t => t.table_name === 'session');
    if (sessionExists) {
      logger.info("Details for 'session' table:");
      const columns = await sql`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'session'
      `;
      logger.debug("Session table columns:", { columns });
    } else {
      logger.warn("Table 'session' DOES NOT EXIST in public schema.");
    }

    const authSchemaTables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'auth'
    `;
    if (authSchemaTables.length > 0) {
      logger.info("Tables in auth schema:", { tables: authSchemaTables.map(t => t.table_name) });
    }

  } catch (error) {
    logger.error("❌ Database connection failed", undefined, { error });
  } finally {
    await sql.end();
  }
}

diagnose();
