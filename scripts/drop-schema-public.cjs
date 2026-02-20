const postgres = require("postgres");

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@127.0.0.1:64322/postgres";

const sql = postgres(connectionString, { prepare: false });

async function dropSchemaPublic() {
  try {
    console.log("Dropping SCHEMA public (CASCADE)...");
    await sql.unsafe(`DROP SCHEMA IF EXISTS public CASCADE`);
    console.log("Schema public dropped.");

    console.log("Creating SCHEMA public...");
    await sql.unsafe(`CREATE SCHEMA public`);
    console.log("Schema public created.");

    // Grant permissions (optional but good for local dev)
    await sql.unsafe(`GRANT ALL ON SCHEMA public TO postgres`);
    await sql.unsafe(`GRANT ALL ON SCHEMA public TO public`);
    console.log("Permissions granted.");

  } catch (e) {
    console.error("Error:", e);
  } finally {
    await sql.end();
  }
}

dropSchemaPublic();
