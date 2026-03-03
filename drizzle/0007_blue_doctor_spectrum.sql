-- NOTE: Table definitions moved to 0006_database_security_foundation.sql (IF NOT EXISTS)
-- These were duplicated in this migration, causing "relation already exists" errors
-- Removed:
--   - CREATE TABLE "feature_flags"
--   - CREATE TABLE "rate_limit_keys"
--   - CREATE TABLE "session_tokens"
--   - CREATE TABLE "two_factor_secrets"
--   - CREATE TABLE "user_preferences"
--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "access_token_expires_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "refresh_token_expires_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "expires_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "ban_expires" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "expires_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "session_tokens" ADD CONSTRAINT "session_tokens_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_tokens" ADD CONSTRAINT "session_tokens_session_id_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "two_factor_secrets" ADD CONSTRAINT "two_factor_secrets_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_feature_flags_enabled" ON "feature_flags" USING btree ("enabled" bool_ops);--> statement-breakpoint
CREATE INDEX "idx_rate_limit_keys_scope_key" ON "rate_limit_keys" USING btree ("scope" text_ops,"key" text_ops);--> statement-breakpoint
CREATE INDEX "idx_rate_limit_keys_window_end" ON "rate_limit_keys" USING btree ("window_end");--> statement-breakpoint
CREATE INDEX "idx_session_tokens_user_id_expires_at" ON "session_tokens" USING btree ("user_id" text_ops,"expires_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "idx_session_tokens_session_id" ON "session_tokens" USING btree ("session_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_two_factor_secrets_enabled" ON "two_factor_secrets" USING btree ("enabled" bool_ops);--> statement-breakpoint
CREATE INDEX "idx_root_accounts_active_profile_id" ON "root_accounts" USING btree ("active_profile_id" uuid_ops);--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_root_account_id_key" UNIQUE("root_account_id");