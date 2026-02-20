const postgres = require("postgres");

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@127.0.0.1:64322/postgres";

const sql = postgres(connectionString, { prepare: false });

async function recreateRootAccounts() {
  try {
    console.log("Dropping root_accounts table (CASCADE)...");
    await sql.unsafe(`DROP TABLE IF EXISTS "root_accounts" CASCADE`);
    console.log("Dropped root_accounts and dependents.");
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await sql.end();
  }
}

recreateRootAccounts();
