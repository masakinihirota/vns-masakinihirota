const postgres = require("postgres");

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@127.0.0.1:64322/postgres";

const sql = postgres(connectionString, { prepare: false });

async function fixRootAccountsV3() {
  try {
    console.log("Starting fixRootAccountsV3...");

    // 1. Drop Unique Constraint / Index
    console.log("Dropping UNIQUE constraint 'root_accounts_auth_user_id_key'...");
    try {
      await sql.unsafe(`ALTER TABLE root_accounts DROP CONSTRAINT IF EXISTS "root_accounts_auth_user_id_key"`);
      // インデックスとしても存在する可能性があるため、念のためインデックスも削除試行
      // (CONSTRAINT削除で消えているはずだが)
      await sql.unsafe(`DROP INDEX IF EXISTS "root_accounts_auth_user_id_key"`);
      console.log("UNIQUE constraint/index dropped.");
    } catch (e) {
      console.log("Note: " + e.message);
    }

    // 2. Drop existing FKs on auth_user_id
    console.log("Dropping related Foreign Keys...");
    const fks = await sql.unsafe(`
      SELECT tc.constraint_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_name = 'root_accounts'
        AND kcu.column_name = 'auth_user_id';
    `);

    for (const fk of fks) {
      console.log(`Dropping FK: ${fk.constraint_name}`);
      await sql.unsafe(`ALTER TABLE root_accounts DROP CONSTRAINT "${fk.constraint_name}"`);
    }

    // 3. Alter Column Type to text
    console.log("Altering column type to text...");
    await sql.unsafe(`ALTER TABLE root_accounts ALTER COLUMN auth_user_id TYPE text`);
    console.log("Column type altered.");

    // 4. Cleanup Orphans (Better-Auth migration strategy: remove old data)
    // 既存の root_accounts は UUID を持っているが、Better-Auth の user はまだ空か、ID が一致しない。
    // FK を張る前に不整合データを削除する必要がある。
    console.log("Deleting orphaned root_accounts...");
    const deleted = await sql.unsafe(`
      DELETE FROM root_accounts
      WHERE auth_user_id NOT IN (SELECT id FROM "user")
      RETURNING id
    `);
    console.log(`Deleted ${deleted.length} orphaned records.`);

    // 5. Add new FK to public.user(id)
    console.log("Adding new FK to public.user(id)...");
    await sql.unsafe(`
      ALTER TABLE root_accounts
      ADD CONSTRAINT root_accounts_auth_user_id_fkey
      FOREIGN KEY (auth_user_id) REFERENCES "user"(id) ON DELETE CASCADE
    `);
    console.log("New FK added.");

    // 6. Restore Unique Constraint
    console.log("Restoring UNIQUE constraint...");
    await sql.unsafe(`
      ALTER TABLE root_accounts
      ADD CONSTRAINT root_accounts_auth_user_id_key UNIQUE (auth_user_id)
    `);
    console.log("UNIQUE constraint restored.");

    console.log("All fixes completed successfully.");

  } catch (e) {
    console.error("Error:", e);
  } finally {
    await sql.end();
  }
}

fixRootAccountsV3();
