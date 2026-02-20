const postgres = require("postgres");

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@127.0.0.1:64322/postgres";

const sql = postgres(connectionString, { prepare: false });

async function fixRootAccounts() {
  try {
    console.log("Starting fixRootAccounts...");

    // 1. Check current column type
    const columns = await sql.unsafe(`
      SELECT data_type
      FROM information_schema.columns
      WHERE table_name = 'root_accounts' AND column_name = 'auth_user_id';
    `);

    if (columns.length === 0) {
      console.log("Column auth_user_id not found in root_accounts.");
      return;
    }

    const currentType = columns[0].data_type;
    console.log(`Current auth_user_id type: ${currentType}`);

    // 2. Drop existing FKs on auth_user_id
    // get constraint names
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

    // 3. Alter Column Type to text if needed
    if (currentType !== 'text' && currentType !== 'character varying') {
      console.log("Altering column type to text...");
      // UUID -> Text conversion is safe
      await sql.unsafe(`ALTER TABLE root_accounts ALTER COLUMN auth_user_id TYPE text`);
    } else {
      console.log("Column type is already text-compatible.");
    }

    // 4. Add new FK to public.user(id)
    console.log("Adding new FK to public.user(id)...");
    try {
      await sql.unsafe(`
        ALTER TABLE root_accounts
        ADD CONSTRAINT root_accounts_auth_user_id_fkey
        FOREIGN KEY (auth_user_id) REFERENCES "user"(id) ON DELETE CASCADE
      `);
      console.log("New FK added successfully.");
    } catch (e) {
      if (e.code === '23503') { // foreign_key_violation
        console.error("FK Violation detected! There are auth_user_ids in root_accounts that do not exist in public.user.");
        console.log("Deleting orphaned records from root_accounts (and cascading)...");
        // Remove orphans
        await sql.unsafe(`
          DELETE FROM root_accounts
          WHERE auth_user_id NOT IN (SELECT id FROM "user")
        `);
        console.log("Orphans deleted. Retrying FK addition...");
        await sql.unsafe(`
          ALTER TABLE root_accounts
          ADD CONSTRAINT root_accounts_auth_user_id_fkey
          FOREIGN KEY (auth_user_id) REFERENCES "user"(id) ON DELETE CASCADE
        `);
        console.log("New FK added successfully after cleanup.");
      } else {
        throw e;
      }
    }

    console.log("Fix completed.");

  } catch (e) {
    console.error("Error:", e);
  } finally {
    await sql.end();
  }
}

fixRootAccounts();
