CREATE TYPE "public"."mask_category" AS ENUM('ghost', 'persona');--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "mask_category" "mask_category" DEFAULT 'persona' NOT NULL;--> statement-breakpoint
ALTER TABLE "user_profiles" DROP COLUMN "is_read_only";--> statement-breakpoint
ALTER TABLE "user_profiles" DROP COLUMN "is_ghost_mask";