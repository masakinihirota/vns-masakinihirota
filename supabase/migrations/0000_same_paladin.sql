CREATE TYPE "public"."account_status" AS ENUM('active', 'suspended', 'banned', 'pending');--> statement-breakpoint
CREATE TYPE "public"."account_type" AS ENUM('anonymous', 'free', 'premium');--> statement-breakpoint
CREATE TYPE "public"."auth_event_type" AS ENUM('sign_in', 'sign_out', 'refresh', 'anonymous_upgrade', 'provider_link', 'provider_unlink', 'failure');--> statement-breakpoint
CREATE TYPE "public"."auth_provider" AS ENUM('google', 'github', 'anonymous');--> statement-breakpoint
CREATE TYPE "public"."language_proficiency" AS ENUM('native', 'fluent', 'intermediate', 'basic', 'learning');--> statement-breakpoint
CREATE TYPE "public"."living_area_segment" AS ENUM('area1', 'area2', 'area3');--> statement-breakpoint
CREATE TYPE "public"."points_reason" AS ENUM('system_adjust', 'manual_adjust', 'signup_bonus', 'profile_complete', 'login_streak', 'penalty');--> statement-breakpoint
CREATE TYPE "public"."subscription_tier" AS ENUM('basic', 'premium', 'enterprise');--> statement-breakpoint
CREATE TYPE "public"."theme_preference" AS ENUM('light', 'dark', 'auto');--> statement-breakpoint
CREATE TABLE "account_providers" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "account_providers_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"root_account_id" uuid NOT NULL,
	"provider" "auth_provider" NOT NULL,
	"provider_user_id" text NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"linked_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth_events" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "auth_events_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"root_account_id" uuid,
	"event_type" "auth_event_type" NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"message" text
);
--> statement-breakpoint
CREATE TABLE "auth_users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"aud" text,
	"role" text,
	"email" text,
	"email_confirmed_at" timestamp with time zone,
	"phone" text,
	"phone_confirmed_at" timestamp with time zone,
	"last_sign_in_at" timestamp with time zone,
	"raw_app_meta_data" jsonb,
	"raw_user_meta_data" jsonb,
	"is_anonymous" boolean DEFAULT false NOT NULL,
	"instance_id" uuid,
	"email_change" text,
	"email_change_token_new" text,
	"email_change_token_current" text,
	"email_change_sent_at" timestamp with time zone,
	"phone_change" text,
	"phone_change_token" text,
	"phone_change_sent_at" timestamp with time zone,
	"confirmation_token" text,
	"confirmation_sent_at" timestamp with time zone,
	"recovery_token" text,
	"recovery_sent_at" timestamp with time zone,
	"confirmed_at" timestamp with time zone,
	"email_change_confirm_status" integer DEFAULT 0,
	"banned_until" timestamp with time zone,
	"is_super_admin" boolean DEFAULT false,
	"is_sso_user" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"encrypted_password" text,
	"invited_at" timestamp with time zone,
	"reauthentication_token" text,
	"reauthentication_sent_at" timestamp with time zone,
	CONSTRAINT "auth_users_email_unique" UNIQUE("email"),
	CONSTRAINT "auth_users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "languages" (
	"id" varchar(10) PRIMARY KEY NOT NULL,
	"name" text,
	"native_name" text
);
--> statement-breakpoint
CREATE TABLE "points_transactions" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "points_transactions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"root_account_id" uuid NOT NULL,
	"delta" integer NOT NULL,
	"reason" "points_reason" NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "root_accounts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"is_verified" boolean DEFAULT false NOT NULL,
	"mother_tongue_code" varchar(10),
	"site_language_code" varchar(10),
	"birth_generation" varchar(50),
	"total_points" integer DEFAULT 0 NOT NULL,
	"living_area_segment" "living_area_segment" DEFAULT 'area1' NOT NULL,
	"warning_count" integer DEFAULT 0 NOT NULL,
	"last_warning_at" timestamp with time zone,
	"is_anonymous_initial_auth" boolean DEFAULT false NOT NULL,
	"invited_at" timestamp with time zone,
	"confirmed_at" timestamp with time zone,
	"max_points" integer DEFAULT 1000 NOT NULL,
	"last_point_recovery_at" timestamp with time zone,
	"total_consumed_points" integer DEFAULT 0 NOT NULL,
	"activity_points" integer DEFAULT 0 NOT NULL,
	"click_points" integer DEFAULT 0 NOT NULL,
	"consecutive_days" integer DEFAULT 0 NOT NULL,
	"trust_score" integer DEFAULT 0 NOT NULL,
	"oauth_providers" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"oauth_count" integer DEFAULT 0 NOT NULL,
	"account_status" "account_status" DEFAULT 'active' NOT NULL,
	CONSTRAINT "totalPoints_check" CHECK ("root_accounts"."total_points" >= 0),
	CONSTRAINT "warningCount_check" CHECK ("root_accounts"."warning_count" >= 0),
	CONSTRAINT "maxPoints_check" CHECK ("root_accounts"."max_points" > 0),
	CONSTRAINT "totalConsumedPoints_check" CHECK ("root_accounts"."total_consumed_points" >= 0),
	CONSTRAINT "activityPoints_check" CHECK ("root_accounts"."activity_points" >= 0),
	CONSTRAINT "clickPoints_check" CHECK ("root_accounts"."click_points" >= 0),
	CONSTRAINT "consecutiveDays_check" CHECK ("root_accounts"."consecutive_days" >= 0),
	CONSTRAINT "trustScore_check" CHECK ("root_accounts"."trust_score" >= 0),
	CONSTRAINT "oauthCount_check" CHECK ("root_accounts"."oauth_count" >= 0),
	CONSTRAINT "totalPoints_maxPoints_check" CHECK ("root_accounts"."total_points" <= "root_accounts"."max_points"),
	CONSTRAINT "oauthCount_providers_check" CHECK ("root_accounts"."oauth_count" = array_length("root_accounts"."oauth_providers", 1))
);
--> statement-breakpoint
CREATE TABLE "user_languages" (
	"root_account_id" uuid NOT NULL,
	"language_id" varchar(10) NOT NULL,
	"proficiency" "language_proficiency" NOT NULL,
	"added_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_languages_pkey" PRIMARY KEY("root_account_id","language_id")
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"root_account_id" uuid NOT NULL,
	"title" text NOT NULL,
	"type" text NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL,
	"badge_color" text DEFAULT 'gray',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account_providers" ADD CONSTRAINT "account_providers_root_account_id_root_accounts_id_fk" FOREIGN KEY ("root_account_id") REFERENCES "public"."root_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth_events" ADD CONSTRAINT "auth_events_root_account_id_root_accounts_id_fk" FOREIGN KEY ("root_account_id") REFERENCES "public"."root_accounts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "points_transactions" ADD CONSTRAINT "points_transactions_root_account_id_root_accounts_id_fk" FOREIGN KEY ("root_account_id") REFERENCES "public"."root_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "root_accounts" ADD CONSTRAINT "root_accounts_mother_tongue_code_languages_id_fk" FOREIGN KEY ("mother_tongue_code") REFERENCES "public"."languages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "root_accounts" ADD CONSTRAINT "root_accounts_site_language_code_languages_id_fk" FOREIGN KEY ("site_language_code") REFERENCES "public"."languages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_languages" ADD CONSTRAINT "user_languages_root_account_id_root_accounts_id_fk" FOREIGN KEY ("root_account_id") REFERENCES "public"."root_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_languages" ADD CONSTRAINT "user_languages_language_id_languages_id_fk" FOREIGN KEY ("language_id") REFERENCES "public"."languages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_root_account_id_root_accounts_id_fk" FOREIGN KEY ("root_account_id") REFERENCES "public"."root_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "uq_account_providers_provider_user" ON "account_providers" USING btree ("provider","provider_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_account_providers_root_provider" ON "account_providers" USING btree ("root_account_id","provider");--> statement-breakpoint
CREATE INDEX "idx_account_providers_root_account" ON "account_providers" USING btree ("root_account_id");--> statement-breakpoint
CREATE INDEX "idx_auth_events_root_account" ON "auth_events" USING btree ("root_account_id");--> statement-breakpoint
CREATE INDEX "idx_auth_events_event_type" ON "auth_events" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "idx_auth_events_created_at" ON "auth_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_points_tx_root_account" ON "points_transactions" USING btree ("root_account_id");--> statement-breakpoint
CREATE INDEX "idx_points_tx_reason" ON "points_transactions" USING btree ("reason");--> statement-breakpoint
CREATE INDEX "idx_points_tx_created_at" ON "points_transactions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_user_languages_proficiency" ON "user_languages" USING btree ("proficiency");