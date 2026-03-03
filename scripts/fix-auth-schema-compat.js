const envPath = process.env.ENV_FILE || '.env.local';
require('dotenv').config({ path: envPath });
const postgres = require('postgres');

(async () => {
  if (!process.env.DATABASE_URL) {
    console.error(`[DB_FIX] DATABASE_URL is missing in ${envPath}`);
    process.exit(1);
  }

  const sql = postgres(process.env.DATABASE_URL, { prepare: false });

  try {
    // Skip verification table - already using snake_case only
    console.log('[DB_FIX] Skipping verification table (already snake_case)');

    // Session table
    await sql`ALTER TABLE "session"
      ADD COLUMN IF NOT EXISTS "expires_at" timestamp,
      ADD COLUMN IF NOT EXISTS "created_at" timestamp,
      ADD COLUMN IF NOT EXISTS "updated_at" timestamp,
      ADD COLUMN IF NOT EXISTS "ip_address" text,
      ADD COLUMN IF NOT EXISTS "user_agent" text,
      ADD COLUMN IF NOT EXISTS "user_id" text,
      ADD COLUMN IF NOT EXISTS "impersonated_by" text`;

    // Check if legacy camelCase columns exist before updating
    const sessionCols = await sql`SELECT column_name FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'session'`;
    const sessionColNames = new Set(sessionCols.map(c => c.column_name));

    if (sessionColNames.has('expiresAt')) {
      await sql`UPDATE "session"
        SET "expires_at" = COALESCE("expires_at", "expiresAt"),
            "created_at" = COALESCE("created_at", "createdAt"),
            "updated_at" = COALESCE("updated_at", "updatedAt"),
            "ip_address" = COALESCE("ip_address", "ipAddress"),
            "user_agent" = COALESCE("user_agent", "userAgent"),
            "user_id" = COALESCE("user_id", "userId")`;

      await sql.unsafe(`ALTER TABLE "session"
        ALTER COLUMN "expiresAt" DROP NOT NULL,
        ALTER COLUMN "createdAt" DROP NOT NULL,
        ALTER COLUMN "updatedAt" DROP NOT NULL,
        ALTER COLUMN "ipAddress" DROP NOT NULL,
        ALTER COLUMN "userAgent" DROP NOT NULL,
        ALTER COLUMN "userId" DROP NOT NULL`);
    }

    // Account table
    await sql`ALTER TABLE "account"
      ADD COLUMN IF NOT EXISTS "account_id" text,
      ADD COLUMN IF NOT EXISTS "provider_id" text,
      ADD COLUMN IF NOT EXISTS "user_id" text,
      ADD COLUMN IF NOT EXISTS "access_token" text,
      ADD COLUMN IF NOT EXISTS "refresh_token" text,
      ADD COLUMN IF NOT EXISTS "id_token" text,
      ADD COLUMN IF NOT EXISTS "access_token_expires_at" timestamp,
      ADD COLUMN IF NOT EXISTS "refresh_token_expires_at" timestamp,
      ADD COLUMN IF NOT EXISTS "created_at" timestamp,
      ADD COLUMN IF NOT EXISTS "updated_at" timestamp`;

    // Check if legacy camelCase columns exist before updating
    const accountCols = await sql`SELECT column_name FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'account'`;
    const accountColNames = new Set(accountCols.map(c => c.column_name));

    if (accountColNames.has('accountId')) {
      await sql`UPDATE "account"
        SET "account_id" = COALESCE("account_id", "accountId"),
            "provider_id" = COALESCE("provider_id", "providerId"),
            "user_id" = COALESCE("user_id", "userId"),
            "access_token" = COALESCE("access_token", "accessToken"),
            "refresh_token" = COALESCE("refresh_token", "refreshToken"),
            "id_token" = COALESCE("id_token", "idToken"),
            "access_token_expires_at" = COALESCE("access_token_expires_at", "accessTokenExpiresAt"),
            "refresh_token_expires_at" = COALESCE("refresh_token_expires_at", "refreshTokenExpiresAt"),
            "created_at" = COALESCE("created_at", "createdAt"),
            "updated_at" = COALESCE("updated_at", "updatedAt")`;

      await sql.unsafe(`ALTER TABLE "account"
        ALTER COLUMN "accountId" DROP NOT NULL,
        ALTER COLUMN "providerId" DROP NOT NULL,
        ALTER COLUMN "userId" DROP NOT NULL,
        ALTER COLUMN "accessToken" DROP NOT NULL,
        ALTER COLUMN "refreshToken" DROP NOT NULL,
        ALTER COLUMN "idToken" DROP NOT NULL,
        ALTER COLUMN "accessTokenExpiresAt" DROP NOT NULL,
        ALTER COLUMN "refreshTokenExpiresAt" DROP NOT NULL,
        ALTER COLUMN "createdAt" DROP NOT NULL,
        ALTER COLUMN "updatedAt" DROP NOT NULL`);
    }

    // User table
    await sql`ALTER TABLE "user"
      ADD COLUMN IF NOT EXISTS "email_verified" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "created_at" timestamp,
      ADD COLUMN IF NOT EXISTS "updated_at" timestamp,
      ADD COLUMN IF NOT EXISTS "banned" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "ban_reason" text,
      ADD COLUMN IF NOT EXISTS "ban_expires" timestamp`;

    // Check if legacy camelCase columns exist before updating
    const userCols = await sql`SELECT column_name FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'user'`;
    const userColNames = new Set(userCols.map(c => c.column_name));

    if (userColNames.has('emailVerified')) {
      await sql`UPDATE "user"
        SET "email_verified" = COALESCE("email_verified", "emailVerified", false),
            "created_at" = COALESCE("created_at", "createdAt"),
            "updated_at" = COALESCE("updated_at", "updatedAt")`;

      await sql.unsafe(`ALTER TABLE "user"
        ALTER COLUMN "emailVerified" DROP NOT NULL,
        ALTER COLUMN "createdAt" DROP NOT NULL,
        ALTER COLUMN "updatedAt" DROP NOT NULL`);
    }

    console.log('[DB_FIX] Legacy camelCase columns are preserved for compatibility.');

    console.log(`[DB_FIX] Auth schema compatibility patch applied successfully (env: ${envPath}).`);
  } catch (error) {
    console.error(`[DB_FIX] Failed to apply auth schema compatibility patch (env: ${envPath})`);
    console.error(error);
    process.exitCode = 1;
  } finally {
    await sql.end();
  }
})();
