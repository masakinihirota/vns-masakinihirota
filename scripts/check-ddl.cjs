const postgres = require("postgres");
const fs = require("fs");

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@127.0.0.1:64322/postgres";

const sql = postgres(connectionString, { prepare: false });

async function checkDDL() {
  const logFile = "ddl.log";
  const log = (msg) => {
    console.log(msg);
    fs.appendFileSync(logFile, msg + "\n");
  };

  try {
    fs.writeFileSync(logFile, "Checking DDL...\n");

    // 1. Columns
    log("\n--- Columns ---");
    const cols = await sql.unsafe(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'root_accounts';
    `);
    cols.forEach((c) => log(`${c.column_name}: ${c.data_type}`));

    // 2. Indexes
    log("\n--- Indexes ---");
    const indexes = await sql.unsafe(`
        SELECT indexname, indexdef
        FROM pg_indexes
        WHERE tablename = 'root_accounts';
    `);
    indexes.forEach((i) => log(`${i.indexname}: ${i.indexdef}`));

    // 3. Constraints
    log("\n--- Constraints ---");
    const constraints = await sql.unsafe(`
        SELECT conname, pg_get_constraintdef(oid) as def
        FROM pg_constraint
        WHERE conrelid = 'root_accounts'::regclass;
    `);
    constraints.forEach((c) => log(`${c.conname}: ${c.def}`));
  } catch (e) {
    log("Error: " + e.message);
  } finally {
    await sql.end();
  }
}

checkDDL();
