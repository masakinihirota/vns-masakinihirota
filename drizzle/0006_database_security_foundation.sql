-- Database security foundation migration
-- - add missing security tables
-- - enforce profile relation integrity
-- - normalize timestamp columns to timestamptz
-- - enable RLS for newly added tables

CREATE TABLE IF NOT EXISTS "user_preferences" (
  "user_id" text PRIMARY KEY NOT NULL,
  "ads_enabled" boolean DEFAULT true NOT NULL,
  "locale" text DEFAULT 'ja' NOT NULL,
  "theme" text DEFAULT 'system' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "user_preferences_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_user_preferences_locale"
  ON "user_preferences" USING btree ("locale");

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session_tokens" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" text NOT NULL,
  "session_id" text,
  "token_hash" text NOT NULL,
  "issued_at" timestamp with time zone DEFAULT now() NOT NULL,
  "expires_at" timestamp with time zone NOT NULL,
  "revoked_at" timestamp with time zone,
  "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "session_tokens_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade,
  CONSTRAINT "session_tokens_session_id_fkey"
    FOREIGN KEY ("session_id") REFERENCES "public"."session"("id") ON DELETE cascade,
  CONSTRAINT "session_tokens_token_hash_key" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_session_tokens_user_id_expires_at"
  ON "session_tokens" USING btree ("user_id", "expires_at" DESC);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_session_tokens_session_id"
  ON "session_tokens" USING btree ("session_id");

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "two_factor_secrets" (
  "user_id" text PRIMARY KEY NOT NULL,
  "secret_ciphertext" text NOT NULL,
  "backup_codes_hash" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "enabled" boolean DEFAULT false NOT NULL,
  "verified_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "two_factor_secrets_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_two_factor_secrets_enabled"
  ON "two_factor_secrets" USING btree ("enabled");

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rate_limit_keys" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "scope" text NOT NULL,
  "key" text NOT NULL,
  "hit_count" integer DEFAULT 0 NOT NULL,
  "window_start" timestamp with time zone NOT NULL,
  "window_end" timestamp with time zone NOT NULL,
  "blocked_until" timestamp with time zone,
  "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "rate_limit_keys_scope_key_window_start_key"
    UNIQUE("scope", "key", "window_start"),
  CONSTRAINT "rate_limit_keys_hit_count_check"
    CHECK ("hit_count" >= 0)
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_rate_limit_keys_scope_key"
  ON "rate_limit_keys" USING btree ("scope", "key");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_rate_limit_keys_window_end"
  ON "rate_limit_keys" USING btree ("window_end");

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "feature_flags" (
  "key" text PRIMARY KEY NOT NULL,
  "description" text,
  "enabled" boolean DEFAULT false NOT NULL,
  "rollout_percentage" integer DEFAULT 0 NOT NULL,
  "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "feature_flags_rollout_percentage_check"
    CHECK ("rollout_percentage" >= 0 AND "rollout_percentage" <= 100)
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_feature_flags_enabled"
  ON "feature_flags" USING btree ("enabled");

--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'user_profiles_id_root_account_id_key'
  ) THEN
    ALTER TABLE "user_profiles"
      ADD CONSTRAINT "user_profiles_id_root_account_id_key"
      UNIQUE ("id", "root_account_id");
  END IF;
END $$;

--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'root_accounts'
      AND column_name = 'active_profile_id'
  ) THEN
    ALTER TABLE "root_accounts" ADD COLUMN "active_profile_id" uuid;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'root_accounts_active_profile_belongs_to_root_account_fkey'
  ) THEN
    ALTER TABLE "root_accounts"
      ADD CONSTRAINT "root_accounts_active_profile_belongs_to_root_account_fkey"
      FOREIGN KEY ("active_profile_id", "id")
      REFERENCES "public"."user_profiles"("id", "root_account_id")
      ON DELETE SET NULL
      DEFERRABLE INITIALLY DEFERRED;
  END IF;
END $$;

--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_root_accounts_active_profile_id"
  ON "root_accounts" USING btree ("active_profile_id");

--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'user_profiles' AND column_name = 'is_default'
  ) THEN
    ALTER TABLE "user_profiles" ADD COLUMN "is_default" boolean DEFAULT false NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'user_profiles' AND column_name = 'points'
  ) THEN
    ALTER TABLE "user_profiles" ADD COLUMN "points" integer DEFAULT 0 NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'user_profiles' AND column_name = 'level'
  ) THEN
    ALTER TABLE "user_profiles" ADD COLUMN "level" integer DEFAULT 1 NOT NULL;
  END IF;
END $$;

--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_user_profiles_default_per_root"
  ON "user_profiles" USING btree ("root_account_id")
  WHERE "is_default" = true;

--> statement-breakpoint
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT table_name, column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND data_type = 'timestamp without time zone'
  LOOP
    EXECUTE format(
      'ALTER TABLE %I.%I ALTER COLUMN %I TYPE timestamp with time zone USING %I AT TIME ZONE ''UTC''',
      'public',
      r.table_name,
      r.column_name,
      r.column_name
    );
  END LOOP;
END $$;

--> statement-breakpoint
ALTER TABLE "user_preferences" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "session_tokens" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "two_factor_secrets" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "rate_limit_keys" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "feature_flags" ENABLE ROW LEVEL SECURITY;
