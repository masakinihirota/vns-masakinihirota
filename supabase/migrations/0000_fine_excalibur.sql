CREATE TYPE "public"."alliance_status" AS ENUM('active', 'inactive', 'suspended', 'disbanded');--> statement-breakpoint
CREATE TYPE "public"."alliance_visibility" AS ENUM('public', 'private', 'invite_only');--> statement-breakpoint
CREATE TYPE "public"."group_status" AS ENUM('active', 'inactive', 'suspended', 'disbanded');--> statement-breakpoint
CREATE TYPE "public"."group_visibility" AS ENUM('public', 'private', 'invite_only');--> statement-breakpoint
CREATE TYPE "public"."list_type" AS ENUM('favorite', 'watchlist', 'completed', 'custom');--> statement-breakpoint
CREATE TYPE "public"."living_area_segment" AS ENUM('urban', 'rural', 'suburban');--> statement-breakpoint
CREATE TYPE "public"."profile_status" AS ENUM('active', 'inactive', 'suspended');--> statement-breakpoint
CREATE TYPE "public"."profile_type" AS ENUM('main', 'sub', 'anonymous');--> statement-breakpoint
CREATE TYPE "public"."comment_display_type" AS ENUM('public', 'private', 'limited');--> statement-breakpoint
CREATE TYPE "public"."work_size" AS ENUM('small', 'medium', 'large', 'extra_large');--> statement-breakpoint
CREATE TABLE "alliances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"alliance_leader_group_id" uuid NOT NULL,
	"status" "alliance_status" DEFAULT 'active' NOT NULL,
	"visibility" "alliance_visibility" DEFAULT 'public' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "alliance_groups" (
	"alliance_id" uuid NOT NULL,
	"group_id" uuid NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "alliance_groups_alliance_id_group_id_pk" PRIMARY KEY("alliance_id","group_id")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chains" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"creator_type" text NOT NULL,
	"user_profile_id" uuid NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chain_nodes" (
	"id" uuid PRIMARY KEY NOT NULL,
	"chain_id" uuid NOT NULL,
	"work_id" uuid NOT NULL,
	"parent_node_id" uuid,
	"depth" integer NOT NULL,
	"display_order" integer NOT NULL,
	"relation_label" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deleted_works_log" (
	"id" uuid PRIMARY KEY NOT NULL,
	"deleted_at" timestamp with time zone NOT NULL,
	"deleted_by" uuid,
	"data" text
);
--> statement-breakpoint
CREATE TABLE "genres" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"leader_user_profile_id" uuid NOT NULL,
	"rules" text,
	"communication_means" text,
	"is_public" boolean DEFAULT true NOT NULL,
	"status" "group_status" DEFAULT 'active' NOT NULL,
	"visibility" "group_visibility" DEFAULT 'public' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "group_members" (
	"group_id" uuid NOT NULL,
	"user_profile_id" uuid NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "group_members_group_id_user_profile_id_pk" PRIMARY KEY("group_id","user_profile_id")
);
--> statement-breakpoint
CREATE TABLE "languages" (
	"id" varchar(10) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"native_name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"creator_type" text NOT NULL,
	"user_profile_id" uuid NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"list_type" "list_type" DEFAULT 'custom' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mandala_sheets" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_profile_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mandala_sheet_cells" (
	"id" uuid PRIMARY KEY NOT NULL,
	"mandala_sheet_id" uuid NOT NULL,
	"row_index" integer NOT NULL,
	"column_index" integer NOT NULL,
	"content_type" text NOT NULL,
	"content_skill_id" uuid,
	"content_text" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY NOT NULL,
	"recipient_user_profile_id" uuid NOT NULL,
	"notification_type" text NOT NULL,
	"content" text,
	"is_read" boolean DEFAULT false NOT NULL,
	"link_url" text,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "penalties" (
	"id" uuid PRIMARY KEY NOT NULL,
	"target_root_account_id" uuid,
	"target_user_profile_id" uuid,
	"penalty_type" text NOT NULL,
	"reason" text,
	"applied_by_admin_id" uuid,
	"expires_at" timestamp with time zone,
	"warning_count" integer,
	"last_warning_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "point_transactions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"root_account_id" uuid,
	"user_profile_id" uuid,
	"transaction_type" text NOT NULL,
	"points_amount" integer NOT NULL,
	"description" text,
	"transaction_date" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "relationships" (
	"source_user_profile_id" uuid NOT NULL,
	"target_user_profile_id" uuid NOT NULL,
	"relationship_type" text NOT NULL,
	"group_context_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "relationships_source_user_profile_id_target_user_profile_id_pk" PRIMARY KEY("source_user_profile_id","target_user_profile_id")
);
--> statement-breakpoint
CREATE TABLE "root_accounts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"aud" text,
	"role" text,
	"email" text,
	"email_confirmed_at" text,
	"last_sign_in_at" timestamp with time zone,
	"raw_app_meta_data" jsonb,
	"raw_user_meta_data" jsonb,
	"is_verified" boolean DEFAULT false NOT NULL,
	"mother_tongue_code" varchar(10),
	"site_language_code" varchar(10),
	"birth_generation" varchar(50),
	"total_points" integer DEFAULT 0 NOT NULL,
	"living_area_segment" "living_area_segment",
	"last_login_at" timestamp with time zone,
	"warning_count" integer DEFAULT 0 NOT NULL,
	"last_warning_at" timestamp with time zone,
	"is_anonymous_initial_auth" boolean DEFAULT false NOT NULL,
	"invited_at" timestamp with time zone,
	"confirmed_at" timestamp with time zone,
	"banned_until" timestamp with time zone,
	"is_super_admin" boolean DEFAULT false,
	"is_sso_user" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "root_accounts_email_unique" UNIQUE("email"),
	CONSTRAINT "root_accounts_email_confirmed_at_unique" UNIQUE("email_confirmed_at"),
	CONSTRAINT "totalPoints_check" CHECK ("root_accounts"."total_points" >= 0),
	CONSTRAINT "warningCount_check" CHECK ("root_accounts"."warning_count" >= 0)
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"creator_type" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skill_progress_history" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_profile_id" uuid NOT NULL,
	"skill_id" uuid NOT NULL,
	"level" integer NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"previous_level" integer
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"tag_type" text NOT NULL,
	"creator_type" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tags_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "translations" (
	"id" uuid PRIMARY KEY NOT NULL,
	"table_name" text NOT NULL,
	"column_name" text NOT NULL,
	"row_id" uuid NOT NULL,
	"language_code" varchar(10) NOT NULL,
	"translation_text" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"root_account_id" uuid NOT NULL,
	"profile_name" text NOT NULL,
	"profile_type" "profile_type" DEFAULT 'main' NOT NULL,
	"status" "profile_status" DEFAULT 'active' NOT NULL,
	"purpose" text,
	"is_anonymous" boolean DEFAULT false NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_profile_favorite_works" (
	"user_profile_id" uuid NOT NULL,
	"work_id" uuid NOT NULL,
	"evaluation_tier" text,
	"time_segment" text,
	"reaction_type" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_profile_favorite_works_user_profile_id_work_id_pk" PRIMARY KEY("user_profile_id","work_id")
);
--> statement-breakpoint
CREATE TABLE "user_selected_values" (
	"user_profile_id" uuid NOT NULL,
	"value_theme_id" uuid NOT NULL,
	"value_choice_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_values_pk" PRIMARY KEY("user_profile_id","value_theme_id","value_choice_id")
);
--> statement-breakpoint
CREATE TABLE "user_profile_skills" (
	"user_profile_id" uuid NOT NULL,
	"skill_id" uuid NOT NULL,
	"skill_level" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_profile_skills_user_profile_id_skill_id_pk" PRIMARY KEY("user_profile_id","skill_id"),
	CONSTRAINT "skill_level_check" CHECK ("user_profile_skills"."skill_level" >= 1 AND "user_profile_skills"."skill_level" <= 10)
);
--> statement-breakpoint
CREATE TABLE "value_choices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"value_theme_id" uuid NOT NULL,
	"choice_text" text NOT NULL,
	"display_order" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "value_selection_history" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_profile_id" uuid NOT NULL,
	"value_id" uuid NOT NULL,
	"selected_option" text,
	"selected_at" timestamp with time zone DEFAULT now() NOT NULL,
	"previous_option" text
);
--> statement-breakpoint
CREATE TABLE "value_themes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"category_id" uuid,
	"creator_type" text NOT NULL,
	"user_profile_id" uuid,
	"comment_display_type" "comment_display_type" DEFAULT 'public' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "value_theme_tags" (
	"value_theme_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "value_theme_tags_value_theme_id_tag_id_pk" PRIMARY KEY("value_theme_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "works" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"category_id" uuid NOT NULL,
	"genre_id" uuid,
	"official_url" text,
	"creator_type" text NOT NULL,
	"user_profile_id" uuid NOT NULL,
	"size" "work_size",
	"release_year" integer,
	"ai_comment_score" integer,
	"call_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "callCount_check" CHECK ("works"."call_count" >= 0),
	CONSTRAINT "aiCommentScore_check" CHECK ("works"."ai_comment_score" >= 0 AND "works"."ai_comment_score" <= 100)
);
--> statement-breakpoint
CREATE TABLE "work_authors" (
	"id" uuid PRIMARY KEY NOT NULL,
	"work_id" uuid NOT NULL,
	"author_name" text NOT NULL,
	"role" text,
	"display_order" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "work_evaluation_history" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_profile_id" uuid NOT NULL,
	"work_id" uuid NOT NULL,
	"tier" integer,
	"evaluated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"previous_tier" integer
);
--> statement-breakpoint
CREATE TABLE "work_tags" (
	"work_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "work_tags_work_id_tag_id_pk" PRIMARY KEY("work_id","tag_id")
);
--> statement-breakpoint
ALTER TABLE "alliances" ADD CONSTRAINT "alliances_alliance_leader_group_id_groups_id_fk" FOREIGN KEY ("alliance_leader_group_id") REFERENCES "public"."groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alliance_groups" ADD CONSTRAINT "alliance_groups_alliance_id_alliances_id_fk" FOREIGN KEY ("alliance_id") REFERENCES "public"."alliances"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alliance_groups" ADD CONSTRAINT "alliance_groups_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chains" ADD CONSTRAINT "chains_user_profile_id_user_profiles_id_fk" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "genres" ADD CONSTRAINT "genres_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "groups" ADD CONSTRAINT "groups_leader_user_profile_id_user_profiles_id_fk" FOREIGN KEY ("leader_user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_user_profile_id_user_profiles_id_fk" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lists" ADD CONSTRAINT "lists_user_profile_id_user_profiles_id_fk" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mandala_sheets" ADD CONSTRAINT "mandala_sheets_user_profile_id_user_profiles_id_fk" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mandala_sheet_cells" ADD CONSTRAINT "mandala_sheet_cells_mandala_sheet_id_mandala_sheets_id_fk" FOREIGN KEY ("mandala_sheet_id") REFERENCES "public"."mandala_sheets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mandala_sheet_cells" ADD CONSTRAINT "mandala_sheet_cells_content_skill_id_skills_id_fk" FOREIGN KEY ("content_skill_id") REFERENCES "public"."skills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipient_user_profile_id_user_profiles_id_fk" FOREIGN KEY ("recipient_user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "penalties" ADD CONSTRAINT "penalties_target_root_account_id_root_accounts_id_fk" FOREIGN KEY ("target_root_account_id") REFERENCES "public"."root_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "penalties" ADD CONSTRAINT "penalties_target_user_profile_id_user_profiles_id_fk" FOREIGN KEY ("target_user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "point_transactions" ADD CONSTRAINT "point_transactions_root_account_id_root_accounts_id_fk" FOREIGN KEY ("root_account_id") REFERENCES "public"."root_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "point_transactions" ADD CONSTRAINT "point_transactions_user_profile_id_user_profiles_id_fk" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relationships" ADD CONSTRAINT "relationships_source_user_profile_id_user_profiles_id_fk" FOREIGN KEY ("source_user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relationships" ADD CONSTRAINT "relationships_target_user_profile_id_user_profiles_id_fk" FOREIGN KEY ("target_user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relationships" ADD CONSTRAINT "relationships_group_context_id_groups_id_fk" FOREIGN KEY ("group_context_id") REFERENCES "public"."groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "root_accounts" ADD CONSTRAINT "root_accounts_mother_tongue_code_languages_id_fk" FOREIGN KEY ("mother_tongue_code") REFERENCES "public"."languages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "root_accounts" ADD CONSTRAINT "root_accounts_site_language_code_languages_id_fk" FOREIGN KEY ("site_language_code") REFERENCES "public"."languages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skill_progress_history" ADD CONSTRAINT "skill_progress_history_user_profile_id_user_profiles_id_fk" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skill_progress_history" ADD CONSTRAINT "skill_progress_history_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "translations" ADD CONSTRAINT "translations_language_code_languages_id_fk" FOREIGN KEY ("language_code") REFERENCES "public"."languages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_root_account_id_root_accounts_id_fk" FOREIGN KEY ("root_account_id") REFERENCES "public"."root_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profile_favorite_works" ADD CONSTRAINT "user_profile_favorite_works_user_profile_id_user_profiles_id_fk" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profile_favorite_works" ADD CONSTRAINT "user_profile_favorite_works_work_id_works_id_fk" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_selected_values" ADD CONSTRAINT "user_selected_values_user_profile_id_user_profiles_id_fk" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_selected_values" ADD CONSTRAINT "user_selected_values_value_theme_id_value_themes_id_fk" FOREIGN KEY ("value_theme_id") REFERENCES "public"."value_themes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_selected_values" ADD CONSTRAINT "user_selected_values_value_choice_id_value_choices_id_fk" FOREIGN KEY ("value_choice_id") REFERENCES "public"."value_choices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profile_skills" ADD CONSTRAINT "user_profile_skills_user_profile_id_user_profiles_id_fk" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profile_skills" ADD CONSTRAINT "user_profile_skills_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "value_choices" ADD CONSTRAINT "value_choices_value_theme_id_value_themes_id_fk" FOREIGN KEY ("value_theme_id") REFERENCES "public"."value_themes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "value_selection_history" ADD CONSTRAINT "value_selection_history_user_profile_id_user_profiles_id_fk" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "value_selection_history" ADD CONSTRAINT "value_selection_history_value_id_value_themes_id_fk" FOREIGN KEY ("value_id") REFERENCES "public"."value_themes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "value_themes" ADD CONSTRAINT "value_themes_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "value_themes" ADD CONSTRAINT "value_themes_user_profile_id_user_profiles_id_fk" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "value_theme_tags" ADD CONSTRAINT "value_theme_tags_value_theme_id_value_themes_id_fk" FOREIGN KEY ("value_theme_id") REFERENCES "public"."value_themes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "value_theme_tags" ADD CONSTRAINT "value_theme_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "works" ADD CONSTRAINT "works_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "works" ADD CONSTRAINT "works_genre_id_genres_id_fk" FOREIGN KEY ("genre_id") REFERENCES "public"."genres"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "works" ADD CONSTRAINT "works_user_profile_id_user_profiles_id_fk" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_authors" ADD CONSTRAINT "work_authors_work_id_works_id_fk" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_evaluation_history" ADD CONSTRAINT "work_evaluation_history_user_profile_id_user_profiles_id_fk" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_evaluation_history" ADD CONSTRAINT "work_evaluation_history_work_id_works_id_fk" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_tags" ADD CONSTRAINT "work_tags_work_id_works_id_fk" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_tags" ADD CONSTRAINT "work_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE no action ON UPDATE no action;