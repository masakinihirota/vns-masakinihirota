const postgres = require("postgres");
const fs = require("fs");

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@127.0.0.1:64322/postgres";

const sql = postgres(connectionString, { prepare: false });

async function checkDepsLog() {
  const logFile = "deps.log";
  const log = (msg) => {
    console.log(msg);
    fs.appendFileSync(logFile, msg + "\n");
  };

  try {
    fs.writeFileSync(logFile, "Checking dependencies...\n");

    // 1. FKs on auth_user_id (referenced by this column)
    log("\n--- FKs on root_accounts.auth_user_id ---");
    const fks = await sql.unsafe(`
      SELECT conname, confrelid::regclass
      FROM pg_constraint
      WHERE conrelid = 'root_accounts'::regclass
      AND conkey @> ARRAY[(SELECT attnum FROM pg_attribute WHERE attrelid = 'root_accounts'::regclass AND attname = 'auth_user_id')]
    `);
    log(JSON.stringify(fks, null, 2));

    // 2. FKs REFERENCING auth_user_id (other tables depend on this column)
    log("\n--- FKs REFERENCING root_accounts.auth_user_id ---");
    const refFks = await sql.unsafe(`
      SELECT conname, conrelid::regclass
      FROM pg_constraint
      WHERE confrelid = 'root_accounts'::regclass
      AND confkey @> ARRAY[(SELECT attnum FROM pg_attribute WHERE attrelid = 'root_accounts'::regclass AND attname = 'auth_user_id')]
    `);
    log(JSON.stringify(refFks, null, 2));

    // 3. Indexes
    log("\n--- Indexes/Constraints ---");
    const indexes = await sql.unsafe(`
        SELECT
            i.relname as index_name,
            ix.indisunique as is_unique,
            ix.indisprimary as is_primary
        FROM
            pg_class t,
            pg_class i,
            pg_index ix,
            pg_attribute a
        WHERE
            t.oid = ix.indrelid
            AND i.oid = ix.indexrelid
            AND a.attrelid = t.oid
            AND a.attnum = ANY(ix.indkey)
            AND t.relkind = 'r'
            AND t.relname = 'root_accounts'
            AND a.attname = 'auth_user_id';
    `);
    log(JSON.stringify(indexes, null, 2));
  } catch (e) {
    log("Error: " + e.message);
  } finally {
    await sql.end();
  }
}

checkDepsLog();
