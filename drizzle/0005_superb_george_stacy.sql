ALTER TABLE "nation_citizens" DROP CONSTRAINT "nation_citizens_role_check";--> statement-breakpoint
ALTER TABLE "root_accounts" DROP CONSTRAINT "root_accounts_points_check";--> statement-breakpoint
ALTER TABLE "root_accounts" DROP CONSTRAINT "root_accounts_level_check";--> statement-breakpoint
ALTER TABLE "point_transactions" DROP CONSTRAINT "point_transactions_root_account_id_fkey";
--> statement-breakpoint
DROP INDEX "idx_point_transactions_root_account";--> statement-breakpoint
ALTER TABLE "point_transactions" ADD COLUMN "user_profile_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "root_accounts" ADD COLUMN "active_profile_id" uuid;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "is_default" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "points" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "level" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "point_transactions" ADD CONSTRAINT "point_transactions_user_profile_id_fkey" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_point_transactions_user_profile" ON "point_transactions" USING btree ("user_profile_id" uuid_ops);--> statement-breakpoint
ALTER TABLE "point_transactions" DROP COLUMN "root_account_id";--> statement-breakpoint
ALTER TABLE "root_accounts" DROP COLUMN "points";--> statement-breakpoint
ALTER TABLE "root_accounts" DROP COLUMN "level";--> statement-breakpoint
ALTER TABLE "nation_citizens" ADD CONSTRAINT "nation_citizens_role_check" CHECK (role = ANY (ARRAY['official'::text, 'citizen'::text, 'governor'::text]));--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_points_check" CHECK (points >= 0);--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_level_check" CHECK (level >= 1);