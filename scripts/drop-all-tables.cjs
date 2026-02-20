const postgres = require("postgres");

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@127.0.0.1:64322/postgres";

const sql = postgres(connectionString, { prepare: false });

async function dropAllTables() {
  try {
    console.log("Dropping ALL tables in public schema (CASCADE)...");

    // Get all tables in public schema
    const tables = await sql.unsafe(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
    `);

    for (const t of tables) {
      console.log(`Dropping table: ${t.tablename}`);
      await sql.unsafe(`DROP TABLE IF EXISTS "public"."${t.tablename}" CASCADE`);
    }

    console.log("All tables dropped.");
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await sql.end();
  }
}

dropAllTables();
