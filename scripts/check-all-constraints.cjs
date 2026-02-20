const postgres = require("postgres");
const fs = require("fs");

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@127.0.0.1:64322/postgres";

const sql = postgres(connectionString, { prepare: false });

async function checkAllConstraints() {
  const logFile = "all-constraints.log";
  const log = (msg) => {
    console.log(msg);
    fs.appendFileSync(logFile, msg + "\n");
  };

  try {
    fs.writeFileSync(logFile, "Checking ALL constraints related to root_accounts...\n");

    // 1. Constraints ON root_accounts
    log("\n--- Constraints ON root_accounts (conrelid) ---");
    const onCon = await sql.unsafe(`
      SELECT conname, contype, pg_get_constraintdef(oid) as def
      FROM pg_constraint
      WHERE conrelid = 'root_accounts'::regclass;
    `);
    onCon.forEach(c => log(`${c.conname} (${c.contype}): ${c.def}`));

    // 2. Constraints REFERENCING root_accounts
    log("\n--- Constraints REFERENCING root_accounts (confrelid) ---");
    const refCon = await sql.unsafe(`
      SELECT conname, contype, conrelid::regclass as source_table, pg_get_constraintdef(oid) as def
      FROM pg_constraint
      WHERE confrelid = 'root_accounts'::regclass;
    `);
    refCon.forEach(c => log(`${c.source_table} -> ${c.conname} (${c.contype}): ${c.def}`));

    // 3. Dependencies in pg_depend (for views etc)
    log("\n--- Dependencies in pg_depend ---");
    const deps = await sql.unsafe(`
      SELECT
        dependent_ns.nspname as dependent_schema,
        dependent_view.relname as dependent_object,
        node_tree.classid::regclass as dep_type
      FROM pg_depend
      JOIN pg_rewrite ON pg_depend.objid = pg_rewrite.oid
      JOIN pg_class as dependent_view ON pg_rewrite.ev_class = dependent_view.oid
      JOIN pg_class as source_table ON pg_depend.refobjid = source_table.oid
      JOIN pg_namespace dependent_ns ON dependent_view.relnamespace = dependent_ns.oid
      CROSS JOIN pg_class as node_tree
      WHERE source_table.relname = 'root_accounts';
    `);
    // pg_depend check is tricky, simplified version
    deps.forEach(d => log(`${d.dependent_schema}.${d.dependent_object}`));

  } catch (e) {
    log("Error: " + e.message);
  } finally {
    await sql.end();
  }
}

checkAllConstraints();
