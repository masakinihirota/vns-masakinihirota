const postgres = require("postgres");

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@127.0.0.1:64322/postgres";

const sql = postgres(connectionString, { prepare: false });

async function simpleAlter() {
  try {
    console.log("Checking current type...");
    const cols = await sql.unsafe(`
        SELECT data_type
        FROM information_schema.columns
        WHERE table_name = 'root_accounts' AND column_name = 'auth_user_id';
    `);
    console.log(`Current type: ${cols[0]?.data_type}`);

    if (cols[0]?.data_type === 'uuid') {
      console.log("Executing ALTER COLUMN...");
      await sql.unsafe(`ALTER TABLE root_accounts ALTER COLUMN auth_user_id TYPE text`);
      console.log("Success: Column altered to text.");
    } else {
      console.log("Already text (or other type).");
    }

  } catch (e) {
    console.error("Error:", e);
  } finally {
    await sql.end();
  }
}

simpleAlter();
