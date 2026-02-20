const postgres = require("postgres");

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@127.0.0.1:64322/postgres";

const sql = postgres(connectionString, { prepare: false });

async function checkDeps() {
  try {
    console.log("Checking dependencies for root_accounts.auth_user_id...");

    // 1. Foreign Keys
    const fks = await sql.unsafe(`
      SELECT conname, confrelid::regclass
      FROM pg_constraint
      WHERE conrelid = 'root_accounts'::regclass
      AND (
        conkey @> ARRAY[(SELECT attnum FROM pg_attribute WHERE attrelid = 'root_accounts'::regclass AND attname = 'auth_user_id')]
        OR
        confkey @> ARRAY[(SELECT attnum FROM pg_attribute WHERE attrelid = 'root_accounts'::regclass AND attname = 'auth_user_id')]
      )
    `);
    console.log("Foreign Keys:", fks);

    // 2. Views
    const views = await sql.unsafe(`
      SELECT distinct dependent_ns.nspname as dependent_schema,
             dependent_view.relname as dependent_view,
             source_ns.nspname as source_schema,
             source_table.relname as source_table,
             pg_attribute.attname as column_name
      FROM pg_depend
      JOIN pg_rewrite ON pg_depend.objid = pg_rewrite.oid
      JOIN pg_class as dependent_view ON pg_rewrite.ev_class = dependent_view.oid
      JOIN pg_class as source_table ON pg_depend.refobjid = source_table.oid
      JOIN pg_attribute ON pg_depend.refobjid = pg_attribute.attrelid
          AND pg_depend.refobjsubid = pg_attribute.attnum
      JOIN pg_namespace dependent_ns ON dependent_view.relnamespace = dependent_ns.oid
      JOIN pg_namespace source_ns ON source_table.relnamespace = source_ns.oid
      WHERE source_ns.nspname = 'public'
        AND source_table.relname = 'root_accounts'
        AND pg_attribute.attname = 'auth_user_id'
    `);
    console.log("Views depends on column:", views);

    // 3. Indexes (including unique constraints)
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
    console.log("Indexes/Constraints:", indexes);
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await sql.end();
  }
}

checkDeps();
