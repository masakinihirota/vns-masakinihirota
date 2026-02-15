ALTER TABLE "user_profiles" ADD COLUMN "profile_format" text DEFAULT 'profile';--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "role" text DEFAULT 'member';--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "purposes" text[] DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "profile_type" text DEFAULT 'self';--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "avatar_url" text;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "external_links" jsonb;