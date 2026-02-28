require('dotenv').config({ path: '.env.local' });
const postgres = require('postgres');

(async () => {
  const sql = postgres(process.env.DATABASE_URL, { prepare: false });

  try {
    await sql`ALTER TABLE "verification"
      ADD COLUMN IF NOT EXISTS "expires_at" timestamp,
      ADD COLUMN IF NOT EXISTS "created_at" timestamp,
      ADD COLUMN IF NOT EXISTS "updated_at" timestamp`;

    await sql`UPDATE "verification"
      SET "expires_at" = COALESCE("expires_at", "expiresAt"),
          "created_at" = COALESCE("created_at", "createdAt"),
          "updated_at" = COALESCE("updated_at", "updatedAt")`;

    await sql`ALTER TABLE "session"
      ADD COLUMN IF NOT EXISTS "expires_at" timestamp,
      ADD COLUMN IF NOT EXISTS "created_at" timestamp,
      ADD COLUMN IF NOT EXISTS "updated_at" timestamp,
      ADD COLUMN IF NOT EXISTS "ip_address" text,
      ADD COLUMN IF NOT EXISTS "user_agent" text,
      ADD COLUMN IF NOT EXISTS "user_id" text,
      ADD COLUMN IF NOT EXISTS "impersonated_by" text`;

    await sql`UPDATE "session"
      SET "expires_at" = COALESCE("expires_at", "expiresAt"),
          "created_at" = COALESCE("created_at", "createdAt"),
          "updated_at" = COALESCE("updated_at", "updatedAt"),
          "ip_address" = COALESCE("ip_address", "ipAddress"),
          "user_agent" = COALESCE("user_agent", "userAgent"),
          "user_id" = COALESCE("user_id", "userId")`;

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

    await sql`ALTER TABLE "user"
      ADD COLUMN IF NOT EXISTS "email_verified" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "created_at" timestamp,
      ADD COLUMN IF NOT EXISTS "updated_at" timestamp,
      ADD COLUMN IF NOT EXISTS "banned" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "ban_reason" text,
      ADD COLUMN IF NOT EXISTS "ban_expires" timestamp`;

    await sql`UPDATE "user"
      SET "email_verified" = COALESCE("email_verified", "emailVerified", false),
          "created_at" = COALESCE("created_at", "createdAt"),
          "updated_at" = COALESCE("updated_at", "updatedAt")`;

    console.log('Auth schema compatibility patch applied successfully.');
  } catch (error) {
    console.error('Failed to apply auth schema compatibility patch');
    console.error(error);
    process.exitCode = 1;
  } finally {
    await sql.end();
  }
})();
