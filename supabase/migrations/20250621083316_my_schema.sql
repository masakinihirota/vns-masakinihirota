

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgsodium";








ALTER SCHEMA "public" OWNER TO "postgres";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."comment_display_type" AS ENUM (
    'before_selection',
    'after_selection',
    'both'
);


ALTER TYPE "public"."comment_display_type" OWNER TO "postgres";


CREATE TYPE "public"."creator_type" AS ENUM (
    'official',
    'user_created'
);


ALTER TYPE "public"."creator_type" OWNER TO "postgres";


CREATE TYPE "public"."group_member_role" AS ENUM (
    'leader',
    'manager',
    'member'
);


ALTER TYPE "public"."group_member_role" OWNER TO "postgres";


CREATE TYPE "public"."group_member_status" AS ENUM (
    'active',
    'pending_approval',
    'invited'
);


ALTER TYPE "public"."group_member_status" OWNER TO "postgres";


CREATE TYPE "public"."group_status" AS ENUM (
    'active',
    'recruiting',
    'closed'
);


ALTER TYPE "public"."group_status" OWNER TO "postgres";


CREATE TYPE "public"."group_visibility" AS ENUM (
    'public',
    'private',
    'unlisted'
);


ALTER TYPE "public"."group_visibility" OWNER TO "postgres";


CREATE TYPE "public"."list_type" AS ENUM (
    'category',
    'genre',
    'value',
    'skill',
    'other'
);


ALTER TYPE "public"."list_type" OWNER TO "postgres";


CREATE TYPE "public"."living_area_segment" AS ENUM (
    'area1',
    'area2',
    'area3'
);


ALTER TYPE "public"."living_area_segment" OWNER TO "postgres";


CREATE TYPE "public"."mandala_content_type" AS ENUM (
    'skill',
    'sub_theme',
    'text'
);


ALTER TYPE "public"."mandala_content_type" OWNER TO "postgres";


CREATE TYPE "public"."penalty_type" AS ENUM (
    'warning',
    'mute',
    'ban'
);


ALTER TYPE "public"."penalty_type" OWNER TO "postgres";


CREATE TYPE "public"."profile_status" AS ENUM (
    'recruiting_member',
    'recruiting_job',
    'recruiting_partner',
    'recruiting_assistant',
    'recruiting_manga_friend',
    'seeking_advice',
    'offering_advice',
    'open_to_collaboration',
    'just_browsing',
    'other'
);


ALTER TYPE "public"."profile_status" OWNER TO "postgres";


CREATE TYPE "public"."profile_type" AS ENUM (
    'self',
    'interview_target',
    'other_person_representation',
    'fictional_character',
    'bot'
);


ALTER TYPE "public"."profile_type" OWNER TO "postgres";


CREATE TYPE "public"."reaction_type" AS ENUM (
    'like',
    'applause'
);


ALTER TYPE "public"."reaction_type" OWNER TO "postgres";


CREATE TYPE "public"."relationship_type" AS ENUM (
    'watch',
    'follow',
    'pre_partner',
    'partner'
);


ALTER TYPE "public"."relationship_type" OWNER TO "postgres";


CREATE TYPE "public"."time_segment" AS ENUM (
    'current',
    'future',
    'life'
);


ALTER TYPE "public"."time_segment" OWNER TO "postgres";


CREATE TYPE "public"."transaction_type" AS ENUM (
    'earn',
    'spend'
);


ALTER TYPE "public"."transaction_type" OWNER TO "postgres";


CREATE TYPE "public"."work_size" AS ENUM (
    'short',
    'medium',
    'long',
    'epic',
    'never_ending'
);


ALTER TYPE "public"."work_size" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
BEGIN
  INSERT INTO public.root_accounts (id, aud, role, email, email_confirmed_at, last_sign_in_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
  VALUES (NEW.id, NEW.aud, NEW.role, NEW.email, NEW.email_confirmed_at, NEW.last_sign_in_at, NEW.created_at, NEW.updated_at, NEW.raw_app_meta_data, NEW.raw_user_meta_data);
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."alliance_groups" (
    "alliance_id" "uuid" NOT NULL,
    "group_id" "uuid" NOT NULL,
    "joined_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."alliance_groups" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."alliances" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "alliance_leader_group_id" "uuid" NOT NULL,
    "status" "public"."group_status" DEFAULT 'active'::"public"."group_status" NOT NULL,
    "visibility" "public"."group_visibility" DEFAULT 'public'::"public"."group_visibility" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."alliances" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chain_nodes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "chain_id" "uuid" NOT NULL,
    "work_id" "uuid" NOT NULL,
    "parent_node_id" "uuid",
    "depth" integer NOT NULL,
    "display_order" integer DEFAULT 0 NOT NULL,
    "relation_label" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."chain_nodes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chains" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "creator_type" "public"."creator_type" NOT NULL,
    "user_profile_id" "uuid",
    "is_public" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "chains_check" CHECK (((("creator_type" = 'official'::"public"."creator_type") AND ("user_profile_id" IS NULL)) OR (("creator_type" = 'user_created'::"public"."creator_type") AND ("user_profile_id" IS NOT NULL))))
);


ALTER TABLE "public"."chains" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."deleted_records_log" (
    "id" bigint NOT NULL,
    "table_name" "text" NOT NULL,
    "record_id" "text" NOT NULL,
    "deleted_data" "jsonb" NOT NULL,
    "deleted_by" "uuid",
    "deleted_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "deletion_reason" "text",
    "ip_address" "inet",
    "user_agent" "text"
);


ALTER TABLE "public"."deleted_records_log" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."deleted_records_log_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."deleted_records_log_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."deleted_records_log_id_seq" OWNED BY "public"."deleted_records_log"."id";



CREATE TABLE IF NOT EXISTS "public"."error_logs" (
    "id" bigint NOT NULL,
    "error_type" "text" NOT NULL,
    "error_message" "text" NOT NULL,
    "stack_trace" "text",
    "user_id" "uuid",
    "request_path" "text",
    "request_method" "text",
    "request_body" "jsonb",
    "occurred_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."error_logs" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."error_logs_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."error_logs_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."error_logs_id_seq" OWNED BY "public"."error_logs"."id";



CREATE TABLE IF NOT EXISTS "public"."genres" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "category_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."genres" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."group_members" (
    "group_id" "uuid" NOT NULL,
    "user_profile_id" "uuid" NOT NULL,
    "role" "public"."group_member_role" NOT NULL,
    "status" "public"."group_member_status" NOT NULL,
    "joined_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."group_members" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."groups" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "leader_user_profile_id" "uuid" NOT NULL,
    "rules" "text",
    "communication_means" "text",
    "is_public" boolean DEFAULT true,
    "status" "public"."group_status" DEFAULT 'active'::"public"."group_status" NOT NULL,
    "visibility" "public"."group_visibility" DEFAULT 'public'::"public"."group_visibility" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."groups" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."languages" (
    "id" character varying(10) NOT NULL,
    "name" "text" NOT NULL,
    "native_name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."languages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."lists" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "creator_type" "public"."creator_type" NOT NULL,
    "user_profile_id" "uuid" NOT NULL,
    "is_public" boolean DEFAULT true,
    "list_type" "public"."list_type" DEFAULT 'other'::"public"."list_type" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."lists" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."login_attempts" (
    "id" bigint NOT NULL,
    "email" "text",
    "ip_address" "inet" NOT NULL,
    "user_agent" "text",
    "success" boolean NOT NULL,
    "failure_reason" "text",
    "attempted_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."login_attempts" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."login_attempts_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."login_attempts_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."login_attempts_id_seq" OWNED BY "public"."login_attempts"."id";



CREATE TABLE IF NOT EXISTS "public"."mandala_sheet_cells" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "mandala_sheet_id" "uuid" NOT NULL,
    "row_index" integer NOT NULL,
    "column_index" integer NOT NULL,
    "content_type" "public"."mandala_content_type" NOT NULL,
    "content_skill_id" "uuid",
    "content_text" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "mandala_sheet_cells_check" CHECK (((("content_type" = 'skill'::"public"."mandala_content_type") AND ("content_skill_id" IS NOT NULL) AND ("content_text" IS NULL)) OR (("content_type" = ANY (ARRAY['sub_theme'::"public"."mandala_content_type", 'text'::"public"."mandala_content_type"])) AND ("content_skill_id" IS NULL) AND ("content_text" IS NOT NULL)))),
    CONSTRAINT "mandala_sheet_cells_column_index_check" CHECK ((("column_index" >= 0) AND ("column_index" <= 8))),
    CONSTRAINT "mandala_sheet_cells_row_index_check" CHECK ((("row_index" >= 0) AND ("row_index" <= 8)))
);


ALTER TABLE "public"."mandala_sheet_cells" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."mandala_sheets" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_profile_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."mandala_sheets" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "recipient_user_profile_id" "uuid" NOT NULL,
    "notification_type" "text" NOT NULL,
    "content" "text",
    "is_read" boolean DEFAULT false,
    "read_at" timestamp with time zone,
    "link_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."notifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."penalties" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "target_user_profile_id" "uuid",
    "penalty_type" "public"."penalty_type" NOT NULL,
    "reason" "text",
    "applied_by_admin_id" "uuid",
    "expires_at" timestamp with time zone,
    "warning_count" integer DEFAULT 0,
    "last_warning_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "target_root_account_id" "uuid",
    CONSTRAINT "penalties_check" CHECK (((("target_root_account_id" IS NOT NULL) AND ("target_user_profile_id" IS NULL)) OR (("target_root_account_id" IS NULL) AND ("target_user_profile_id" IS NOT NULL))))
);


ALTER TABLE "public"."penalties" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."performance_metrics" (
    "id" bigint NOT NULL,
    "endpoint" "text" NOT NULL,
    "response_time_ms" integer NOT NULL,
    "memory_usage_mb" double precision,
    "cpu_usage_percent" double precision,
    "recorded_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."performance_metrics" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."performance_metrics_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."performance_metrics_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."performance_metrics_id_seq" OWNED BY "public"."performance_metrics"."id";



CREATE TABLE IF NOT EXISTS "public"."point_transactions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_profile_id" "uuid",
    "transaction_type" "public"."transaction_type" NOT NULL,
    "points_amount" integer NOT NULL,
    "description" "text",
    "transaction_date" timestamp with time zone DEFAULT "now"() NOT NULL,
    "root_account_id" "uuid",
    CONSTRAINT "point_transactions_check" CHECK (((("root_account_id" IS NOT NULL) AND ("user_profile_id" IS NULL)) OR (("root_account_id" IS NULL) AND ("user_profile_id" IS NOT NULL))))
);


ALTER TABLE "public"."point_transactions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."relationships" (
    "source_user_profile_id" "uuid" NOT NULL,
    "target_user_profile_id" "uuid" NOT NULL,
    "relationship_type" "public"."relationship_type" NOT NULL,
    "group_context_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "relationships_check" CHECK (("source_user_profile_id" <> "target_user_profile_id"))
);


ALTER TABLE "public"."relationships" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."root_accounts" (
    "id" "uuid" NOT NULL,
    "aud" "text",
    "role" "text",
    "email" "text",
    "email_confirmed_at" "text",
    "last_sign_in_at" timestamp with time zone,
    "raw_app_meta_data" "jsonb",
    "raw_user_meta_data" "jsonb",
    "is_verified" boolean DEFAULT false NOT NULL,
    "mother_tongue_code" character varying(10),
    "site_language_code" character varying(10),
    "birth_generation" character varying(50),
    "total_points" integer DEFAULT 0 NOT NULL,
    "living_area_segment" "public"."living_area_segment",
    "last_login_at" timestamp with time zone,
    "warning_count" integer DEFAULT 0 NOT NULL,
    "last_warning_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "root_accounts_total_points_check" CHECK (("total_points" >= 0)),
    CONSTRAINT "root_accounts_warning_count_check" CHECK (("warning_count" >= 0))
);


ALTER TABLE "public"."root_accounts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."security_incidents" (
    "id" bigint NOT NULL,
    "incident_type" "text" NOT NULL,
    "severity" "text" NOT NULL,
    "description" "text" NOT NULL,
    "source_ip" "inet",
    "user_id" "uuid",
    "detected_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "resolved_at" timestamp with time zone
);


ALTER TABLE "public"."security_incidents" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."security_incidents_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."security_incidents_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."security_incidents_id_seq" OWNED BY "public"."security_incidents"."id";



CREATE TABLE IF NOT EXISTS "public"."skill_progress_history" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_profile_id" "uuid" NOT NULL,
    "skill_id" "uuid" NOT NULL,
    "level" integer NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "previous_level" integer
);


ALTER TABLE "public"."skill_progress_history" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."skills" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "creator_type" "public"."creator_type" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."skills" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tags" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "creator_type" "public"."creator_type" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."tags" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."translations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "table_name" "text" NOT NULL,
    "column_name" "text" NOT NULL,
    "row_id" "uuid" NOT NULL,
    "language_code" character varying(10) NOT NULL,
    "translation_text" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."translations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_activity_log" (
    "id" bigint NOT NULL,
    "user_id" "uuid",
    "action_type" "text" NOT NULL,
    "resource_type" "text" NOT NULL,
    "resource_id" "text",
    "details" "jsonb",
    "ip_address" "inet",
    "user_agent" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."user_activity_log" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."user_activity_log_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."user_activity_log_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."user_activity_log_id_seq" OWNED BY "public"."user_activity_log"."id";



CREATE TABLE IF NOT EXISTS "public"."user_profile_favorite_works" (
    "user_profile_id" "uuid" NOT NULL,
    "work_id" "uuid" NOT NULL,
    "evaluation_tier" "text",
    "time_segment" "public"."time_segment",
    "reaction_type" "public"."reaction_type",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."user_profile_favorite_works" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_profile_selected_values" (
    "user_profile_id" "uuid" NOT NULL,
    "value_theme_id" "uuid" NOT NULL,
    "value_choice_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."user_profile_selected_values" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_profile_skills" (
    "user_profile_id" "uuid" NOT NULL,
    "skill_id" "uuid" NOT NULL,
    "skill_level" integer,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."user_profile_skills" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_profiles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "profile_name" "text" NOT NULL,
    "profile_type" "public"."profile_type" DEFAULT 'self'::"public"."profile_type" NOT NULL,
    "status" "public"."profile_status" DEFAULT 'other'::"public"."profile_status" NOT NULL,
    "purpose" "text",
    "is_anonymous" boolean DEFAULT false NOT NULL,
    "is_verified" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "root_account_id" "uuid" NOT NULL
);


ALTER TABLE "public"."user_profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."value_choices" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "value_theme_id" "uuid" NOT NULL,
    "choice_text" "text" NOT NULL,
    "display_order" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."value_choices" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."value_selection_history" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_profile_id" "uuid" NOT NULL,
    "value_theme_id" "uuid" NOT NULL,
    "selected_option" "text" NOT NULL,
    "selected_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "previous_option" "text"
);


ALTER TABLE "public"."value_selection_history" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."value_theme_tags" (
    "value_theme_id" "uuid" NOT NULL,
    "tag_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."value_theme_tags" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."value_themes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "category_id" "uuid",
    "creator_type" "public"."creator_type" NOT NULL,
    "user_profile_id" "uuid",
    "tags" "text"[],
    "comment_display_type" "public"."comment_display_type",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "value_themes_check" CHECK (((("creator_type" = 'official'::"public"."creator_type") AND ("user_profile_id" IS NULL)) OR (("creator_type" = 'user_created'::"public"."creator_type") AND ("user_profile_id" IS NOT NULL))))
);


ALTER TABLE "public"."value_themes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."work_authors" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "work_id" "uuid" NOT NULL,
    "author_name" "text" NOT NULL,
    "role" "text",
    "display_order" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."work_authors" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."work_evaluation_history" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_profile_id" "uuid" NOT NULL,
    "work_id" "uuid" NOT NULL,
    "tier" integer NOT NULL,
    "evaluated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "previous_tier" integer
);


ALTER TABLE "public"."work_evaluation_history" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."work_tags" (
    "work_id" "uuid" NOT NULL,
    "tag_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."work_tags" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."works" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "category_id" "uuid",
    "genre_id" "uuid",
    "official_url" "text",
    "creator_type" "public"."creator_type" NOT NULL,
    "user_profile_id" "uuid",
    "size" "public"."work_size" DEFAULT 'medium'::"public"."work_size" NOT NULL,
    "release_year" integer,
    "ai_comment_score" integer DEFAULT 0,
    "call_count" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "works_check" CHECK (((("creator_type" = 'official'::"public"."creator_type") AND ("user_profile_id" IS NULL)) OR (("creator_type" = 'user_created'::"public"."creator_type") AND ("user_profile_id" IS NOT NULL))))
);


ALTER TABLE "public"."works" OWNER TO "postgres";


ALTER TABLE ONLY "public"."deleted_records_log" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."deleted_records_log_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."error_logs" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."error_logs_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."login_attempts" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."login_attempts_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."performance_metrics" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."performance_metrics_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."security_incidents" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."security_incidents_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."user_activity_log" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."user_activity_log_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."alliance_groups"
    ADD CONSTRAINT "alliance_groups_pkey" PRIMARY KEY ("alliance_id", "group_id");



ALTER TABLE ONLY "public"."alliances"
    ADD CONSTRAINT "alliances_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chain_nodes"
    ADD CONSTRAINT "chain_nodes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chains"
    ADD CONSTRAINT "chains_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."deleted_records_log"
    ADD CONSTRAINT "deleted_records_log_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."error_logs"
    ADD CONSTRAINT "error_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."genres"
    ADD CONSTRAINT "genres_category_id_name_key" UNIQUE ("category_id", "name");



ALTER TABLE ONLY "public"."genres"
    ADD CONSTRAINT "genres_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."group_members"
    ADD CONSTRAINT "group_members_pkey" PRIMARY KEY ("group_id", "user_profile_id");



ALTER TABLE ONLY "public"."groups"
    ADD CONSTRAINT "groups_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."languages"
    ADD CONSTRAINT "languages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."lists"
    ADD CONSTRAINT "lists_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."login_attempts"
    ADD CONSTRAINT "login_attempts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mandala_sheet_cells"
    ADD CONSTRAINT "mandala_sheet_cells_mandala_sheet_id_row_index_column_index_key" UNIQUE ("mandala_sheet_id", "row_index", "column_index");



ALTER TABLE ONLY "public"."mandala_sheet_cells"
    ADD CONSTRAINT "mandala_sheet_cells_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mandala_sheets"
    ADD CONSTRAINT "mandala_sheets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."penalties"
    ADD CONSTRAINT "penalties_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."performance_metrics"
    ADD CONSTRAINT "performance_metrics_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."point_transactions"
    ADD CONSTRAINT "point_transactions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."relationships"
    ADD CONSTRAINT "relationships_pkey" PRIMARY KEY ("source_user_profile_id", "target_user_profile_id");



ALTER TABLE ONLY "public"."root_accounts"
    ADD CONSTRAINT "root_accounts_email_confirmed_at_key" UNIQUE ("email_confirmed_at");



ALTER TABLE ONLY "public"."root_accounts"
    ADD CONSTRAINT "root_accounts_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."root_accounts"
    ADD CONSTRAINT "root_accounts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."security_incidents"
    ADD CONSTRAINT "security_incidents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."skill_progress_history"
    ADD CONSTRAINT "skill_progress_history_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."skills"
    ADD CONSTRAINT "skills_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."skills"
    ADD CONSTRAINT "skills_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tags"
    ADD CONSTRAINT "tags_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."tags"
    ADD CONSTRAINT "tags_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."translations"
    ADD CONSTRAINT "translations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."translations"
    ADD CONSTRAINT "translations_table_name_column_name_row_id_language_code_key" UNIQUE ("table_name", "column_name", "row_id", "language_code");



ALTER TABLE ONLY "public"."user_activity_log"
    ADD CONSTRAINT "user_activity_log_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_profile_favorite_works"
    ADD CONSTRAINT "user_profile_favorite_works_pkey" PRIMARY KEY ("user_profile_id", "work_id");



ALTER TABLE ONLY "public"."user_profile_selected_values"
    ADD CONSTRAINT "user_profile_selected_values_pkey" PRIMARY KEY ("user_profile_id", "value_theme_id", "value_choice_id");



ALTER TABLE ONLY "public"."user_profile_skills"
    ADD CONSTRAINT "user_profile_skills_pkey" PRIMARY KEY ("user_profile_id", "skill_id");



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."value_choices"
    ADD CONSTRAINT "value_choices_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."value_selection_history"
    ADD CONSTRAINT "value_selection_history_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."value_theme_tags"
    ADD CONSTRAINT "value_theme_tags_pkey" PRIMARY KEY ("value_theme_id", "tag_id");



ALTER TABLE ONLY "public"."value_themes"
    ADD CONSTRAINT "value_themes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."work_authors"
    ADD CONSTRAINT "work_authors_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."work_evaluation_history"
    ADD CONSTRAINT "work_evaluation_history_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."work_tags"
    ADD CONSTRAINT "work_tags_pkey" PRIMARY KEY ("work_id", "tag_id");



ALTER TABLE ONLY "public"."works"
    ADD CONSTRAINT "works_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_alliances_alliance_leader_group_id" ON "public"."alliances" USING "btree" ("alliance_leader_group_id");



CREATE INDEX "idx_chain_nodes_chain_id" ON "public"."chain_nodes" USING "btree" ("chain_id");



CREATE INDEX "idx_chain_nodes_depth" ON "public"."chain_nodes" USING "btree" ("depth");



CREATE INDEX "idx_chain_nodes_parent_node_id" ON "public"."chain_nodes" USING "btree" ("parent_node_id");



CREATE INDEX "idx_chain_nodes_work_id" ON "public"."chain_nodes" USING "btree" ("work_id");



CREATE INDEX "idx_chains_creator_type" ON "public"."chains" USING "btree" ("creator_type");



CREATE INDEX "idx_chains_user_profile_id" ON "public"."chains" USING "btree" ("user_profile_id");



CREATE INDEX "idx_deleted_records_log_deleted_at" ON "public"."deleted_records_log" USING "btree" ("deleted_at");



CREATE INDEX "idx_deleted_records_log_deleted_by" ON "public"."deleted_records_log" USING "btree" ("deleted_by");



CREATE INDEX "idx_deleted_records_log_table_name" ON "public"."deleted_records_log" USING "btree" ("table_name");



CREATE INDEX "idx_error_logs_error_type" ON "public"."error_logs" USING "btree" ("error_type");



CREATE INDEX "idx_error_logs_occurred_at" ON "public"."error_logs" USING "btree" ("occurred_at");



CREATE INDEX "idx_error_logs_user_id" ON "public"."error_logs" USING "btree" ("user_id");



CREATE INDEX "idx_genres_category_id" ON "public"."genres" USING "btree" ("category_id");



CREATE INDEX "idx_group_members_group_id" ON "public"."group_members" USING "btree" ("group_id");



CREATE INDEX "idx_group_members_role" ON "public"."group_members" USING "btree" ("role");



CREATE INDEX "idx_group_members_status" ON "public"."group_members" USING "btree" ("status");



CREATE INDEX "idx_group_members_user_profile_id" ON "public"."group_members" USING "btree" ("user_profile_id");



CREATE INDEX "idx_groups_leader_user_profile_id" ON "public"."groups" USING "btree" ("leader_user_profile_id");



CREATE INDEX "idx_groups_status" ON "public"."groups" USING "btree" ("status");



CREATE INDEX "idx_groups_visibility" ON "public"."groups" USING "btree" ("visibility");



CREATE INDEX "idx_lists_creator_type" ON "public"."lists" USING "btree" ("creator_type");



CREATE INDEX "idx_lists_list_type" ON "public"."lists" USING "btree" ("list_type");



CREATE INDEX "idx_lists_user_profile_id" ON "public"."lists" USING "btree" ("user_profile_id");



CREATE INDEX "idx_login_attempts_attempted_at" ON "public"."login_attempts" USING "btree" ("attempted_at");



CREATE INDEX "idx_login_attempts_email" ON "public"."login_attempts" USING "btree" ("email");



CREATE INDEX "idx_login_attempts_ip_address" ON "public"."login_attempts" USING "btree" ("ip_address");



CREATE INDEX "idx_mandala_sheet_cells_content_skill_id" ON "public"."mandala_sheet_cells" USING "btree" ("content_skill_id");



CREATE INDEX "idx_mandala_sheet_cells_mandala_sheet_id" ON "public"."mandala_sheet_cells" USING "btree" ("mandala_sheet_id");



CREATE INDEX "idx_mandala_sheets_user_profile_id" ON "public"."mandala_sheets" USING "btree" ("user_profile_id");



CREATE INDEX "idx_notifications_created_at" ON "public"."notifications" USING "btree" ("created_at");



CREATE INDEX "idx_notifications_is_read" ON "public"."notifications" USING "btree" ("is_read");



CREATE INDEX "idx_notifications_recipient_user_profile_id" ON "public"."notifications" USING "btree" ("recipient_user_profile_id");



CREATE INDEX "idx_penalties_penalty_type" ON "public"."penalties" USING "btree" ("penalty_type");



CREATE INDEX "idx_penalties_target_root_account_id" ON "public"."penalties" USING "btree" ("target_root_account_id");



CREATE INDEX "idx_penalties_target_user_profile_id" ON "public"."penalties" USING "btree" ("target_user_profile_id");



CREATE INDEX "idx_performance_metrics_endpoint" ON "public"."performance_metrics" USING "btree" ("endpoint");



CREATE INDEX "idx_performance_metrics_recorded_at" ON "public"."performance_metrics" USING "btree" ("recorded_at");



CREATE INDEX "idx_point_transactions_root_account_id" ON "public"."point_transactions" USING "btree" ("root_account_id");



CREATE INDEX "idx_point_transactions_transaction_date" ON "public"."point_transactions" USING "btree" ("transaction_date");



CREATE INDEX "idx_point_transactions_transaction_type" ON "public"."point_transactions" USING "btree" ("transaction_type");



CREATE INDEX "idx_point_transactions_user_profile_id" ON "public"."point_transactions" USING "btree" ("user_profile_id");



CREATE INDEX "idx_relationships_source_user_profile" ON "public"."relationships" USING "btree" ("source_user_profile_id");



CREATE INDEX "idx_relationships_target_user_profile" ON "public"."relationships" USING "btree" ("target_user_profile_id");



CREATE INDEX "idx_relationships_type" ON "public"."relationships" USING "btree" ("relationship_type");



CREATE INDEX "idx_root_accounts_email" ON "public"."root_accounts" USING "btree" ("email");



CREATE INDEX "idx_root_accounts_last_login" ON "public"."root_accounts" USING "btree" ("last_login_at");



CREATE INDEX "idx_root_accounts_mother_tongue" ON "public"."root_accounts" USING "btree" ("mother_tongue_code");



CREATE INDEX "idx_root_accounts_site_language" ON "public"."root_accounts" USING "btree" ("site_language_code");



CREATE INDEX "idx_security_incidents_detected_at" ON "public"."security_incidents" USING "btree" ("detected_at");



CREATE INDEX "idx_security_incidents_incident_type" ON "public"."security_incidents" USING "btree" ("incident_type");



CREATE INDEX "idx_security_incidents_severity" ON "public"."security_incidents" USING "btree" ("severity");



CREATE INDEX "idx_skill_progress_history_skill_id" ON "public"."skill_progress_history" USING "btree" ("skill_id");



CREATE INDEX "idx_skill_progress_history_updated_at" ON "public"."skill_progress_history" USING "btree" ("updated_at");



CREATE INDEX "idx_skill_progress_history_user_profile_id" ON "public"."skill_progress_history" USING "btree" ("user_profile_id");



CREATE INDEX "idx_skills_creator_type" ON "public"."skills" USING "btree" ("creator_type");



CREATE INDEX "idx_skills_name" ON "public"."skills" USING "btree" ("name");



CREATE INDEX "idx_tags_creator_type" ON "public"."tags" USING "btree" ("creator_type");



CREATE INDEX "idx_tags_name" ON "public"."tags" USING "btree" ("name");



CREATE INDEX "idx_translations_language_code" ON "public"."translations" USING "btree" ("language_code");



CREATE INDEX "idx_translations_table_column_row" ON "public"."translations" USING "btree" ("table_name", "column_name", "row_id");



CREATE INDEX "idx_user_activity_log_action_type" ON "public"."user_activity_log" USING "btree" ("action_type");



CREATE INDEX "idx_user_activity_log_created_at" ON "public"."user_activity_log" USING "btree" ("created_at");



CREATE INDEX "idx_user_activity_log_user_id" ON "public"."user_activity_log" USING "btree" ("user_id");



CREATE INDEX "idx_user_profile_favorite_works_tier" ON "public"."user_profile_favorite_works" USING "btree" ("evaluation_tier");



CREATE INDEX "idx_user_profile_favorite_works_time_segment" ON "public"."user_profile_favorite_works" USING "btree" ("time_segment");



CREATE INDEX "idx_user_profile_favorite_works_user_profile" ON "public"."user_profile_favorite_works" USING "btree" ("user_profile_id");



CREATE INDEX "idx_user_profile_favorite_works_work" ON "public"."user_profile_favorite_works" USING "btree" ("work_id");



CREATE INDEX "idx_user_profile_selected_values_user_profile" ON "public"."user_profile_selected_values" USING "btree" ("user_profile_id");



CREATE INDEX "idx_user_profile_selected_values_value_theme" ON "public"."user_profile_selected_values" USING "btree" ("value_theme_id");



CREATE INDEX "idx_user_profile_skills_level" ON "public"."user_profile_skills" USING "btree" ("skill_level");



CREATE INDEX "idx_user_profile_skills_skill" ON "public"."user_profile_skills" USING "btree" ("skill_id");



CREATE INDEX "idx_user_profile_skills_user_profile" ON "public"."user_profile_skills" USING "btree" ("user_profile_id");



CREATE INDEX "idx_user_profiles_profile_type" ON "public"."user_profiles" USING "btree" ("profile_type");



CREATE INDEX "idx_user_profiles_root_account_id" ON "public"."user_profiles" USING "btree" ("root_account_id");



CREATE INDEX "idx_user_profiles_status" ON "public"."user_profiles" USING "btree" ("status");



CREATE INDEX "idx_value_choices_display_order" ON "public"."value_choices" USING "btree" ("display_order");



CREATE INDEX "idx_value_choices_value_theme_id" ON "public"."value_choices" USING "btree" ("value_theme_id");



CREATE INDEX "idx_value_selection_history_selected_at" ON "public"."value_selection_history" USING "btree" ("selected_at");



CREATE INDEX "idx_value_selection_history_user_profile_id" ON "public"."value_selection_history" USING "btree" ("user_profile_id");



CREATE INDEX "idx_value_selection_history_value_theme_id" ON "public"."value_selection_history" USING "btree" ("value_theme_id");



CREATE INDEX "idx_value_themes_category_id" ON "public"."value_themes" USING "btree" ("category_id");



CREATE INDEX "idx_value_themes_creator_type" ON "public"."value_themes" USING "btree" ("creator_type");



CREATE INDEX "idx_value_themes_user_profile_id" ON "public"."value_themes" USING "btree" ("user_profile_id");



CREATE INDEX "idx_work_authors_author_name" ON "public"."work_authors" USING "btree" ("author_name");



CREATE INDEX "idx_work_authors_work_id" ON "public"."work_authors" USING "btree" ("work_id");



CREATE INDEX "idx_work_evaluation_history_evaluated_at" ON "public"."work_evaluation_history" USING "btree" ("evaluated_at");



CREATE INDEX "idx_work_evaluation_history_user_profile_id" ON "public"."work_evaluation_history" USING "btree" ("user_profile_id");



CREATE INDEX "idx_work_evaluation_history_work_id" ON "public"."work_evaluation_history" USING "btree" ("work_id");



CREATE INDEX "idx_works_category_id" ON "public"."works" USING "btree" ("category_id");



CREATE INDEX "idx_works_creator_type" ON "public"."works" USING "btree" ("creator_type");



CREATE INDEX "idx_works_genre_id" ON "public"."works" USING "btree" ("genre_id");



CREATE INDEX "idx_works_release_year" ON "public"."works" USING "btree" ("release_year");



CREATE INDEX "idx_works_title" ON "public"."works" USING "btree" ("title");



CREATE INDEX "idx_works_user_profile_id" ON "public"."works" USING "btree" ("user_profile_id");



CREATE OR REPLACE TRIGGER "update_alliances_updated_at" BEFORE UPDATE ON "public"."alliances" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_categories_updated_at" BEFORE UPDATE ON "public"."categories" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_chain_nodes_updated_at" BEFORE UPDATE ON "public"."chain_nodes" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_chains_updated_at" BEFORE UPDATE ON "public"."chains" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_genres_updated_at" BEFORE UPDATE ON "public"."genres" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_group_members_updated_at" BEFORE UPDATE ON "public"."group_members" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_groups_updated_at" BEFORE UPDATE ON "public"."groups" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_languages_updated_at" BEFORE UPDATE ON "public"."languages" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_lists_updated_at" BEFORE UPDATE ON "public"."lists" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_mandala_sheet_cells_updated_at" BEFORE UPDATE ON "public"."mandala_sheet_cells" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_mandala_sheets_updated_at" BEFORE UPDATE ON "public"."mandala_sheets" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_relationships_updated_at" BEFORE UPDATE ON "public"."relationships" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_root_accounts_updated_at" BEFORE UPDATE ON "public"."root_accounts" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_skills_updated_at" BEFORE UPDATE ON "public"."skills" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_tags_updated_at" BEFORE UPDATE ON "public"."tags" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_translations_updated_at" BEFORE UPDATE ON "public"."translations" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_user_profile_favorite_works_updated_at" BEFORE UPDATE ON "public"."user_profile_favorite_works" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_user_profile_selected_values_updated_at" BEFORE UPDATE ON "public"."user_profile_selected_values" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_user_profile_skills_updated_at" BEFORE UPDATE ON "public"."user_profile_skills" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_user_profiles_updated_at" BEFORE UPDATE ON "public"."user_profiles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_value_choices_updated_at" BEFORE UPDATE ON "public"."value_choices" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_value_themes_updated_at" BEFORE UPDATE ON "public"."value_themes" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_work_authors_updated_at" BEFORE UPDATE ON "public"."work_authors" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_works_updated_at" BEFORE UPDATE ON "public"."works" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."alliance_groups"
    ADD CONSTRAINT "alliance_groups_alliance_id_fkey" FOREIGN KEY ("alliance_id") REFERENCES "public"."alliances"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."alliance_groups"
    ADD CONSTRAINT "alliance_groups_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."alliances"
    ADD CONSTRAINT "alliances_alliance_leader_group_id_fkey" FOREIGN KEY ("alliance_leader_group_id") REFERENCES "public"."groups"("id");



ALTER TABLE ONLY "public"."chain_nodes"
    ADD CONSTRAINT "chain_nodes_chain_id_fkey" FOREIGN KEY ("chain_id") REFERENCES "public"."chains"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chain_nodes"
    ADD CONSTRAINT "chain_nodes_parent_node_id_fkey" FOREIGN KEY ("parent_node_id") REFERENCES "public"."chain_nodes"("id");



ALTER TABLE ONLY "public"."chain_nodes"
    ADD CONSTRAINT "chain_nodes_work_id_fkey" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chains"
    ADD CONSTRAINT "chains_user_profile_id_fkey" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."genres"
    ADD CONSTRAINT "genres_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."group_members"
    ADD CONSTRAINT "group_members_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."group_members"
    ADD CONSTRAINT "group_members_user_profile_id_fkey" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."groups"
    ADD CONSTRAINT "groups_leader_user_profile_id_fkey" FOREIGN KEY ("leader_user_profile_id") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."lists"
    ADD CONSTRAINT "lists_user_profile_id_fkey" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."mandala_sheet_cells"
    ADD CONSTRAINT "mandala_sheet_cells_content_skill_id_fkey" FOREIGN KEY ("content_skill_id") REFERENCES "public"."skills"("id");



ALTER TABLE ONLY "public"."mandala_sheet_cells"
    ADD CONSTRAINT "mandala_sheet_cells_mandala_sheet_id_fkey" FOREIGN KEY ("mandala_sheet_id") REFERENCES "public"."mandala_sheets"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."mandala_sheets"
    ADD CONSTRAINT "mandala_sheets_user_profile_id_fkey" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_recipient_user_profile_id_fkey" FOREIGN KEY ("recipient_user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."penalties"
    ADD CONSTRAINT "penalties_target_root_account_id_fkey" FOREIGN KEY ("target_root_account_id") REFERENCES "public"."root_accounts"("id");



ALTER TABLE ONLY "public"."penalties"
    ADD CONSTRAINT "penalties_target_user_profile_id_fkey" FOREIGN KEY ("target_user_profile_id") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."point_transactions"
    ADD CONSTRAINT "point_transactions_root_account_id_fkey" FOREIGN KEY ("root_account_id") REFERENCES "public"."root_accounts"("id");



ALTER TABLE ONLY "public"."point_transactions"
    ADD CONSTRAINT "point_transactions_user_profile_id_fkey" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."relationships"
    ADD CONSTRAINT "relationships_group_context_id_fkey" FOREIGN KEY ("group_context_id") REFERENCES "public"."groups"("id");



ALTER TABLE ONLY "public"."relationships"
    ADD CONSTRAINT "relationships_source_user_profile_id_fkey" FOREIGN KEY ("source_user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."relationships"
    ADD CONSTRAINT "relationships_target_user_profile_id_fkey" FOREIGN KEY ("target_user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."root_accounts"
    ADD CONSTRAINT "root_accounts_mother_tongue_code_fkey" FOREIGN KEY ("mother_tongue_code") REFERENCES "public"."languages"("id");



ALTER TABLE ONLY "public"."root_accounts"
    ADD CONSTRAINT "root_accounts_site_language_code_fkey" FOREIGN KEY ("site_language_code") REFERENCES "public"."languages"("id");



ALTER TABLE ONLY "public"."skill_progress_history"
    ADD CONSTRAINT "skill_progress_history_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."skill_progress_history"
    ADD CONSTRAINT "skill_progress_history_user_profile_id_fkey" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."translations"
    ADD CONSTRAINT "translations_language_code_fkey" FOREIGN KEY ("language_code") REFERENCES "public"."languages"("id");



ALTER TABLE ONLY "public"."user_profile_favorite_works"
    ADD CONSTRAINT "user_profile_favorite_works_user_profile_id_fkey" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_profile_favorite_works"
    ADD CONSTRAINT "user_profile_favorite_works_work_id_fkey" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_profile_selected_values"
    ADD CONSTRAINT "user_profile_selected_values_user_profile_id_fkey" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_profile_selected_values"
    ADD CONSTRAINT "user_profile_selected_values_value_choice_id_fkey" FOREIGN KEY ("value_choice_id") REFERENCES "public"."value_choices"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_profile_selected_values"
    ADD CONSTRAINT "user_profile_selected_values_value_theme_id_fkey" FOREIGN KEY ("value_theme_id") REFERENCES "public"."value_themes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_profile_skills"
    ADD CONSTRAINT "user_profile_skills_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_profile_skills"
    ADD CONSTRAINT "user_profile_skills_user_profile_id_fkey" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_root_account_id_fkey" FOREIGN KEY ("root_account_id") REFERENCES "public"."root_accounts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."value_choices"
    ADD CONSTRAINT "value_choices_value_theme_id_fkey" FOREIGN KEY ("value_theme_id") REFERENCES "public"."value_themes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."value_selection_history"
    ADD CONSTRAINT "value_selection_history_user_profile_id_fkey" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."value_selection_history"
    ADD CONSTRAINT "value_selection_history_value_theme_id_fkey" FOREIGN KEY ("value_theme_id") REFERENCES "public"."value_themes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."value_theme_tags"
    ADD CONSTRAINT "value_theme_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."value_theme_tags"
    ADD CONSTRAINT "value_theme_tags_value_theme_id_fkey" FOREIGN KEY ("value_theme_id") REFERENCES "public"."value_themes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."value_themes"
    ADD CONSTRAINT "value_themes_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id");



ALTER TABLE ONLY "public"."value_themes"
    ADD CONSTRAINT "value_themes_user_profile_id_fkey" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."work_authors"
    ADD CONSTRAINT "work_authors_work_id_fkey" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."work_evaluation_history"
    ADD CONSTRAINT "work_evaluation_history_user_profile_id_fkey" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."work_evaluation_history"
    ADD CONSTRAINT "work_evaluation_history_work_id_fkey" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."work_tags"
    ADD CONSTRAINT "work_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."work_tags"
    ADD CONSTRAINT "work_tags_work_id_fkey" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."works"
    ADD CONSTRAINT "works_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id");



ALTER TABLE ONLY "public"."works"
    ADD CONSTRAINT "works_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "public"."genres"("id");



ALTER TABLE ONLY "public"."works"
    ADD CONSTRAINT "works_user_profile_id_fkey" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id");





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";





REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";


























































































































































































GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



























GRANT ALL ON TABLE "public"."alliance_groups" TO "anon";
GRANT ALL ON TABLE "public"."alliance_groups" TO "authenticated";
GRANT ALL ON TABLE "public"."alliance_groups" TO "service_role";



GRANT ALL ON TABLE "public"."alliances" TO "anon";
GRANT ALL ON TABLE "public"."alliances" TO "authenticated";
GRANT ALL ON TABLE "public"."alliances" TO "service_role";



GRANT ALL ON TABLE "public"."categories" TO "anon";
GRANT ALL ON TABLE "public"."categories" TO "authenticated";
GRANT ALL ON TABLE "public"."categories" TO "service_role";



GRANT ALL ON TABLE "public"."chain_nodes" TO "anon";
GRANT ALL ON TABLE "public"."chain_nodes" TO "authenticated";
GRANT ALL ON TABLE "public"."chain_nodes" TO "service_role";



GRANT ALL ON TABLE "public"."chains" TO "anon";
GRANT ALL ON TABLE "public"."chains" TO "authenticated";
GRANT ALL ON TABLE "public"."chains" TO "service_role";



GRANT ALL ON TABLE "public"."deleted_records_log" TO "anon";
GRANT ALL ON TABLE "public"."deleted_records_log" TO "authenticated";
GRANT ALL ON TABLE "public"."deleted_records_log" TO "service_role";



GRANT ALL ON SEQUENCE "public"."deleted_records_log_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."deleted_records_log_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."deleted_records_log_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."error_logs" TO "anon";
GRANT ALL ON TABLE "public"."error_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."error_logs" TO "service_role";



GRANT ALL ON SEQUENCE "public"."error_logs_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."error_logs_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."error_logs_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."genres" TO "anon";
GRANT ALL ON TABLE "public"."genres" TO "authenticated";
GRANT ALL ON TABLE "public"."genres" TO "service_role";



GRANT ALL ON TABLE "public"."group_members" TO "anon";
GRANT ALL ON TABLE "public"."group_members" TO "authenticated";
GRANT ALL ON TABLE "public"."group_members" TO "service_role";



GRANT ALL ON TABLE "public"."groups" TO "anon";
GRANT ALL ON TABLE "public"."groups" TO "authenticated";
GRANT ALL ON TABLE "public"."groups" TO "service_role";



GRANT ALL ON TABLE "public"."languages" TO "anon";
GRANT ALL ON TABLE "public"."languages" TO "authenticated";
GRANT ALL ON TABLE "public"."languages" TO "service_role";



GRANT ALL ON TABLE "public"."lists" TO "anon";
GRANT ALL ON TABLE "public"."lists" TO "authenticated";
GRANT ALL ON TABLE "public"."lists" TO "service_role";



GRANT ALL ON TABLE "public"."login_attempts" TO "anon";
GRANT ALL ON TABLE "public"."login_attempts" TO "authenticated";
GRANT ALL ON TABLE "public"."login_attempts" TO "service_role";



GRANT ALL ON SEQUENCE "public"."login_attempts_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."login_attempts_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."login_attempts_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."mandala_sheet_cells" TO "anon";
GRANT ALL ON TABLE "public"."mandala_sheet_cells" TO "authenticated";
GRANT ALL ON TABLE "public"."mandala_sheet_cells" TO "service_role";



GRANT ALL ON TABLE "public"."mandala_sheets" TO "anon";
GRANT ALL ON TABLE "public"."mandala_sheets" TO "authenticated";
GRANT ALL ON TABLE "public"."mandala_sheets" TO "service_role";



GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";



GRANT ALL ON TABLE "public"."penalties" TO "anon";
GRANT ALL ON TABLE "public"."penalties" TO "authenticated";
GRANT ALL ON TABLE "public"."penalties" TO "service_role";



GRANT ALL ON TABLE "public"."performance_metrics" TO "anon";
GRANT ALL ON TABLE "public"."performance_metrics" TO "authenticated";
GRANT ALL ON TABLE "public"."performance_metrics" TO "service_role";



GRANT ALL ON SEQUENCE "public"."performance_metrics_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."performance_metrics_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."performance_metrics_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."point_transactions" TO "anon";
GRANT ALL ON TABLE "public"."point_transactions" TO "authenticated";
GRANT ALL ON TABLE "public"."point_transactions" TO "service_role";



GRANT ALL ON TABLE "public"."relationships" TO "anon";
GRANT ALL ON TABLE "public"."relationships" TO "authenticated";
GRANT ALL ON TABLE "public"."relationships" TO "service_role";



GRANT ALL ON TABLE "public"."root_accounts" TO "anon";
GRANT ALL ON TABLE "public"."root_accounts" TO "authenticated";
GRANT ALL ON TABLE "public"."root_accounts" TO "service_role";



GRANT ALL ON TABLE "public"."security_incidents" TO "anon";
GRANT ALL ON TABLE "public"."security_incidents" TO "authenticated";
GRANT ALL ON TABLE "public"."security_incidents" TO "service_role";



GRANT ALL ON SEQUENCE "public"."security_incidents_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."security_incidents_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."security_incidents_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."skill_progress_history" TO "anon";
GRANT ALL ON TABLE "public"."skill_progress_history" TO "authenticated";
GRANT ALL ON TABLE "public"."skill_progress_history" TO "service_role";



GRANT ALL ON TABLE "public"."skills" TO "anon";
GRANT ALL ON TABLE "public"."skills" TO "authenticated";
GRANT ALL ON TABLE "public"."skills" TO "service_role";



GRANT ALL ON TABLE "public"."tags" TO "anon";
GRANT ALL ON TABLE "public"."tags" TO "authenticated";
GRANT ALL ON TABLE "public"."tags" TO "service_role";



GRANT ALL ON TABLE "public"."translations" TO "anon";
GRANT ALL ON TABLE "public"."translations" TO "authenticated";
GRANT ALL ON TABLE "public"."translations" TO "service_role";



GRANT ALL ON TABLE "public"."user_activity_log" TO "anon";
GRANT ALL ON TABLE "public"."user_activity_log" TO "authenticated";
GRANT ALL ON TABLE "public"."user_activity_log" TO "service_role";



GRANT ALL ON SEQUENCE "public"."user_activity_log_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_activity_log_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_activity_log_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."user_profile_favorite_works" TO "anon";
GRANT ALL ON TABLE "public"."user_profile_favorite_works" TO "authenticated";
GRANT ALL ON TABLE "public"."user_profile_favorite_works" TO "service_role";



GRANT ALL ON TABLE "public"."user_profile_selected_values" TO "anon";
GRANT ALL ON TABLE "public"."user_profile_selected_values" TO "authenticated";
GRANT ALL ON TABLE "public"."user_profile_selected_values" TO "service_role";



GRANT ALL ON TABLE "public"."user_profile_skills" TO "anon";
GRANT ALL ON TABLE "public"."user_profile_skills" TO "authenticated";
GRANT ALL ON TABLE "public"."user_profile_skills" TO "service_role";



GRANT ALL ON TABLE "public"."user_profiles" TO "anon";
GRANT ALL ON TABLE "public"."user_profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."user_profiles" TO "service_role";



GRANT ALL ON TABLE "public"."value_choices" TO "anon";
GRANT ALL ON TABLE "public"."value_choices" TO "authenticated";
GRANT ALL ON TABLE "public"."value_choices" TO "service_role";



GRANT ALL ON TABLE "public"."value_selection_history" TO "anon";
GRANT ALL ON TABLE "public"."value_selection_history" TO "authenticated";
GRANT ALL ON TABLE "public"."value_selection_history" TO "service_role";



GRANT ALL ON TABLE "public"."value_theme_tags" TO "anon";
GRANT ALL ON TABLE "public"."value_theme_tags" TO "authenticated";
GRANT ALL ON TABLE "public"."value_theme_tags" TO "service_role";



GRANT ALL ON TABLE "public"."value_themes" TO "anon";
GRANT ALL ON TABLE "public"."value_themes" TO "authenticated";
GRANT ALL ON TABLE "public"."value_themes" TO "service_role";



GRANT ALL ON TABLE "public"."work_authors" TO "anon";
GRANT ALL ON TABLE "public"."work_authors" TO "authenticated";
GRANT ALL ON TABLE "public"."work_authors" TO "service_role";



GRANT ALL ON TABLE "public"."work_evaluation_history" TO "anon";
GRANT ALL ON TABLE "public"."work_evaluation_history" TO "authenticated";
GRANT ALL ON TABLE "public"."work_evaluation_history" TO "service_role";



GRANT ALL ON TABLE "public"."work_tags" TO "anon";
GRANT ALL ON TABLE "public"."work_tags" TO "authenticated";
GRANT ALL ON TABLE "public"."work_tags" TO "service_role";



GRANT ALL ON TABLE "public"."works" TO "anon";
GRANT ALL ON TABLE "public"."works" TO "authenticated";
GRANT ALL ON TABLE "public"."works" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;

--
-- Dumped schema changes for auth and storage
--

