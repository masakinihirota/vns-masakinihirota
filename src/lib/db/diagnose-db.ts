 

import { config } from "dotenv";
import postgres from "postgres";
config({ path: ".env.local" });

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://vns_user@localhost:5433/vns_db";

/**
 *
 */
async function diagnose() {
  console.log("🔍 Connection String:", connectionString);
  const sql = postgres(connectionString);

  try {
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `;
    console.log("Tables in public schema:", tables.map(t => t.table_name));

    const sessionExists = tables.some(t => t.table_name === 'session');
    if (sessionExists) {
      console.log("Details for 'session' table:");
      const columns = await sql`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'session'
      `;
      console.log(columns);
    } else {
      console.log("Table 'session' DOES NOT EXIST in public schema.");
    }

    const authSchemaTables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'auth'
    `;
    if (authSchemaTables.length > 0) {
      console.log("Tables in auth schema:", authSchemaTables.map(t => t.table_name));
    }

  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error(error);
  } finally {
    await sql.end();
  }
}

diagnose();
