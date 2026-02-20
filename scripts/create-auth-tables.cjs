const postgres = require("postgres");

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@127.0.0.1:64322/postgres";

const sql = postgres(connectionString, { prepare: false });

async function createTables() {
  try {
    // 1. user テーブル
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS "user" (
        "id" text PRIMARY KEY,
        "name" text NOT NULL,
        "email" text NOT NULL UNIQUE,
        "emailVerified" boolean NOT NULL DEFAULT false,
        "image" text,
        "is_anonymous" boolean DEFAULT false,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now()
      );
    `);
    console.log("[OK] user テーブル作成完了");

    // 2. session テーブル
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS "session" (
        "id" text PRIMARY KEY,
        "expiresAt" timestamp NOT NULL,
        "token" text NOT NULL UNIQUE,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now(),
        "ipAddress" text,
        "userAgent" text,
        "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
      );
    `);
    console.log("[OK] session テーブル作成完了");

    // 3. account テーブル
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS "account" (
        "id" text PRIMARY KEY,
        "accountId" text NOT NULL,
        "providerId" text NOT NULL,
        "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "accessToken" text,
        "refreshToken" text,
        "idToken" text,
        "accessTokenExpiresAt" timestamp,
        "refreshTokenExpiresAt" timestamp,
        "scope" text,
        "password" text,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now()
      );
    `);
    console.log("[OK] account テーブル作成完了");

    // 4. verification テーブル
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS "verification" (
        "id" text PRIMARY KEY,
        "identifier" text NOT NULL,
        "value" text NOT NULL,
        "expiresAt" timestamp NOT NULL,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now()
      );
    `);
    console.log("[OK] verification テーブル作成完了");

    // 確認
    const tables = await sql.unsafe(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('user', 'session', 'account', 'verification')
      ORDER BY table_name;
    `);
    console.log("\n=== 作成されたテーブル ===");
    tables.forEach((t) => console.log(`  public.${t.table_name}`));
  } catch (e) {
    console.error("Error:", e.message);
  } finally {
    await sql.end();
  }
}

createTables();
