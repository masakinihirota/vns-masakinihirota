const postgres = require("postgres");

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@127.0.0.1:64322/postgres";

const sql = postgres(connectionString, { prepare: false });

async function checkTables() {
  try {
    // public スキーマのテーブル一覧
    const tables = await sql.unsafe(`
      SELECT table_schema, table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    console.log("=== public スキーマのテーブル一覧 ===");
    tables.forEach((t) => console.log(`  ${t.table_schema}.${t.table_name}`));

    // user テーブルが存在するか確認（全スキーマ）
    const userTables = await sql.unsafe(`
      SELECT table_schema, table_name
      FROM information_schema.tables
      WHERE table_name IN ('user', 'users', 'session', 'account', 'verification')
      ORDER BY table_schema, table_name;
    `);
    console.log("\n=== Better-Auth 関連テーブル ===");
    userTables.forEach((t) =>
      console.log(`  ${t.table_schema}.${t.table_name}`)
    );
  } catch (e) {
    console.error("Error:", e.message);
  } finally {
    await sql.end();
  }
}

checkTables();
