create type "public"."comment_display_type" as enum ('before_selection', 'after_selection', 'both');

create type "public"."creator_type" as enum ('official', 'user_created');

create type "public"."group_member_role" as enum ('leader', 'manager', 'member');

create type "public"."group_member_status" as enum ('active', 'pending_approval', 'invited');

create type "public"."group_status" as enum ('active', 'recruiting', 'closed');

create type "public"."group_visibility" as enum ('public', 'private', 'unlisted');

create type "public"."list_type" as enum ('category', 'genre', 'value', 'skill', 'other');

create type "public"."living_area_segment" as enum ('area1', 'area2', 'area3');

create type "public"."mandala_content_type" as enum ('skill', 'sub_theme', 'text');

create type "public"."penalty_type" as enum ('warning', 'mute', 'ban');

create type "public"."profile_status" as enum ('recruiting_member', 'recruiting_job', 'recruiting_partner', 'recruiting_assistant', 'recruiting_manga_friend', 'seeking_advice', 'offering_advice', 'open_to_collaboration', 'just_browsing', 'other');

create type "public"."profile_type" as enum ('self', 'interview_target', 'other_person_representation', 'fictional_character', 'bot');

create type "public"."reaction_type" as enum ('like', 'applause');

create type "public"."relationship_type" as enum ('watch', 'follow', 'pre_partner', 'partner');

create type "public"."time_segment" as enum ('current', 'future', 'life');

create type "public"."transaction_type" as enum ('earn', 'spend');

create type "public"."work_size" as enum ('short', 'medium', 'long', 'epic', 'never_ending');

create sequence "public"."deleted_records_log_id_seq";

create sequence "public"."error_logs_id_seq";

create sequence "public"."login_attempts_id_seq";

create sequence "public"."performance_metrics_id_seq";

create sequence "public"."security_incidents_id_seq";

create sequence "public"."user_activity_log_id_seq";

create table "public"."alliance_groups" (
    "alliance_id" uuid not null,
    "group_id" uuid not null,
    "joined_at" timestamp with time zone not null default now()
);


create table "public"."alliances" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "description" text,
    "alliance_leader_group_id" uuid not null,
    "status" group_status not null default 'active'::group_status,
    "visibility" group_visibility not null default 'public'::group_visibility,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


create table "public"."categories" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "description" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


create table "public"."chain_nodes" (
    "id" uuid not null default gen_random_uuid(),
    "chain_id" uuid not null,
    "work_id" uuid not null,
    "parent_node_id" uuid,
    "depth" integer not null,
    "display_order" integer not null default 0,
    "relation_label" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


create table "public"."chains" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "description" text,
    "creator_type" creator_type not null,
    "user_profile_id" uuid,
    "is_public" boolean not null default true,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


create table "public"."deleted_records_log" (
    "id" bigint not null default nextval('deleted_records_log_id_seq'::regclass),
    "table_name" text not null,
    "record_id" text not null,
    "deleted_data" jsonb not null,
    "deleted_by" uuid,
    "deleted_at" timestamp with time zone not null default now(),
    "deletion_reason" text,
    "ip_address" inet,
    "user_agent" text
);


create table "public"."error_logs" (
    "id" bigint not null default nextval('error_logs_id_seq'::regclass),
    "error_type" text not null,
    "error_message" text not null,
    "stack_trace" text,
    "user_id" uuid,
    "request_path" text,
    "request_method" text,
    "request_body" jsonb,
    "occurred_at" timestamp with time zone not null default now()
);


create table "public"."genres" (
    "id" uuid not null default gen_random_uuid(),
    "category_id" uuid not null,
    "name" text not null,
    "description" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


create table "public"."group_members" (
    "group_id" uuid not null,
    "user_profile_id" uuid not null,
    "role" group_member_role not null,
    "status" group_member_status not null,
    "joined_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


create table "public"."groups" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "description" text,
    "leader_user_profile_id" uuid not null,
    "rules" text,
    "communication_means" text,
    "is_public" boolean default true,
    "status" group_status not null default 'active'::group_status,
    "visibility" group_visibility not null default 'public'::group_visibility,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


create table "public"."languages" (
    "id" character varying(10) not null,
    "name" text not null,
    "native_name" text not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


create table "public"."lists" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "description" text,
    "creator_type" creator_type not null,
    "user_profile_id" uuid not null,
    "is_public" boolean default true,
    "list_type" list_type not null default 'other'::list_type,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


create table "public"."login_attempts" (
    "id" bigint not null default nextval('login_attempts_id_seq'::regclass),
    "email" text,
    "ip_address" inet not null,
    "user_agent" text,
    "success" boolean not null,
    "failure_reason" text,
    "attempted_at" timestamp with time zone not null default now()
);


create table "public"."mandala_sheet_cells" (
    "id" uuid not null default gen_random_uuid(),
    "mandala_sheet_id" uuid not null,
    "row_index" integer not null,
    "column_index" integer not null,
    "content_type" mandala_content_type not null,
    "content_skill_id" uuid,
    "content_text" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


create table "public"."mandala_sheets" (
    "id" uuid not null default gen_random_uuid(),
    "user_profile_id" uuid not null,
    "title" text not null,
    "description" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


create table "public"."notifications" (
    "id" uuid not null default gen_random_uuid(),
    "recipient_user_profile_id" uuid not null,
    "notification_type" text not null,
    "content" text,
    "is_read" boolean default false,
    "read_at" timestamp with time zone,
    "link_url" text,
    "created_at" timestamp with time zone not null default now()
);


create table "public"."penalties" (
    "id" uuid not null default gen_random_uuid(),
    "target_route_account_id" uuid,
    "target_user_profile_id" uuid,
    "penalty_type" penalty_type not null,
    "reason" text,
    "applied_by_admin_id" uuid,
    "expires_at" timestamp with time zone,
    "warning_count" integer default 0,
    "last_warning_at" timestamp with time zone,
    "created_at" timestamp with time zone not null default now()
);


create table "public"."performance_metrics" (
    "id" bigint not null default nextval('performance_metrics_id_seq'::regclass),
    "endpoint" text not null,
    "response_time_ms" integer not null,
    "memory_usage_mb" double precision,
    "cpu_usage_percent" double precision,
    "recorded_at" timestamp with time zone not null default now()
);


create table "public"."point_transactions" (
    "id" uuid not null default gen_random_uuid(),
    "route_account_id" uuid,
    "user_profile_id" uuid,
    "transaction_type" transaction_type not null,
    "points_amount" integer not null,
    "description" text,
    "transaction_date" timestamp with time zone not null default now()
);


create table "public"."relationships" (
    "source_user_profile_id" uuid not null,
    "target_user_profile_id" uuid not null,
    "relationship_type" relationship_type not null,
    "group_context_id" uuid,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


create table "public"."route_accounts" (
    "id" uuid not null default gen_random_uuid(),
    "aud" text,
    "role" text,
    "email" text not null,
    "email_confirmed_at" timestamp with time zone,
    "last_sign_in_at" timestamp with time zone,
    "raw_app_meta_data" jsonb,
    "raw_user_meta_data" jsonb,
    "is_verified" boolean not null default false,
    "mother_tongue_code" character varying(10),
    "site_language_code" character varying(10),
    "birth_generation" character varying(50),
    "total_points" integer not null default 0,
    "living_area_segment" living_area_segment,
    "last_login_at" timestamp with time zone,
    "warning_count" integer not null default 0,
    "last_warning_at" timestamp with time zone,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


create table "public"."security_incidents" (
    "id" bigint not null default nextval('security_incidents_id_seq'::regclass),
    "incident_type" text not null,
    "severity" text not null,
    "description" text not null,
    "source_ip" inet,
    "user_id" uuid,
    "detected_at" timestamp with time zone not null default now(),
    "resolved_at" timestamp with time zone
);


create table "public"."skill_progress_history" (
    "id" uuid not null default gen_random_uuid(),
    "user_profile_id" uuid not null,
    "skill_id" uuid not null,
    "level" integer not null,
    "updated_at" timestamp with time zone not null default now(),
    "previous_level" integer
);


create table "public"."skills" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "description" text,
    "creator_type" creator_type not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


create table "public"."tags" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "creator_type" creator_type not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


create table "public"."translations" (
    "id" uuid not null default gen_random_uuid(),
    "table_name" text not null,
    "column_name" text not null,
    "row_id" uuid not null,
    "language_code" character varying(10) not null,
    "translation_text" text not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


create table "public"."user_activity_log" (
    "id" bigint not null default nextval('user_activity_log_id_seq'::regclass),
    "user_id" uuid,
    "action_type" text not null,
    "resource_type" text not null,
    "resource_id" text,
    "details" jsonb,
    "ip_address" inet,
    "user_agent" text,
    "created_at" timestamp with time zone not null default now()
);


create table "public"."user_profile_favorite_works" (
    "user_profile_id" uuid not null,
    "work_id" uuid not null,
    "evaluation_tier" text,
    "time_segment" time_segment,
    "reaction_type" reaction_type,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


create table "public"."user_profile_selected_values" (
    "user_profile_id" uuid not null,
    "value_theme_id" uuid not null,
    "value_choice_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


create table "public"."user_profile_skills" (
    "user_profile_id" uuid not null,
    "skill_id" uuid not null,
    "skill_level" integer,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


create table "public"."user_profiles" (
    "id" uuid not null default gen_random_uuid(),
    "route_account_id" uuid not null,
    "profile_name" text not null,
    "profile_type" profile_type not null default 'self'::profile_type,
    "status" profile_status not null default 'other'::profile_status,
    "purpose" text,
    "is_anonymous" boolean not null default false,
    "is_verified" boolean not null default false,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


create table "public"."value_choices" (
    "id" uuid not null default gen_random_uuid(),
    "value_theme_id" uuid not null,
    "choice_text" text not null,
    "display_order" integer default 0,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


create table "public"."value_selection_history" (
    "id" uuid not null default gen_random_uuid(),
    "user_profile_id" uuid not null,
    "value_theme_id" uuid not null,
    "selected_option" text not null,
    "selected_at" timestamp with time zone not null default now(),
    "previous_option" text
);


create table "public"."value_theme_tags" (
    "value_theme_id" uuid not null,
    "tag_id" uuid not null,
    "created_at" timestamp with time zone not null default now()
);


create table "public"."value_themes" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "description" text,
    "category_id" uuid,
    "creator_type" creator_type not null,
    "user_profile_id" uuid,
    "tags" text[],
    "comment_display_type" comment_display_type,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


create table "public"."work_authors" (
    "id" uuid not null default gen_random_uuid(),
    "work_id" uuid not null,
    "author_name" text not null,
    "role" text,
    "display_order" integer default 0,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


create table "public"."work_evaluation_history" (
    "id" uuid not null default gen_random_uuid(),
    "user_profile_id" uuid not null,
    "work_id" uuid not null,
    "tier" integer not null,
    "evaluated_at" timestamp with time zone not null default now(),
    "previous_tier" integer
);


create table "public"."work_tags" (
    "work_id" uuid not null,
    "tag_id" uuid not null,
    "created_at" timestamp with time zone not null default now()
);


create table "public"."works" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "category_id" uuid,
    "genre_id" uuid,
    "official_url" text,
    "creator_type" creator_type not null,
    "user_profile_id" uuid,
    "size" work_size not null default 'medium'::work_size,
    "release_year" integer,
    "ai_comment_score" integer default 0,
    "call_count" integer default 0,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter sequence "public"."deleted_records_log_id_seq" owned by "public"."deleted_records_log"."id";

alter sequence "public"."error_logs_id_seq" owned by "public"."error_logs"."id";

alter sequence "public"."login_attempts_id_seq" owned by "public"."login_attempts"."id";

alter sequence "public"."performance_metrics_id_seq" owned by "public"."performance_metrics"."id";

alter sequence "public"."security_incidents_id_seq" owned by "public"."security_incidents"."id";

alter sequence "public"."user_activity_log_id_seq" owned by "public"."user_activity_log"."id";

CREATE UNIQUE INDEX alliance_groups_pkey ON public.alliance_groups USING btree (alliance_id, group_id);

CREATE UNIQUE INDEX alliances_pkey ON public.alliances USING btree (id);

CREATE UNIQUE INDEX categories_name_key ON public.categories USING btree (name);

CREATE UNIQUE INDEX categories_pkey ON public.categories USING btree (id);

CREATE UNIQUE INDEX chain_nodes_pkey ON public.chain_nodes USING btree (id);

CREATE UNIQUE INDEX chains_pkey ON public.chains USING btree (id);

CREATE UNIQUE INDEX deleted_records_log_pkey ON public.deleted_records_log USING btree (id);

CREATE UNIQUE INDEX error_logs_pkey ON public.error_logs USING btree (id);

CREATE UNIQUE INDEX genres_category_id_name_key ON public.genres USING btree (category_id, name);

CREATE UNIQUE INDEX genres_pkey ON public.genres USING btree (id);

CREATE UNIQUE INDEX group_members_pkey ON public.group_members USING btree (group_id, user_profile_id);

CREATE UNIQUE INDEX groups_pkey ON public.groups USING btree (id);

CREATE INDEX idx_alliances_alliance_leader_group_id ON public.alliances USING btree (alliance_leader_group_id);

CREATE INDEX idx_chain_nodes_chain_id ON public.chain_nodes USING btree (chain_id);

CREATE INDEX idx_chain_nodes_depth ON public.chain_nodes USING btree (depth);

CREATE INDEX idx_chain_nodes_parent_node_id ON public.chain_nodes USING btree (parent_node_id);

CREATE INDEX idx_chain_nodes_work_id ON public.chain_nodes USING btree (work_id);

CREATE INDEX idx_chains_creator_type ON public.chains USING btree (creator_type);

CREATE INDEX idx_chains_user_profile_id ON public.chains USING btree (user_profile_id);

CREATE INDEX idx_deleted_records_log_deleted_at ON public.deleted_records_log USING btree (deleted_at);

CREATE INDEX idx_deleted_records_log_deleted_by ON public.deleted_records_log USING btree (deleted_by);

CREATE INDEX idx_deleted_records_log_table_name ON public.deleted_records_log USING btree (table_name);

CREATE INDEX idx_error_logs_error_type ON public.error_logs USING btree (error_type);

CREATE INDEX idx_error_logs_occurred_at ON public.error_logs USING btree (occurred_at);

CREATE INDEX idx_error_logs_user_id ON public.error_logs USING btree (user_id);

CREATE INDEX idx_genres_category_id ON public.genres USING btree (category_id);

CREATE INDEX idx_group_members_group_id ON public.group_members USING btree (group_id);

CREATE INDEX idx_group_members_role ON public.group_members USING btree (role);

CREATE INDEX idx_group_members_status ON public.group_members USING btree (status);

CREATE INDEX idx_group_members_user_profile_id ON public.group_members USING btree (user_profile_id);

CREATE INDEX idx_groups_leader_user_profile_id ON public.groups USING btree (leader_user_profile_id);

CREATE INDEX idx_groups_status ON public.groups USING btree (status);

CREATE INDEX idx_groups_visibility ON public.groups USING btree (visibility);

CREATE INDEX idx_lists_creator_type ON public.lists USING btree (creator_type);

CREATE INDEX idx_lists_list_type ON public.lists USING btree (list_type);

CREATE INDEX idx_lists_user_profile_id ON public.lists USING btree (user_profile_id);

CREATE INDEX idx_login_attempts_attempted_at ON public.login_attempts USING btree (attempted_at);

CREATE INDEX idx_login_attempts_email ON public.login_attempts USING btree (email);

CREATE INDEX idx_login_attempts_ip_address ON public.login_attempts USING btree (ip_address);

CREATE INDEX idx_mandala_sheet_cells_content_skill_id ON public.mandala_sheet_cells USING btree (content_skill_id);

CREATE INDEX idx_mandala_sheet_cells_mandala_sheet_id ON public.mandala_sheet_cells USING btree (mandala_sheet_id);

CREATE INDEX idx_mandala_sheets_user_profile_id ON public.mandala_sheets USING btree (user_profile_id);

CREATE INDEX idx_notifications_created_at ON public.notifications USING btree (created_at);

CREATE INDEX idx_notifications_is_read ON public.notifications USING btree (is_read);

CREATE INDEX idx_notifications_recipient_user_profile_id ON public.notifications USING btree (recipient_user_profile_id);

CREATE INDEX idx_penalties_penalty_type ON public.penalties USING btree (penalty_type);

CREATE INDEX idx_penalties_target_route_account_id ON public.penalties USING btree (target_route_account_id);

CREATE INDEX idx_penalties_target_user_profile_id ON public.penalties USING btree (target_user_profile_id);

CREATE INDEX idx_performance_metrics_endpoint ON public.performance_metrics USING btree (endpoint);

CREATE INDEX idx_performance_metrics_recorded_at ON public.performance_metrics USING btree (recorded_at);

CREATE INDEX idx_point_transactions_route_account_id ON public.point_transactions USING btree (route_account_id);

CREATE INDEX idx_point_transactions_transaction_date ON public.point_transactions USING btree (transaction_date);

CREATE INDEX idx_point_transactions_transaction_type ON public.point_transactions USING btree (transaction_type);

CREATE INDEX idx_point_transactions_user_profile_id ON public.point_transactions USING btree (user_profile_id);

CREATE INDEX idx_relationships_source_user_profile ON public.relationships USING btree (source_user_profile_id);

CREATE INDEX idx_relationships_target_user_profile ON public.relationships USING btree (target_user_profile_id);

CREATE INDEX idx_relationships_type ON public.relationships USING btree (relationship_type);

CREATE INDEX idx_route_accounts_email ON public.route_accounts USING btree (email);

CREATE INDEX idx_route_accounts_last_login ON public.route_accounts USING btree (last_login_at);

CREATE INDEX idx_route_accounts_mother_tongue ON public.route_accounts USING btree (mother_tongue_code);

CREATE INDEX idx_route_accounts_site_language ON public.route_accounts USING btree (site_language_code);

CREATE INDEX idx_security_incidents_detected_at ON public.security_incidents USING btree (detected_at);

CREATE INDEX idx_security_incidents_incident_type ON public.security_incidents USING btree (incident_type);

CREATE INDEX idx_security_incidents_severity ON public.security_incidents USING btree (severity);

CREATE INDEX idx_skill_progress_history_skill_id ON public.skill_progress_history USING btree (skill_id);

CREATE INDEX idx_skill_progress_history_updated_at ON public.skill_progress_history USING btree (updated_at);

CREATE INDEX idx_skill_progress_history_user_profile_id ON public.skill_progress_history USING btree (user_profile_id);

CREATE INDEX idx_skills_creator_type ON public.skills USING btree (creator_type);

CREATE INDEX idx_skills_name ON public.skills USING btree (name);

CREATE INDEX idx_tags_creator_type ON public.tags USING btree (creator_type);

CREATE INDEX idx_tags_name ON public.tags USING btree (name);

CREATE INDEX idx_translations_language_code ON public.translations USING btree (language_code);

CREATE INDEX idx_translations_table_column_row ON public.translations USING btree (table_name, column_name, row_id);

CREATE INDEX idx_user_activity_log_action_type ON public.user_activity_log USING btree (action_type);

CREATE INDEX idx_user_activity_log_created_at ON public.user_activity_log USING btree (created_at);

CREATE INDEX idx_user_activity_log_user_id ON public.user_activity_log USING btree (user_id);

CREATE INDEX idx_user_profile_favorite_works_tier ON public.user_profile_favorite_works USING btree (evaluation_tier);

CREATE INDEX idx_user_profile_favorite_works_time_segment ON public.user_profile_favorite_works USING btree (time_segment);

CREATE INDEX idx_user_profile_favorite_works_user_profile ON public.user_profile_favorite_works USING btree (user_profile_id);

CREATE INDEX idx_user_profile_favorite_works_work ON public.user_profile_favorite_works USING btree (work_id);

CREATE INDEX idx_user_profile_selected_values_user_profile ON public.user_profile_selected_values USING btree (user_profile_id);

CREATE INDEX idx_user_profile_selected_values_value_theme ON public.user_profile_selected_values USING btree (value_theme_id);

CREATE INDEX idx_user_profile_skills_level ON public.user_profile_skills USING btree (skill_level);

CREATE INDEX idx_user_profile_skills_skill ON public.user_profile_skills USING btree (skill_id);

CREATE INDEX idx_user_profile_skills_user_profile ON public.user_profile_skills USING btree (user_profile_id);

CREATE INDEX idx_user_profiles_profile_type ON public.user_profiles USING btree (profile_type);

CREATE INDEX idx_user_profiles_route_account_id ON public.user_profiles USING btree (route_account_id);

CREATE INDEX idx_user_profiles_status ON public.user_profiles USING btree (status);

CREATE INDEX idx_value_choices_display_order ON public.value_choices USING btree (display_order);

CREATE INDEX idx_value_choices_value_theme_id ON public.value_choices USING btree (value_theme_id);

CREATE INDEX idx_value_selection_history_selected_at ON public.value_selection_history USING btree (selected_at);

CREATE INDEX idx_value_selection_history_user_profile_id ON public.value_selection_history USING btree (user_profile_id);

CREATE INDEX idx_value_selection_history_value_theme_id ON public.value_selection_history USING btree (value_theme_id);

CREATE INDEX idx_value_themes_category_id ON public.value_themes USING btree (category_id);

CREATE INDEX idx_value_themes_creator_type ON public.value_themes USING btree (creator_type);

CREATE INDEX idx_value_themes_user_profile_id ON public.value_themes USING btree (user_profile_id);

CREATE INDEX idx_work_authors_author_name ON public.work_authors USING btree (author_name);

CREATE INDEX idx_work_authors_work_id ON public.work_authors USING btree (work_id);

CREATE INDEX idx_work_evaluation_history_evaluated_at ON public.work_evaluation_history USING btree (evaluated_at);

CREATE INDEX idx_work_evaluation_history_user_profile_id ON public.work_evaluation_history USING btree (user_profile_id);

CREATE INDEX idx_work_evaluation_history_work_id ON public.work_evaluation_history USING btree (work_id);

CREATE INDEX idx_works_category_id ON public.works USING btree (category_id);

CREATE INDEX idx_works_creator_type ON public.works USING btree (creator_type);

CREATE INDEX idx_works_genre_id ON public.works USING btree (genre_id);

CREATE INDEX idx_works_release_year ON public.works USING btree (release_year);

CREATE INDEX idx_works_title ON public.works USING btree (title);

CREATE INDEX idx_works_user_profile_id ON public.works USING btree (user_profile_id);

CREATE UNIQUE INDEX languages_pkey ON public.languages USING btree (id);

CREATE UNIQUE INDEX lists_pkey ON public.lists USING btree (id);

CREATE UNIQUE INDEX login_attempts_pkey ON public.login_attempts USING btree (id);

CREATE UNIQUE INDEX mandala_sheet_cells_mandala_sheet_id_row_index_column_index_key ON public.mandala_sheet_cells USING btree (mandala_sheet_id, row_index, column_index);

CREATE UNIQUE INDEX mandala_sheet_cells_pkey ON public.mandala_sheet_cells USING btree (id);

CREATE UNIQUE INDEX mandala_sheets_pkey ON public.mandala_sheets USING btree (id);

CREATE UNIQUE INDEX notifications_pkey ON public.notifications USING btree (id);

CREATE UNIQUE INDEX penalties_pkey ON public.penalties USING btree (id);

CREATE UNIQUE INDEX performance_metrics_pkey ON public.performance_metrics USING btree (id);

CREATE UNIQUE INDEX point_transactions_pkey ON public.point_transactions USING btree (id);

CREATE UNIQUE INDEX relationships_pkey ON public.relationships USING btree (source_user_profile_id, target_user_profile_id);

CREATE UNIQUE INDEX route_accounts_email_key ON public.route_accounts USING btree (email);

CREATE UNIQUE INDEX route_accounts_pkey ON public.route_accounts USING btree (id);

CREATE UNIQUE INDEX security_incidents_pkey ON public.security_incidents USING btree (id);

CREATE UNIQUE INDEX skill_progress_history_pkey ON public.skill_progress_history USING btree (id);

CREATE UNIQUE INDEX skills_name_key ON public.skills USING btree (name);

CREATE UNIQUE INDEX skills_pkey ON public.skills USING btree (id);

CREATE UNIQUE INDEX tags_name_key ON public.tags USING btree (name);

CREATE UNIQUE INDEX tags_pkey ON public.tags USING btree (id);

CREATE UNIQUE INDEX translations_pkey ON public.translations USING btree (id);

CREATE UNIQUE INDEX translations_table_name_column_name_row_id_language_code_key ON public.translations USING btree (table_name, column_name, row_id, language_code);

CREATE UNIQUE INDEX user_activity_log_pkey ON public.user_activity_log USING btree (id);

CREATE UNIQUE INDEX user_profile_favorite_works_pkey ON public.user_profile_favorite_works USING btree (user_profile_id, work_id);

CREATE UNIQUE INDEX user_profile_selected_values_pkey ON public.user_profile_selected_values USING btree (user_profile_id, value_theme_id, value_choice_id);

CREATE UNIQUE INDEX user_profile_skills_pkey ON public.user_profile_skills USING btree (user_profile_id, skill_id);

CREATE UNIQUE INDEX user_profiles_pkey ON public.user_profiles USING btree (id);

CREATE UNIQUE INDEX value_choices_pkey ON public.value_choices USING btree (id);

CREATE UNIQUE INDEX value_selection_history_pkey ON public.value_selection_history USING btree (id);

CREATE UNIQUE INDEX value_theme_tags_pkey ON public.value_theme_tags USING btree (value_theme_id, tag_id);

CREATE UNIQUE INDEX value_themes_pkey ON public.value_themes USING btree (id);

CREATE UNIQUE INDEX work_authors_pkey ON public.work_authors USING btree (id);

CREATE UNIQUE INDEX work_evaluation_history_pkey ON public.work_evaluation_history USING btree (id);

CREATE UNIQUE INDEX work_tags_pkey ON public.work_tags USING btree (work_id, tag_id);

CREATE UNIQUE INDEX works_pkey ON public.works USING btree (id);

alter table "public"."alliance_groups" add constraint "alliance_groups_pkey" PRIMARY KEY using index "alliance_groups_pkey";

alter table "public"."alliances" add constraint "alliances_pkey" PRIMARY KEY using index "alliances_pkey";

alter table "public"."categories" add constraint "categories_pkey" PRIMARY KEY using index "categories_pkey";

alter table "public"."chain_nodes" add constraint "chain_nodes_pkey" PRIMARY KEY using index "chain_nodes_pkey";

alter table "public"."chains" add constraint "chains_pkey" PRIMARY KEY using index "chains_pkey";

alter table "public"."deleted_records_log" add constraint "deleted_records_log_pkey" PRIMARY KEY using index "deleted_records_log_pkey";

alter table "public"."error_logs" add constraint "error_logs_pkey" PRIMARY KEY using index "error_logs_pkey";

alter table "public"."genres" add constraint "genres_pkey" PRIMARY KEY using index "genres_pkey";

alter table "public"."group_members" add constraint "group_members_pkey" PRIMARY KEY using index "group_members_pkey";

alter table "public"."groups" add constraint "groups_pkey" PRIMARY KEY using index "groups_pkey";

alter table "public"."languages" add constraint "languages_pkey" PRIMARY KEY using index "languages_pkey";

alter table "public"."lists" add constraint "lists_pkey" PRIMARY KEY using index "lists_pkey";

alter table "public"."login_attempts" add constraint "login_attempts_pkey" PRIMARY KEY using index "login_attempts_pkey";

alter table "public"."mandala_sheet_cells" add constraint "mandala_sheet_cells_pkey" PRIMARY KEY using index "mandala_sheet_cells_pkey";

alter table "public"."mandala_sheets" add constraint "mandala_sheets_pkey" PRIMARY KEY using index "mandala_sheets_pkey";

alter table "public"."notifications" add constraint "notifications_pkey" PRIMARY KEY using index "notifications_pkey";

alter table "public"."penalties" add constraint "penalties_pkey" PRIMARY KEY using index "penalties_pkey";

alter table "public"."performance_metrics" add constraint "performance_metrics_pkey" PRIMARY KEY using index "performance_metrics_pkey";

alter table "public"."point_transactions" add constraint "point_transactions_pkey" PRIMARY KEY using index "point_transactions_pkey";

alter table "public"."relationships" add constraint "relationships_pkey" PRIMARY KEY using index "relationships_pkey";

alter table "public"."route_accounts" add constraint "route_accounts_pkey" PRIMARY KEY using index "route_accounts_pkey";

alter table "public"."security_incidents" add constraint "security_incidents_pkey" PRIMARY KEY using index "security_incidents_pkey";

alter table "public"."skill_progress_history" add constraint "skill_progress_history_pkey" PRIMARY KEY using index "skill_progress_history_pkey";

alter table "public"."skills" add constraint "skills_pkey" PRIMARY KEY using index "skills_pkey";

alter table "public"."tags" add constraint "tags_pkey" PRIMARY KEY using index "tags_pkey";

alter table "public"."translations" add constraint "translations_pkey" PRIMARY KEY using index "translations_pkey";

alter table "public"."user_activity_log" add constraint "user_activity_log_pkey" PRIMARY KEY using index "user_activity_log_pkey";

alter table "public"."user_profile_favorite_works" add constraint "user_profile_favorite_works_pkey" PRIMARY KEY using index "user_profile_favorite_works_pkey";

alter table "public"."user_profile_selected_values" add constraint "user_profile_selected_values_pkey" PRIMARY KEY using index "user_profile_selected_values_pkey";

alter table "public"."user_profile_skills" add constraint "user_profile_skills_pkey" PRIMARY KEY using index "user_profile_skills_pkey";

alter table "public"."user_profiles" add constraint "user_profiles_pkey" PRIMARY KEY using index "user_profiles_pkey";

alter table "public"."value_choices" add constraint "value_choices_pkey" PRIMARY KEY using index "value_choices_pkey";

alter table "public"."value_selection_history" add constraint "value_selection_history_pkey" PRIMARY KEY using index "value_selection_history_pkey";

alter table "public"."value_theme_tags" add constraint "value_theme_tags_pkey" PRIMARY KEY using index "value_theme_tags_pkey";

alter table "public"."value_themes" add constraint "value_themes_pkey" PRIMARY KEY using index "value_themes_pkey";

alter table "public"."work_authors" add constraint "work_authors_pkey" PRIMARY KEY using index "work_authors_pkey";

alter table "public"."work_evaluation_history" add constraint "work_evaluation_history_pkey" PRIMARY KEY using index "work_evaluation_history_pkey";

alter table "public"."work_tags" add constraint "work_tags_pkey" PRIMARY KEY using index "work_tags_pkey";

alter table "public"."works" add constraint "works_pkey" PRIMARY KEY using index "works_pkey";

alter table "public"."alliance_groups" add constraint "alliance_groups_alliance_id_fkey" FOREIGN KEY (alliance_id) REFERENCES alliances(id) ON DELETE CASCADE not valid;

alter table "public"."alliance_groups" validate constraint "alliance_groups_alliance_id_fkey";

alter table "public"."alliance_groups" add constraint "alliance_groups_group_id_fkey" FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE not valid;

alter table "public"."alliance_groups" validate constraint "alliance_groups_group_id_fkey";

alter table "public"."alliances" add constraint "alliances_alliance_leader_group_id_fkey" FOREIGN KEY (alliance_leader_group_id) REFERENCES groups(id) not valid;

alter table "public"."alliances" validate constraint "alliances_alliance_leader_group_id_fkey";

alter table "public"."categories" add constraint "categories_name_key" UNIQUE using index "categories_name_key";

alter table "public"."chain_nodes" add constraint "chain_nodes_chain_id_fkey" FOREIGN KEY (chain_id) REFERENCES chains(id) ON DELETE CASCADE not valid;

alter table "public"."chain_nodes" validate constraint "chain_nodes_chain_id_fkey";

alter table "public"."chain_nodes" add constraint "chain_nodes_parent_node_id_fkey" FOREIGN KEY (parent_node_id) REFERENCES chain_nodes(id) not valid;

alter table "public"."chain_nodes" validate constraint "chain_nodes_parent_node_id_fkey";

alter table "public"."chain_nodes" add constraint "chain_nodes_work_id_fkey" FOREIGN KEY (work_id) REFERENCES works(id) ON DELETE CASCADE not valid;

alter table "public"."chain_nodes" validate constraint "chain_nodes_work_id_fkey";

alter table "public"."chains" add constraint "chains_check" CHECK ((((creator_type = 'official'::creator_type) AND (user_profile_id IS NULL)) OR ((creator_type = 'user_created'::creator_type) AND (user_profile_id IS NOT NULL)))) not valid;

alter table "public"."chains" validate constraint "chains_check";

alter table "public"."chains" add constraint "chains_user_profile_id_fkey" FOREIGN KEY (user_profile_id) REFERENCES user_profiles(id) not valid;

alter table "public"."chains" validate constraint "chains_user_profile_id_fkey";

alter table "public"."genres" add constraint "genres_category_id_fkey" FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE not valid;

alter table "public"."genres" validate constraint "genres_category_id_fkey";

alter table "public"."genres" add constraint "genres_category_id_name_key" UNIQUE using index "genres_category_id_name_key";

alter table "public"."group_members" add constraint "group_members_group_id_fkey" FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE not valid;

alter table "public"."group_members" validate constraint "group_members_group_id_fkey";

alter table "public"."group_members" add constraint "group_members_user_profile_id_fkey" FOREIGN KEY (user_profile_id) REFERENCES user_profiles(id) ON DELETE CASCADE not valid;

alter table "public"."group_members" validate constraint "group_members_user_profile_id_fkey";

alter table "public"."groups" add constraint "groups_leader_user_profile_id_fkey" FOREIGN KEY (leader_user_profile_id) REFERENCES user_profiles(id) not valid;

alter table "public"."groups" validate constraint "groups_leader_user_profile_id_fkey";

alter table "public"."lists" add constraint "lists_user_profile_id_fkey" FOREIGN KEY (user_profile_id) REFERENCES user_profiles(id) ON DELETE CASCADE not valid;

alter table "public"."lists" validate constraint "lists_user_profile_id_fkey";

alter table "public"."mandala_sheet_cells" add constraint "mandala_sheet_cells_check" CHECK ((((content_type = 'skill'::mandala_content_type) AND (content_skill_id IS NOT NULL) AND (content_text IS NULL)) OR ((content_type = ANY (ARRAY['sub_theme'::mandala_content_type, 'text'::mandala_content_type])) AND (content_skill_id IS NULL) AND (content_text IS NOT NULL)))) not valid;

alter table "public"."mandala_sheet_cells" validate constraint "mandala_sheet_cells_check";

alter table "public"."mandala_sheet_cells" add constraint "mandala_sheet_cells_column_index_check" CHECK (((column_index >= 0) AND (column_index <= 8))) not valid;

alter table "public"."mandala_sheet_cells" validate constraint "mandala_sheet_cells_column_index_check";

alter table "public"."mandala_sheet_cells" add constraint "mandala_sheet_cells_content_skill_id_fkey" FOREIGN KEY (content_skill_id) REFERENCES skills(id) not valid;

alter table "public"."mandala_sheet_cells" validate constraint "mandala_sheet_cells_content_skill_id_fkey";

alter table "public"."mandala_sheet_cells" add constraint "mandala_sheet_cells_mandala_sheet_id_fkey" FOREIGN KEY (mandala_sheet_id) REFERENCES mandala_sheets(id) ON DELETE CASCADE not valid;

alter table "public"."mandala_sheet_cells" validate constraint "mandala_sheet_cells_mandala_sheet_id_fkey";

alter table "public"."mandala_sheet_cells" add constraint "mandala_sheet_cells_mandala_sheet_id_row_index_column_index_key" UNIQUE using index "mandala_sheet_cells_mandala_sheet_id_row_index_column_index_key";

alter table "public"."mandala_sheet_cells" add constraint "mandala_sheet_cells_row_index_check" CHECK (((row_index >= 0) AND (row_index <= 8))) not valid;

alter table "public"."mandala_sheet_cells" validate constraint "mandala_sheet_cells_row_index_check";

alter table "public"."mandala_sheets" add constraint "mandala_sheets_user_profile_id_fkey" FOREIGN KEY (user_profile_id) REFERENCES user_profiles(id) ON DELETE CASCADE not valid;

alter table "public"."mandala_sheets" validate constraint "mandala_sheets_user_profile_id_fkey";

alter table "public"."notifications" add constraint "notifications_recipient_user_profile_id_fkey" FOREIGN KEY (recipient_user_profile_id) REFERENCES user_profiles(id) ON DELETE CASCADE not valid;

alter table "public"."notifications" validate constraint "notifications_recipient_user_profile_id_fkey";

alter table "public"."penalties" add constraint "penalties_check" CHECK ((((target_route_account_id IS NOT NULL) AND (target_user_profile_id IS NULL)) OR ((target_route_account_id IS NULL) AND (target_user_profile_id IS NOT NULL)))) not valid;

alter table "public"."penalties" validate constraint "penalties_check";

alter table "public"."penalties" add constraint "penalties_target_route_account_id_fkey" FOREIGN KEY (target_route_account_id) REFERENCES route_accounts(id) not valid;

alter table "public"."penalties" validate constraint "penalties_target_route_account_id_fkey";

alter table "public"."penalties" add constraint "penalties_target_user_profile_id_fkey" FOREIGN KEY (target_user_profile_id) REFERENCES user_profiles(id) not valid;

alter table "public"."penalties" validate constraint "penalties_target_user_profile_id_fkey";

alter table "public"."point_transactions" add constraint "point_transactions_check" CHECK ((((route_account_id IS NOT NULL) AND (user_profile_id IS NULL)) OR ((route_account_id IS NULL) AND (user_profile_id IS NOT NULL)))) not valid;

alter table "public"."point_transactions" validate constraint "point_transactions_check";

alter table "public"."point_transactions" add constraint "point_transactions_route_account_id_fkey" FOREIGN KEY (route_account_id) REFERENCES route_accounts(id) not valid;

alter table "public"."point_transactions" validate constraint "point_transactions_route_account_id_fkey";

alter table "public"."point_transactions" add constraint "point_transactions_user_profile_id_fkey" FOREIGN KEY (user_profile_id) REFERENCES user_profiles(id) not valid;

alter table "public"."point_transactions" validate constraint "point_transactions_user_profile_id_fkey";

alter table "public"."relationships" add constraint "relationships_check" CHECK ((source_user_profile_id <> target_user_profile_id)) not valid;

alter table "public"."relationships" validate constraint "relationships_check";

alter table "public"."relationships" add constraint "relationships_group_context_id_fkey" FOREIGN KEY (group_context_id) REFERENCES groups(id) not valid;

alter table "public"."relationships" validate constraint "relationships_group_context_id_fkey";

alter table "public"."relationships" add constraint "relationships_source_user_profile_id_fkey" FOREIGN KEY (source_user_profile_id) REFERENCES user_profiles(id) ON DELETE CASCADE not valid;

alter table "public"."relationships" validate constraint "relationships_source_user_profile_id_fkey";

alter table "public"."relationships" add constraint "relationships_target_user_profile_id_fkey" FOREIGN KEY (target_user_profile_id) REFERENCES user_profiles(id) ON DELETE CASCADE not valid;

alter table "public"."relationships" validate constraint "relationships_target_user_profile_id_fkey";

alter table "public"."route_accounts" add constraint "route_accounts_email_key" UNIQUE using index "route_accounts_email_key";

alter table "public"."route_accounts" add constraint "route_accounts_mother_tongue_code_fkey" FOREIGN KEY (mother_tongue_code) REFERENCES languages(id) not valid;

alter table "public"."route_accounts" validate constraint "route_accounts_mother_tongue_code_fkey";

alter table "public"."route_accounts" add constraint "route_accounts_site_language_code_fkey" FOREIGN KEY (site_language_code) REFERENCES languages(id) not valid;

alter table "public"."route_accounts" validate constraint "route_accounts_site_language_code_fkey";

alter table "public"."route_accounts" add constraint "route_accounts_total_points_check" CHECK ((total_points >= 0)) not valid;

alter table "public"."route_accounts" validate constraint "route_accounts_total_points_check";

alter table "public"."route_accounts" add constraint "route_accounts_warning_count_check" CHECK ((warning_count >= 0)) not valid;

alter table "public"."route_accounts" validate constraint "route_accounts_warning_count_check";

alter table "public"."skill_progress_history" add constraint "skill_progress_history_skill_id_fkey" FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE not valid;

alter table "public"."skill_progress_history" validate constraint "skill_progress_history_skill_id_fkey";

alter table "public"."skill_progress_history" add constraint "skill_progress_history_user_profile_id_fkey" FOREIGN KEY (user_profile_id) REFERENCES user_profiles(id) ON DELETE CASCADE not valid;

alter table "public"."skill_progress_history" validate constraint "skill_progress_history_user_profile_id_fkey";

alter table "public"."skills" add constraint "skills_name_key" UNIQUE using index "skills_name_key";

alter table "public"."tags" add constraint "tags_name_key" UNIQUE using index "tags_name_key";

alter table "public"."translations" add constraint "translations_language_code_fkey" FOREIGN KEY (language_code) REFERENCES languages(id) not valid;

alter table "public"."translations" validate constraint "translations_language_code_fkey";

alter table "public"."translations" add constraint "translations_table_name_column_name_row_id_language_code_key" UNIQUE using index "translations_table_name_column_name_row_id_language_code_key";

alter table "public"."user_profile_favorite_works" add constraint "user_profile_favorite_works_user_profile_id_fkey" FOREIGN KEY (user_profile_id) REFERENCES user_profiles(id) ON DELETE CASCADE not valid;

alter table "public"."user_profile_favorite_works" validate constraint "user_profile_favorite_works_user_profile_id_fkey";

alter table "public"."user_profile_favorite_works" add constraint "user_profile_favorite_works_work_id_fkey" FOREIGN KEY (work_id) REFERENCES works(id) ON DELETE CASCADE not valid;

alter table "public"."user_profile_favorite_works" validate constraint "user_profile_favorite_works_work_id_fkey";

alter table "public"."user_profile_selected_values" add constraint "user_profile_selected_values_user_profile_id_fkey" FOREIGN KEY (user_profile_id) REFERENCES user_profiles(id) ON DELETE CASCADE not valid;

alter table "public"."user_profile_selected_values" validate constraint "user_profile_selected_values_user_profile_id_fkey";

alter table "public"."user_profile_selected_values" add constraint "user_profile_selected_values_value_choice_id_fkey" FOREIGN KEY (value_choice_id) REFERENCES value_choices(id) ON DELETE CASCADE not valid;

alter table "public"."user_profile_selected_values" validate constraint "user_profile_selected_values_value_choice_id_fkey";

alter table "public"."user_profile_selected_values" add constraint "user_profile_selected_values_value_theme_id_fkey" FOREIGN KEY (value_theme_id) REFERENCES value_themes(id) ON DELETE CASCADE not valid;

alter table "public"."user_profile_selected_values" validate constraint "user_profile_selected_values_value_theme_id_fkey";

alter table "public"."user_profile_skills" add constraint "user_profile_skills_skill_id_fkey" FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE not valid;

alter table "public"."user_profile_skills" validate constraint "user_profile_skills_skill_id_fkey";

alter table "public"."user_profile_skills" add constraint "user_profile_skills_user_profile_id_fkey" FOREIGN KEY (user_profile_id) REFERENCES user_profiles(id) ON DELETE CASCADE not valid;

alter table "public"."user_profile_skills" validate constraint "user_profile_skills_user_profile_id_fkey";

alter table "public"."user_profiles" add constraint "user_profiles_route_account_id_fkey" FOREIGN KEY (route_account_id) REFERENCES route_accounts(id) ON DELETE CASCADE not valid;

alter table "public"."user_profiles" validate constraint "user_profiles_route_account_id_fkey";

alter table "public"."value_choices" add constraint "value_choices_value_theme_id_fkey" FOREIGN KEY (value_theme_id) REFERENCES value_themes(id) ON DELETE CASCADE not valid;

alter table "public"."value_choices" validate constraint "value_choices_value_theme_id_fkey";

alter table "public"."value_selection_history" add constraint "value_selection_history_user_profile_id_fkey" FOREIGN KEY (user_profile_id) REFERENCES user_profiles(id) ON DELETE CASCADE not valid;

alter table "public"."value_selection_history" validate constraint "value_selection_history_user_profile_id_fkey";

alter table "public"."value_selection_history" add constraint "value_selection_history_value_theme_id_fkey" FOREIGN KEY (value_theme_id) REFERENCES value_themes(id) ON DELETE CASCADE not valid;

alter table "public"."value_selection_history" validate constraint "value_selection_history_value_theme_id_fkey";

alter table "public"."value_theme_tags" add constraint "value_theme_tags_tag_id_fkey" FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE not valid;

alter table "public"."value_theme_tags" validate constraint "value_theme_tags_tag_id_fkey";

alter table "public"."value_theme_tags" add constraint "value_theme_tags_value_theme_id_fkey" FOREIGN KEY (value_theme_id) REFERENCES value_themes(id) ON DELETE CASCADE not valid;

alter table "public"."value_theme_tags" validate constraint "value_theme_tags_value_theme_id_fkey";

alter table "public"."value_themes" add constraint "value_themes_category_id_fkey" FOREIGN KEY (category_id) REFERENCES categories(id) not valid;

alter table "public"."value_themes" validate constraint "value_themes_category_id_fkey";

alter table "public"."value_themes" add constraint "value_themes_check" CHECK ((((creator_type = 'official'::creator_type) AND (user_profile_id IS NULL)) OR ((creator_type = 'user_created'::creator_type) AND (user_profile_id IS NOT NULL)))) not valid;

alter table "public"."value_themes" validate constraint "value_themes_check";

alter table "public"."value_themes" add constraint "value_themes_user_profile_id_fkey" FOREIGN KEY (user_profile_id) REFERENCES user_profiles(id) not valid;

alter table "public"."value_themes" validate constraint "value_themes_user_profile_id_fkey";

alter table "public"."work_authors" add constraint "work_authors_work_id_fkey" FOREIGN KEY (work_id) REFERENCES works(id) ON DELETE CASCADE not valid;

alter table "public"."work_authors" validate constraint "work_authors_work_id_fkey";

alter table "public"."work_evaluation_history" add constraint "work_evaluation_history_user_profile_id_fkey" FOREIGN KEY (user_profile_id) REFERENCES user_profiles(id) ON DELETE CASCADE not valid;

alter table "public"."work_evaluation_history" validate constraint "work_evaluation_history_user_profile_id_fkey";

alter table "public"."work_evaluation_history" add constraint "work_evaluation_history_work_id_fkey" FOREIGN KEY (work_id) REFERENCES works(id) ON DELETE CASCADE not valid;

alter table "public"."work_evaluation_history" validate constraint "work_evaluation_history_work_id_fkey";

alter table "public"."work_tags" add constraint "work_tags_tag_id_fkey" FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE not valid;

alter table "public"."work_tags" validate constraint "work_tags_tag_id_fkey";

alter table "public"."work_tags" add constraint "work_tags_work_id_fkey" FOREIGN KEY (work_id) REFERENCES works(id) ON DELETE CASCADE not valid;

alter table "public"."work_tags" validate constraint "work_tags_work_id_fkey";

alter table "public"."works" add constraint "works_category_id_fkey" FOREIGN KEY (category_id) REFERENCES categories(id) not valid;

alter table "public"."works" validate constraint "works_category_id_fkey";

alter table "public"."works" add constraint "works_check" CHECK ((((creator_type = 'official'::creator_type) AND (user_profile_id IS NULL)) OR ((creator_type = 'user_created'::creator_type) AND (user_profile_id IS NOT NULL)))) not valid;

alter table "public"."works" validate constraint "works_check";

alter table "public"."works" add constraint "works_genre_id_fkey" FOREIGN KEY (genre_id) REFERENCES genres(id) not valid;

alter table "public"."works" validate constraint "works_genre_id_fkey";

alter table "public"."works" add constraint "works_user_profile_id_fkey" FOREIGN KEY (user_profile_id) REFERENCES user_profiles(id) not valid;

alter table "public"."works" validate constraint "works_user_profile_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.root_account (id, aud, role, email, email_confirmed_at, last_sign_in_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
  VALUES (NEW.id, NEW.aud, NEW.role, NEW.email, NEW.email_confirmed_at, NEW.last_sign_in_at, NEW.created_at, NEW.updated_at, NEW.raw_app_meta_data, NEW.raw_user_meta_data);
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$
;

grant delete on table "public"."alliance_groups" to "anon";

grant insert on table "public"."alliance_groups" to "anon";

grant references on table "public"."alliance_groups" to "anon";

grant select on table "public"."alliance_groups" to "anon";

grant trigger on table "public"."alliance_groups" to "anon";

grant truncate on table "public"."alliance_groups" to "anon";

grant update on table "public"."alliance_groups" to "anon";

grant delete on table "public"."alliance_groups" to "authenticated";

grant insert on table "public"."alliance_groups" to "authenticated";

grant references on table "public"."alliance_groups" to "authenticated";

grant select on table "public"."alliance_groups" to "authenticated";

grant trigger on table "public"."alliance_groups" to "authenticated";

grant truncate on table "public"."alliance_groups" to "authenticated";

grant update on table "public"."alliance_groups" to "authenticated";

grant delete on table "public"."alliance_groups" to "service_role";

grant insert on table "public"."alliance_groups" to "service_role";

grant references on table "public"."alliance_groups" to "service_role";

grant select on table "public"."alliance_groups" to "service_role";

grant trigger on table "public"."alliance_groups" to "service_role";

grant truncate on table "public"."alliance_groups" to "service_role";

grant update on table "public"."alliance_groups" to "service_role";

grant delete on table "public"."alliances" to "anon";

grant insert on table "public"."alliances" to "anon";

grant references on table "public"."alliances" to "anon";

grant select on table "public"."alliances" to "anon";

grant trigger on table "public"."alliances" to "anon";

grant truncate on table "public"."alliances" to "anon";

grant update on table "public"."alliances" to "anon";

grant delete on table "public"."alliances" to "authenticated";

grant insert on table "public"."alliances" to "authenticated";

grant references on table "public"."alliances" to "authenticated";

grant select on table "public"."alliances" to "authenticated";

grant trigger on table "public"."alliances" to "authenticated";

grant truncate on table "public"."alliances" to "authenticated";

grant update on table "public"."alliances" to "authenticated";

grant delete on table "public"."alliances" to "service_role";

grant insert on table "public"."alliances" to "service_role";

grant references on table "public"."alliances" to "service_role";

grant select on table "public"."alliances" to "service_role";

grant trigger on table "public"."alliances" to "service_role";

grant truncate on table "public"."alliances" to "service_role";

grant update on table "public"."alliances" to "service_role";

grant delete on table "public"."categories" to "anon";

grant insert on table "public"."categories" to "anon";

grant references on table "public"."categories" to "anon";

grant select on table "public"."categories" to "anon";

grant trigger on table "public"."categories" to "anon";

grant truncate on table "public"."categories" to "anon";

grant update on table "public"."categories" to "anon";

grant delete on table "public"."categories" to "authenticated";

grant insert on table "public"."categories" to "authenticated";

grant references on table "public"."categories" to "authenticated";

grant select on table "public"."categories" to "authenticated";

grant trigger on table "public"."categories" to "authenticated";

grant truncate on table "public"."categories" to "authenticated";

grant update on table "public"."categories" to "authenticated";

grant delete on table "public"."categories" to "service_role";

grant insert on table "public"."categories" to "service_role";

grant references on table "public"."categories" to "service_role";

grant select on table "public"."categories" to "service_role";

grant trigger on table "public"."categories" to "service_role";

grant truncate on table "public"."categories" to "service_role";

grant update on table "public"."categories" to "service_role";

grant delete on table "public"."chain_nodes" to "anon";

grant insert on table "public"."chain_nodes" to "anon";

grant references on table "public"."chain_nodes" to "anon";

grant select on table "public"."chain_nodes" to "anon";

grant trigger on table "public"."chain_nodes" to "anon";

grant truncate on table "public"."chain_nodes" to "anon";

grant update on table "public"."chain_nodes" to "anon";

grant delete on table "public"."chain_nodes" to "authenticated";

grant insert on table "public"."chain_nodes" to "authenticated";

grant references on table "public"."chain_nodes" to "authenticated";

grant select on table "public"."chain_nodes" to "authenticated";

grant trigger on table "public"."chain_nodes" to "authenticated";

grant truncate on table "public"."chain_nodes" to "authenticated";

grant update on table "public"."chain_nodes" to "authenticated";

grant delete on table "public"."chain_nodes" to "service_role";

grant insert on table "public"."chain_nodes" to "service_role";

grant references on table "public"."chain_nodes" to "service_role";

grant select on table "public"."chain_nodes" to "service_role";

grant trigger on table "public"."chain_nodes" to "service_role";

grant truncate on table "public"."chain_nodes" to "service_role";

grant update on table "public"."chain_nodes" to "service_role";

grant delete on table "public"."chains" to "anon";

grant insert on table "public"."chains" to "anon";

grant references on table "public"."chains" to "anon";

grant select on table "public"."chains" to "anon";

grant trigger on table "public"."chains" to "anon";

grant truncate on table "public"."chains" to "anon";

grant update on table "public"."chains" to "anon";

grant delete on table "public"."chains" to "authenticated";

grant insert on table "public"."chains" to "authenticated";

grant references on table "public"."chains" to "authenticated";

grant select on table "public"."chains" to "authenticated";

grant trigger on table "public"."chains" to "authenticated";

grant truncate on table "public"."chains" to "authenticated";

grant update on table "public"."chains" to "authenticated";

grant delete on table "public"."chains" to "service_role";

grant insert on table "public"."chains" to "service_role";

grant references on table "public"."chains" to "service_role";

grant select on table "public"."chains" to "service_role";

grant trigger on table "public"."chains" to "service_role";

grant truncate on table "public"."chains" to "service_role";

grant update on table "public"."chains" to "service_role";

grant delete on table "public"."deleted_records_log" to "anon";

grant insert on table "public"."deleted_records_log" to "anon";

grant references on table "public"."deleted_records_log" to "anon";

grant select on table "public"."deleted_records_log" to "anon";

grant trigger on table "public"."deleted_records_log" to "anon";

grant truncate on table "public"."deleted_records_log" to "anon";

grant update on table "public"."deleted_records_log" to "anon";

grant delete on table "public"."deleted_records_log" to "authenticated";

grant insert on table "public"."deleted_records_log" to "authenticated";

grant references on table "public"."deleted_records_log" to "authenticated";

grant select on table "public"."deleted_records_log" to "authenticated";

grant trigger on table "public"."deleted_records_log" to "authenticated";

grant truncate on table "public"."deleted_records_log" to "authenticated";

grant update on table "public"."deleted_records_log" to "authenticated";

grant delete on table "public"."deleted_records_log" to "service_role";

grant insert on table "public"."deleted_records_log" to "service_role";

grant references on table "public"."deleted_records_log" to "service_role";

grant select on table "public"."deleted_records_log" to "service_role";

grant trigger on table "public"."deleted_records_log" to "service_role";

grant truncate on table "public"."deleted_records_log" to "service_role";

grant update on table "public"."deleted_records_log" to "service_role";

grant delete on table "public"."error_logs" to "anon";

grant insert on table "public"."error_logs" to "anon";

grant references on table "public"."error_logs" to "anon";

grant select on table "public"."error_logs" to "anon";

grant trigger on table "public"."error_logs" to "anon";

grant truncate on table "public"."error_logs" to "anon";

grant update on table "public"."error_logs" to "anon";

grant delete on table "public"."error_logs" to "authenticated";

grant insert on table "public"."error_logs" to "authenticated";

grant references on table "public"."error_logs" to "authenticated";

grant select on table "public"."error_logs" to "authenticated";

grant trigger on table "public"."error_logs" to "authenticated";

grant truncate on table "public"."error_logs" to "authenticated";

grant update on table "public"."error_logs" to "authenticated";

grant delete on table "public"."error_logs" to "service_role";

grant insert on table "public"."error_logs" to "service_role";

grant references on table "public"."error_logs" to "service_role";

grant select on table "public"."error_logs" to "service_role";

grant trigger on table "public"."error_logs" to "service_role";

grant truncate on table "public"."error_logs" to "service_role";

grant update on table "public"."error_logs" to "service_role";

grant delete on table "public"."genres" to "anon";

grant insert on table "public"."genres" to "anon";

grant references on table "public"."genres" to "anon";

grant select on table "public"."genres" to "anon";

grant trigger on table "public"."genres" to "anon";

grant truncate on table "public"."genres" to "anon";

grant update on table "public"."genres" to "anon";

grant delete on table "public"."genres" to "authenticated";

grant insert on table "public"."genres" to "authenticated";

grant references on table "public"."genres" to "authenticated";

grant select on table "public"."genres" to "authenticated";

grant trigger on table "public"."genres" to "authenticated";

grant truncate on table "public"."genres" to "authenticated";

grant update on table "public"."genres" to "authenticated";

grant delete on table "public"."genres" to "service_role";

grant insert on table "public"."genres" to "service_role";

grant references on table "public"."genres" to "service_role";

grant select on table "public"."genres" to "service_role";

grant trigger on table "public"."genres" to "service_role";

grant truncate on table "public"."genres" to "service_role";

grant update on table "public"."genres" to "service_role";

grant delete on table "public"."group_members" to "anon";

grant insert on table "public"."group_members" to "anon";

grant references on table "public"."group_members" to "anon";

grant select on table "public"."group_members" to "anon";

grant trigger on table "public"."group_members" to "anon";

grant truncate on table "public"."group_members" to "anon";

grant update on table "public"."group_members" to "anon";

grant delete on table "public"."group_members" to "authenticated";

grant insert on table "public"."group_members" to "authenticated";

grant references on table "public"."group_members" to "authenticated";

grant select on table "public"."group_members" to "authenticated";

grant trigger on table "public"."group_members" to "authenticated";

grant truncate on table "public"."group_members" to "authenticated";

grant update on table "public"."group_members" to "authenticated";

grant delete on table "public"."group_members" to "service_role";

grant insert on table "public"."group_members" to "service_role";

grant references on table "public"."group_members" to "service_role";

grant select on table "public"."group_members" to "service_role";

grant trigger on table "public"."group_members" to "service_role";

grant truncate on table "public"."group_members" to "service_role";

grant update on table "public"."group_members" to "service_role";

grant delete on table "public"."groups" to "anon";

grant insert on table "public"."groups" to "anon";

grant references on table "public"."groups" to "anon";

grant select on table "public"."groups" to "anon";

grant trigger on table "public"."groups" to "anon";

grant truncate on table "public"."groups" to "anon";

grant update on table "public"."groups" to "anon";

grant delete on table "public"."groups" to "authenticated";

grant insert on table "public"."groups" to "authenticated";

grant references on table "public"."groups" to "authenticated";

grant select on table "public"."groups" to "authenticated";

grant trigger on table "public"."groups" to "authenticated";

grant truncate on table "public"."groups" to "authenticated";

grant update on table "public"."groups" to "authenticated";

grant delete on table "public"."groups" to "service_role";

grant insert on table "public"."groups" to "service_role";

grant references on table "public"."groups" to "service_role";

grant select on table "public"."groups" to "service_role";

grant trigger on table "public"."groups" to "service_role";

grant truncate on table "public"."groups" to "service_role";

grant update on table "public"."groups" to "service_role";

grant delete on table "public"."languages" to "anon";

grant insert on table "public"."languages" to "anon";

grant references on table "public"."languages" to "anon";

grant select on table "public"."languages" to "anon";

grant trigger on table "public"."languages" to "anon";

grant truncate on table "public"."languages" to "anon";

grant update on table "public"."languages" to "anon";

grant delete on table "public"."languages" to "authenticated";

grant insert on table "public"."languages" to "authenticated";

grant references on table "public"."languages" to "authenticated";

grant select on table "public"."languages" to "authenticated";

grant trigger on table "public"."languages" to "authenticated";

grant truncate on table "public"."languages" to "authenticated";

grant update on table "public"."languages" to "authenticated";

grant delete on table "public"."languages" to "service_role";

grant insert on table "public"."languages" to "service_role";

grant references on table "public"."languages" to "service_role";

grant select on table "public"."languages" to "service_role";

grant trigger on table "public"."languages" to "service_role";

grant truncate on table "public"."languages" to "service_role";

grant update on table "public"."languages" to "service_role";

grant delete on table "public"."lists" to "anon";

grant insert on table "public"."lists" to "anon";

grant references on table "public"."lists" to "anon";

grant select on table "public"."lists" to "anon";

grant trigger on table "public"."lists" to "anon";

grant truncate on table "public"."lists" to "anon";

grant update on table "public"."lists" to "anon";

grant delete on table "public"."lists" to "authenticated";

grant insert on table "public"."lists" to "authenticated";

grant references on table "public"."lists" to "authenticated";

grant select on table "public"."lists" to "authenticated";

grant trigger on table "public"."lists" to "authenticated";

grant truncate on table "public"."lists" to "authenticated";

grant update on table "public"."lists" to "authenticated";

grant delete on table "public"."lists" to "service_role";

grant insert on table "public"."lists" to "service_role";

grant references on table "public"."lists" to "service_role";

grant select on table "public"."lists" to "service_role";

grant trigger on table "public"."lists" to "service_role";

grant truncate on table "public"."lists" to "service_role";

grant update on table "public"."lists" to "service_role";

grant delete on table "public"."login_attempts" to "anon";

grant insert on table "public"."login_attempts" to "anon";

grant references on table "public"."login_attempts" to "anon";

grant select on table "public"."login_attempts" to "anon";

grant trigger on table "public"."login_attempts" to "anon";

grant truncate on table "public"."login_attempts" to "anon";

grant update on table "public"."login_attempts" to "anon";

grant delete on table "public"."login_attempts" to "authenticated";

grant insert on table "public"."login_attempts" to "authenticated";

grant references on table "public"."login_attempts" to "authenticated";

grant select on table "public"."login_attempts" to "authenticated";

grant trigger on table "public"."login_attempts" to "authenticated";

grant truncate on table "public"."login_attempts" to "authenticated";

grant update on table "public"."login_attempts" to "authenticated";

grant delete on table "public"."login_attempts" to "service_role";

grant insert on table "public"."login_attempts" to "service_role";

grant references on table "public"."login_attempts" to "service_role";

grant select on table "public"."login_attempts" to "service_role";

grant trigger on table "public"."login_attempts" to "service_role";

grant truncate on table "public"."login_attempts" to "service_role";

grant update on table "public"."login_attempts" to "service_role";

grant delete on table "public"."mandala_sheet_cells" to "anon";

grant insert on table "public"."mandala_sheet_cells" to "anon";

grant references on table "public"."mandala_sheet_cells" to "anon";

grant select on table "public"."mandala_sheet_cells" to "anon";

grant trigger on table "public"."mandala_sheet_cells" to "anon";

grant truncate on table "public"."mandala_sheet_cells" to "anon";

grant update on table "public"."mandala_sheet_cells" to "anon";

grant delete on table "public"."mandala_sheet_cells" to "authenticated";

grant insert on table "public"."mandala_sheet_cells" to "authenticated";

grant references on table "public"."mandala_sheet_cells" to "authenticated";

grant select on table "public"."mandala_sheet_cells" to "authenticated";

grant trigger on table "public"."mandala_sheet_cells" to "authenticated";

grant truncate on table "public"."mandala_sheet_cells" to "authenticated";

grant update on table "public"."mandala_sheet_cells" to "authenticated";

grant delete on table "public"."mandala_sheet_cells" to "service_role";

grant insert on table "public"."mandala_sheet_cells" to "service_role";

grant references on table "public"."mandala_sheet_cells" to "service_role";

grant select on table "public"."mandala_sheet_cells" to "service_role";

grant trigger on table "public"."mandala_sheet_cells" to "service_role";

grant truncate on table "public"."mandala_sheet_cells" to "service_role";

grant update on table "public"."mandala_sheet_cells" to "service_role";

grant delete on table "public"."mandala_sheets" to "anon";

grant insert on table "public"."mandala_sheets" to "anon";

grant references on table "public"."mandala_sheets" to "anon";

grant select on table "public"."mandala_sheets" to "anon";

grant trigger on table "public"."mandala_sheets" to "anon";

grant truncate on table "public"."mandala_sheets" to "anon";

grant update on table "public"."mandala_sheets" to "anon";

grant delete on table "public"."mandala_sheets" to "authenticated";

grant insert on table "public"."mandala_sheets" to "authenticated";

grant references on table "public"."mandala_sheets" to "authenticated";

grant select on table "public"."mandala_sheets" to "authenticated";

grant trigger on table "public"."mandala_sheets" to "authenticated";

grant truncate on table "public"."mandala_sheets" to "authenticated";

grant update on table "public"."mandala_sheets" to "authenticated";

grant delete on table "public"."mandala_sheets" to "service_role";

grant insert on table "public"."mandala_sheets" to "service_role";

grant references on table "public"."mandala_sheets" to "service_role";

grant select on table "public"."mandala_sheets" to "service_role";

grant trigger on table "public"."mandala_sheets" to "service_role";

grant truncate on table "public"."mandala_sheets" to "service_role";

grant update on table "public"."mandala_sheets" to "service_role";

grant delete on table "public"."notifications" to "anon";

grant insert on table "public"."notifications" to "anon";

grant references on table "public"."notifications" to "anon";

grant select on table "public"."notifications" to "anon";

grant trigger on table "public"."notifications" to "anon";

grant truncate on table "public"."notifications" to "anon";

grant update on table "public"."notifications" to "anon";

grant delete on table "public"."notifications" to "authenticated";

grant insert on table "public"."notifications" to "authenticated";

grant references on table "public"."notifications" to "authenticated";

grant select on table "public"."notifications" to "authenticated";

grant trigger on table "public"."notifications" to "authenticated";

grant truncate on table "public"."notifications" to "authenticated";

grant update on table "public"."notifications" to "authenticated";

grant delete on table "public"."notifications" to "service_role";

grant insert on table "public"."notifications" to "service_role";

grant references on table "public"."notifications" to "service_role";

grant select on table "public"."notifications" to "service_role";

grant trigger on table "public"."notifications" to "service_role";

grant truncate on table "public"."notifications" to "service_role";

grant update on table "public"."notifications" to "service_role";

grant delete on table "public"."penalties" to "anon";

grant insert on table "public"."penalties" to "anon";

grant references on table "public"."penalties" to "anon";

grant select on table "public"."penalties" to "anon";

grant trigger on table "public"."penalties" to "anon";

grant truncate on table "public"."penalties" to "anon";

grant update on table "public"."penalties" to "anon";

grant delete on table "public"."penalties" to "authenticated";

grant insert on table "public"."penalties" to "authenticated";

grant references on table "public"."penalties" to "authenticated";

grant select on table "public"."penalties" to "authenticated";

grant trigger on table "public"."penalties" to "authenticated";

grant truncate on table "public"."penalties" to "authenticated";

grant update on table "public"."penalties" to "authenticated";

grant delete on table "public"."penalties" to "service_role";

grant insert on table "public"."penalties" to "service_role";

grant references on table "public"."penalties" to "service_role";

grant select on table "public"."penalties" to "service_role";

grant trigger on table "public"."penalties" to "service_role";

grant truncate on table "public"."penalties" to "service_role";

grant update on table "public"."penalties" to "service_role";

grant delete on table "public"."performance_metrics" to "anon";

grant insert on table "public"."performance_metrics" to "anon";

grant references on table "public"."performance_metrics" to "anon";

grant select on table "public"."performance_metrics" to "anon";

grant trigger on table "public"."performance_metrics" to "anon";

grant truncate on table "public"."performance_metrics" to "anon";

grant update on table "public"."performance_metrics" to "anon";

grant delete on table "public"."performance_metrics" to "authenticated";

grant insert on table "public"."performance_metrics" to "authenticated";

grant references on table "public"."performance_metrics" to "authenticated";

grant select on table "public"."performance_metrics" to "authenticated";

grant trigger on table "public"."performance_metrics" to "authenticated";

grant truncate on table "public"."performance_metrics" to "authenticated";

grant update on table "public"."performance_metrics" to "authenticated";

grant delete on table "public"."performance_metrics" to "service_role";

grant insert on table "public"."performance_metrics" to "service_role";

grant references on table "public"."performance_metrics" to "service_role";

grant select on table "public"."performance_metrics" to "service_role";

grant trigger on table "public"."performance_metrics" to "service_role";

grant truncate on table "public"."performance_metrics" to "service_role";

grant update on table "public"."performance_metrics" to "service_role";

grant delete on table "public"."point_transactions" to "anon";

grant insert on table "public"."point_transactions" to "anon";

grant references on table "public"."point_transactions" to "anon";

grant select on table "public"."point_transactions" to "anon";

grant trigger on table "public"."point_transactions" to "anon";

grant truncate on table "public"."point_transactions" to "anon";

grant update on table "public"."point_transactions" to "anon";

grant delete on table "public"."point_transactions" to "authenticated";

grant insert on table "public"."point_transactions" to "authenticated";

grant references on table "public"."point_transactions" to "authenticated";

grant select on table "public"."point_transactions" to "authenticated";

grant trigger on table "public"."point_transactions" to "authenticated";

grant truncate on table "public"."point_transactions" to "authenticated";

grant update on table "public"."point_transactions" to "authenticated";

grant delete on table "public"."point_transactions" to "service_role";

grant insert on table "public"."point_transactions" to "service_role";

grant references on table "public"."point_transactions" to "service_role";

grant select on table "public"."point_transactions" to "service_role";

grant trigger on table "public"."point_transactions" to "service_role";

grant truncate on table "public"."point_transactions" to "service_role";

grant update on table "public"."point_transactions" to "service_role";

grant delete on table "public"."relationships" to "anon";

grant insert on table "public"."relationships" to "anon";

grant references on table "public"."relationships" to "anon";

grant select on table "public"."relationships" to "anon";

grant trigger on table "public"."relationships" to "anon";

grant truncate on table "public"."relationships" to "anon";

grant update on table "public"."relationships" to "anon";

grant delete on table "public"."relationships" to "authenticated";

grant insert on table "public"."relationships" to "authenticated";

grant references on table "public"."relationships" to "authenticated";

grant select on table "public"."relationships" to "authenticated";

grant trigger on table "public"."relationships" to "authenticated";

grant truncate on table "public"."relationships" to "authenticated";

grant update on table "public"."relationships" to "authenticated";

grant delete on table "public"."relationships" to "service_role";

grant insert on table "public"."relationships" to "service_role";

grant references on table "public"."relationships" to "service_role";

grant select on table "public"."relationships" to "service_role";

grant trigger on table "public"."relationships" to "service_role";

grant truncate on table "public"."relationships" to "service_role";

grant update on table "public"."relationships" to "service_role";

grant delete on table "public"."route_accounts" to "anon";

grant insert on table "public"."route_accounts" to "anon";

grant references on table "public"."route_accounts" to "anon";

grant select on table "public"."route_accounts" to "anon";

grant trigger on table "public"."route_accounts" to "anon";

grant truncate on table "public"."route_accounts" to "anon";

grant update on table "public"."route_accounts" to "anon";

grant delete on table "public"."route_accounts" to "authenticated";

grant insert on table "public"."route_accounts" to "authenticated";

grant references on table "public"."route_accounts" to "authenticated";

grant select on table "public"."route_accounts" to "authenticated";

grant trigger on table "public"."route_accounts" to "authenticated";

grant truncate on table "public"."route_accounts" to "authenticated";

grant update on table "public"."route_accounts" to "authenticated";

grant delete on table "public"."route_accounts" to "service_role";

grant insert on table "public"."route_accounts" to "service_role";

grant references on table "public"."route_accounts" to "service_role";

grant select on table "public"."route_accounts" to "service_role";

grant trigger on table "public"."route_accounts" to "service_role";

grant truncate on table "public"."route_accounts" to "service_role";

grant update on table "public"."route_accounts" to "service_role";

grant delete on table "public"."security_incidents" to "anon";

grant insert on table "public"."security_incidents" to "anon";

grant references on table "public"."security_incidents" to "anon";

grant select on table "public"."security_incidents" to "anon";

grant trigger on table "public"."security_incidents" to "anon";

grant truncate on table "public"."security_incidents" to "anon";

grant update on table "public"."security_incidents" to "anon";

grant delete on table "public"."security_incidents" to "authenticated";

grant insert on table "public"."security_incidents" to "authenticated";

grant references on table "public"."security_incidents" to "authenticated";

grant select on table "public"."security_incidents" to "authenticated";

grant trigger on table "public"."security_incidents" to "authenticated";

grant truncate on table "public"."security_incidents" to "authenticated";

grant update on table "public"."security_incidents" to "authenticated";

grant delete on table "public"."security_incidents" to "service_role";

grant insert on table "public"."security_incidents" to "service_role";

grant references on table "public"."security_incidents" to "service_role";

grant select on table "public"."security_incidents" to "service_role";

grant trigger on table "public"."security_incidents" to "service_role";

grant truncate on table "public"."security_incidents" to "service_role";

grant update on table "public"."security_incidents" to "service_role";

grant delete on table "public"."skill_progress_history" to "anon";

grant insert on table "public"."skill_progress_history" to "anon";

grant references on table "public"."skill_progress_history" to "anon";

grant select on table "public"."skill_progress_history" to "anon";

grant trigger on table "public"."skill_progress_history" to "anon";

grant truncate on table "public"."skill_progress_history" to "anon";

grant update on table "public"."skill_progress_history" to "anon";

grant delete on table "public"."skill_progress_history" to "authenticated";

grant insert on table "public"."skill_progress_history" to "authenticated";

grant references on table "public"."skill_progress_history" to "authenticated";

grant select on table "public"."skill_progress_history" to "authenticated";

grant trigger on table "public"."skill_progress_history" to "authenticated";

grant truncate on table "public"."skill_progress_history" to "authenticated";

grant update on table "public"."skill_progress_history" to "authenticated";

grant delete on table "public"."skill_progress_history" to "service_role";

grant insert on table "public"."skill_progress_history" to "service_role";

grant references on table "public"."skill_progress_history" to "service_role";

grant select on table "public"."skill_progress_history" to "service_role";

grant trigger on table "public"."skill_progress_history" to "service_role";

grant truncate on table "public"."skill_progress_history" to "service_role";

grant update on table "public"."skill_progress_history" to "service_role";

grant delete on table "public"."skills" to "anon";

grant insert on table "public"."skills" to "anon";

grant references on table "public"."skills" to "anon";

grant select on table "public"."skills" to "anon";

grant trigger on table "public"."skills" to "anon";

grant truncate on table "public"."skills" to "anon";

grant update on table "public"."skills" to "anon";

grant delete on table "public"."skills" to "authenticated";

grant insert on table "public"."skills" to "authenticated";

grant references on table "public"."skills" to "authenticated";

grant select on table "public"."skills" to "authenticated";

grant trigger on table "public"."skills" to "authenticated";

grant truncate on table "public"."skills" to "authenticated";

grant update on table "public"."skills" to "authenticated";

grant delete on table "public"."skills" to "service_role";

grant insert on table "public"."skills" to "service_role";

grant references on table "public"."skills" to "service_role";

grant select on table "public"."skills" to "service_role";

grant trigger on table "public"."skills" to "service_role";

grant truncate on table "public"."skills" to "service_role";

grant update on table "public"."skills" to "service_role";

grant delete on table "public"."tags" to "anon";

grant insert on table "public"."tags" to "anon";

grant references on table "public"."tags" to "anon";

grant select on table "public"."tags" to "anon";

grant trigger on table "public"."tags" to "anon";

grant truncate on table "public"."tags" to "anon";

grant update on table "public"."tags" to "anon";

grant delete on table "public"."tags" to "authenticated";

grant insert on table "public"."tags" to "authenticated";

grant references on table "public"."tags" to "authenticated";

grant select on table "public"."tags" to "authenticated";

grant trigger on table "public"."tags" to "authenticated";

grant truncate on table "public"."tags" to "authenticated";

grant update on table "public"."tags" to "authenticated";

grant delete on table "public"."tags" to "service_role";

grant insert on table "public"."tags" to "service_role";

grant references on table "public"."tags" to "service_role";

grant select on table "public"."tags" to "service_role";

grant trigger on table "public"."tags" to "service_role";

grant truncate on table "public"."tags" to "service_role";

grant update on table "public"."tags" to "service_role";

grant delete on table "public"."translations" to "anon";

grant insert on table "public"."translations" to "anon";

grant references on table "public"."translations" to "anon";

grant select on table "public"."translations" to "anon";

grant trigger on table "public"."translations" to "anon";

grant truncate on table "public"."translations" to "anon";

grant update on table "public"."translations" to "anon";

grant delete on table "public"."translations" to "authenticated";

grant insert on table "public"."translations" to "authenticated";

grant references on table "public"."translations" to "authenticated";

grant select on table "public"."translations" to "authenticated";

grant trigger on table "public"."translations" to "authenticated";

grant truncate on table "public"."translations" to "authenticated";

grant update on table "public"."translations" to "authenticated";

grant delete on table "public"."translations" to "service_role";

grant insert on table "public"."translations" to "service_role";

grant references on table "public"."translations" to "service_role";

grant select on table "public"."translations" to "service_role";

grant trigger on table "public"."translations" to "service_role";

grant truncate on table "public"."translations" to "service_role";

grant update on table "public"."translations" to "service_role";

grant delete on table "public"."user_activity_log" to "anon";

grant insert on table "public"."user_activity_log" to "anon";

grant references on table "public"."user_activity_log" to "anon";

grant select on table "public"."user_activity_log" to "anon";

grant trigger on table "public"."user_activity_log" to "anon";

grant truncate on table "public"."user_activity_log" to "anon";

grant update on table "public"."user_activity_log" to "anon";

grant delete on table "public"."user_activity_log" to "authenticated";

grant insert on table "public"."user_activity_log" to "authenticated";

grant references on table "public"."user_activity_log" to "authenticated";

grant select on table "public"."user_activity_log" to "authenticated";

grant trigger on table "public"."user_activity_log" to "authenticated";

grant truncate on table "public"."user_activity_log" to "authenticated";

grant update on table "public"."user_activity_log" to "authenticated";

grant delete on table "public"."user_activity_log" to "service_role";

grant insert on table "public"."user_activity_log" to "service_role";

grant references on table "public"."user_activity_log" to "service_role";

grant select on table "public"."user_activity_log" to "service_role";

grant trigger on table "public"."user_activity_log" to "service_role";

grant truncate on table "public"."user_activity_log" to "service_role";

grant update on table "public"."user_activity_log" to "service_role";

grant delete on table "public"."user_profile_favorite_works" to "anon";

grant insert on table "public"."user_profile_favorite_works" to "anon";

grant references on table "public"."user_profile_favorite_works" to "anon";

grant select on table "public"."user_profile_favorite_works" to "anon";

grant trigger on table "public"."user_profile_favorite_works" to "anon";

grant truncate on table "public"."user_profile_favorite_works" to "anon";

grant update on table "public"."user_profile_favorite_works" to "anon";

grant delete on table "public"."user_profile_favorite_works" to "authenticated";

grant insert on table "public"."user_profile_favorite_works" to "authenticated";

grant references on table "public"."user_profile_favorite_works" to "authenticated";

grant select on table "public"."user_profile_favorite_works" to "authenticated";

grant trigger on table "public"."user_profile_favorite_works" to "authenticated";

grant truncate on table "public"."user_profile_favorite_works" to "authenticated";

grant update on table "public"."user_profile_favorite_works" to "authenticated";

grant delete on table "public"."user_profile_favorite_works" to "service_role";

grant insert on table "public"."user_profile_favorite_works" to "service_role";

grant references on table "public"."user_profile_favorite_works" to "service_role";

grant select on table "public"."user_profile_favorite_works" to "service_role";

grant trigger on table "public"."user_profile_favorite_works" to "service_role";

grant truncate on table "public"."user_profile_favorite_works" to "service_role";

grant update on table "public"."user_profile_favorite_works" to "service_role";

grant delete on table "public"."user_profile_selected_values" to "anon";

grant insert on table "public"."user_profile_selected_values" to "anon";

grant references on table "public"."user_profile_selected_values" to "anon";

grant select on table "public"."user_profile_selected_values" to "anon";

grant trigger on table "public"."user_profile_selected_values" to "anon";

grant truncate on table "public"."user_profile_selected_values" to "anon";

grant update on table "public"."user_profile_selected_values" to "anon";

grant delete on table "public"."user_profile_selected_values" to "authenticated";

grant insert on table "public"."user_profile_selected_values" to "authenticated";

grant references on table "public"."user_profile_selected_values" to "authenticated";

grant select on table "public"."user_profile_selected_values" to "authenticated";

grant trigger on table "public"."user_profile_selected_values" to "authenticated";

grant truncate on table "public"."user_profile_selected_values" to "authenticated";

grant update on table "public"."user_profile_selected_values" to "authenticated";

grant delete on table "public"."user_profile_selected_values" to "service_role";

grant insert on table "public"."user_profile_selected_values" to "service_role";

grant references on table "public"."user_profile_selected_values" to "service_role";

grant select on table "public"."user_profile_selected_values" to "service_role";

grant trigger on table "public"."user_profile_selected_values" to "service_role";

grant truncate on table "public"."user_profile_selected_values" to "service_role";

grant update on table "public"."user_profile_selected_values" to "service_role";

grant delete on table "public"."user_profile_skills" to "anon";

grant insert on table "public"."user_profile_skills" to "anon";

grant references on table "public"."user_profile_skills" to "anon";

grant select on table "public"."user_profile_skills" to "anon";

grant trigger on table "public"."user_profile_skills" to "anon";

grant truncate on table "public"."user_profile_skills" to "anon";

grant update on table "public"."user_profile_skills" to "anon";

grant delete on table "public"."user_profile_skills" to "authenticated";

grant insert on table "public"."user_profile_skills" to "authenticated";

grant references on table "public"."user_profile_skills" to "authenticated";

grant select on table "public"."user_profile_skills" to "authenticated";

grant trigger on table "public"."user_profile_skills" to "authenticated";

grant truncate on table "public"."user_profile_skills" to "authenticated";

grant update on table "public"."user_profile_skills" to "authenticated";

grant delete on table "public"."user_profile_skills" to "service_role";

grant insert on table "public"."user_profile_skills" to "service_role";

grant references on table "public"."user_profile_skills" to "service_role";

grant select on table "public"."user_profile_skills" to "service_role";

grant trigger on table "public"."user_profile_skills" to "service_role";

grant truncate on table "public"."user_profile_skills" to "service_role";

grant update on table "public"."user_profile_skills" to "service_role";

grant delete on table "public"."user_profiles" to "anon";

grant insert on table "public"."user_profiles" to "anon";

grant references on table "public"."user_profiles" to "anon";

grant select on table "public"."user_profiles" to "anon";

grant trigger on table "public"."user_profiles" to "anon";

grant truncate on table "public"."user_profiles" to "anon";

grant update on table "public"."user_profiles" to "anon";

grant delete on table "public"."user_profiles" to "authenticated";

grant insert on table "public"."user_profiles" to "authenticated";

grant references on table "public"."user_profiles" to "authenticated";

grant select on table "public"."user_profiles" to "authenticated";

grant trigger on table "public"."user_profiles" to "authenticated";

grant truncate on table "public"."user_profiles" to "authenticated";

grant update on table "public"."user_profiles" to "authenticated";

grant delete on table "public"."user_profiles" to "service_role";

grant insert on table "public"."user_profiles" to "service_role";

grant references on table "public"."user_profiles" to "service_role";

grant select on table "public"."user_profiles" to "service_role";

grant trigger on table "public"."user_profiles" to "service_role";

grant truncate on table "public"."user_profiles" to "service_role";

grant update on table "public"."user_profiles" to "service_role";

grant delete on table "public"."value_choices" to "anon";

grant insert on table "public"."value_choices" to "anon";

grant references on table "public"."value_choices" to "anon";

grant select on table "public"."value_choices" to "anon";

grant trigger on table "public"."value_choices" to "anon";

grant truncate on table "public"."value_choices" to "anon";

grant update on table "public"."value_choices" to "anon";

grant delete on table "public"."value_choices" to "authenticated";

grant insert on table "public"."value_choices" to "authenticated";

grant references on table "public"."value_choices" to "authenticated";

grant select on table "public"."value_choices" to "authenticated";

grant trigger on table "public"."value_choices" to "authenticated";

grant truncate on table "public"."value_choices" to "authenticated";

grant update on table "public"."value_choices" to "authenticated";

grant delete on table "public"."value_choices" to "service_role";

grant insert on table "public"."value_choices" to "service_role";

grant references on table "public"."value_choices" to "service_role";

grant select on table "public"."value_choices" to "service_role";

grant trigger on table "public"."value_choices" to "service_role";

grant truncate on table "public"."value_choices" to "service_role";

grant update on table "public"."value_choices" to "service_role";

grant delete on table "public"."value_selection_history" to "anon";

grant insert on table "public"."value_selection_history" to "anon";

grant references on table "public"."value_selection_history" to "anon";

grant select on table "public"."value_selection_history" to "anon";

grant trigger on table "public"."value_selection_history" to "anon";

grant truncate on table "public"."value_selection_history" to "anon";

grant update on table "public"."value_selection_history" to "anon";

grant delete on table "public"."value_selection_history" to "authenticated";

grant insert on table "public"."value_selection_history" to "authenticated";

grant references on table "public"."value_selection_history" to "authenticated";

grant select on table "public"."value_selection_history" to "authenticated";

grant trigger on table "public"."value_selection_history" to "authenticated";

grant truncate on table "public"."value_selection_history" to "authenticated";

grant update on table "public"."value_selection_history" to "authenticated";

grant delete on table "public"."value_selection_history" to "service_role";

grant insert on table "public"."value_selection_history" to "service_role";

grant references on table "public"."value_selection_history" to "service_role";

grant select on table "public"."value_selection_history" to "service_role";

grant trigger on table "public"."value_selection_history" to "service_role";

grant truncate on table "public"."value_selection_history" to "service_role";

grant update on table "public"."value_selection_history" to "service_role";

grant delete on table "public"."value_theme_tags" to "anon";

grant insert on table "public"."value_theme_tags" to "anon";

grant references on table "public"."value_theme_tags" to "anon";

grant select on table "public"."value_theme_tags" to "anon";

grant trigger on table "public"."value_theme_tags" to "anon";

grant truncate on table "public"."value_theme_tags" to "anon";

grant update on table "public"."value_theme_tags" to "anon";

grant delete on table "public"."value_theme_tags" to "authenticated";

grant insert on table "public"."value_theme_tags" to "authenticated";

grant references on table "public"."value_theme_tags" to "authenticated";

grant select on table "public"."value_theme_tags" to "authenticated";

grant trigger on table "public"."value_theme_tags" to "authenticated";

grant truncate on table "public"."value_theme_tags" to "authenticated";

grant update on table "public"."value_theme_tags" to "authenticated";

grant delete on table "public"."value_theme_tags" to "service_role";

grant insert on table "public"."value_theme_tags" to "service_role";

grant references on table "public"."value_theme_tags" to "service_role";

grant select on table "public"."value_theme_tags" to "service_role";

grant trigger on table "public"."value_theme_tags" to "service_role";

grant truncate on table "public"."value_theme_tags" to "service_role";

grant update on table "public"."value_theme_tags" to "service_role";

grant delete on table "public"."value_themes" to "anon";

grant insert on table "public"."value_themes" to "anon";

grant references on table "public"."value_themes" to "anon";

grant select on table "public"."value_themes" to "anon";

grant trigger on table "public"."value_themes" to "anon";

grant truncate on table "public"."value_themes" to "anon";

grant update on table "public"."value_themes" to "anon";

grant delete on table "public"."value_themes" to "authenticated";

grant insert on table "public"."value_themes" to "authenticated";

grant references on table "public"."value_themes" to "authenticated";

grant select on table "public"."value_themes" to "authenticated";

grant trigger on table "public"."value_themes" to "authenticated";

grant truncate on table "public"."value_themes" to "authenticated";

grant update on table "public"."value_themes" to "authenticated";

grant delete on table "public"."value_themes" to "service_role";

grant insert on table "public"."value_themes" to "service_role";

grant references on table "public"."value_themes" to "service_role";

grant select on table "public"."value_themes" to "service_role";

grant trigger on table "public"."value_themes" to "service_role";

grant truncate on table "public"."value_themes" to "service_role";

grant update on table "public"."value_themes" to "service_role";

grant delete on table "public"."work_authors" to "anon";

grant insert on table "public"."work_authors" to "anon";

grant references on table "public"."work_authors" to "anon";

grant select on table "public"."work_authors" to "anon";

grant trigger on table "public"."work_authors" to "anon";

grant truncate on table "public"."work_authors" to "anon";

grant update on table "public"."work_authors" to "anon";

grant delete on table "public"."work_authors" to "authenticated";

grant insert on table "public"."work_authors" to "authenticated";

grant references on table "public"."work_authors" to "authenticated";

grant select on table "public"."work_authors" to "authenticated";

grant trigger on table "public"."work_authors" to "authenticated";

grant truncate on table "public"."work_authors" to "authenticated";

grant update on table "public"."work_authors" to "authenticated";

grant delete on table "public"."work_authors" to "service_role";

grant insert on table "public"."work_authors" to "service_role";

grant references on table "public"."work_authors" to "service_role";

grant select on table "public"."work_authors" to "service_role";

grant trigger on table "public"."work_authors" to "service_role";

grant truncate on table "public"."work_authors" to "service_role";

grant update on table "public"."work_authors" to "service_role";

grant delete on table "public"."work_evaluation_history" to "anon";

grant insert on table "public"."work_evaluation_history" to "anon";

grant references on table "public"."work_evaluation_history" to "anon";

grant select on table "public"."work_evaluation_history" to "anon";

grant trigger on table "public"."work_evaluation_history" to "anon";

grant truncate on table "public"."work_evaluation_history" to "anon";

grant update on table "public"."work_evaluation_history" to "anon";

grant delete on table "public"."work_evaluation_history" to "authenticated";

grant insert on table "public"."work_evaluation_history" to "authenticated";

grant references on table "public"."work_evaluation_history" to "authenticated";

grant select on table "public"."work_evaluation_history" to "authenticated";

grant trigger on table "public"."work_evaluation_history" to "authenticated";

grant truncate on table "public"."work_evaluation_history" to "authenticated";

grant update on table "public"."work_evaluation_history" to "authenticated";

grant delete on table "public"."work_evaluation_history" to "service_role";

grant insert on table "public"."work_evaluation_history" to "service_role";

grant references on table "public"."work_evaluation_history" to "service_role";

grant select on table "public"."work_evaluation_history" to "service_role";

grant trigger on table "public"."work_evaluation_history" to "service_role";

grant truncate on table "public"."work_evaluation_history" to "service_role";

grant update on table "public"."work_evaluation_history" to "service_role";

grant delete on table "public"."work_tags" to "anon";

grant insert on table "public"."work_tags" to "anon";

grant references on table "public"."work_tags" to "anon";

grant select on table "public"."work_tags" to "anon";

grant trigger on table "public"."work_tags" to "anon";

grant truncate on table "public"."work_tags" to "anon";

grant update on table "public"."work_tags" to "anon";

grant delete on table "public"."work_tags" to "authenticated";

grant insert on table "public"."work_tags" to "authenticated";

grant references on table "public"."work_tags" to "authenticated";

grant select on table "public"."work_tags" to "authenticated";

grant trigger on table "public"."work_tags" to "authenticated";

grant truncate on table "public"."work_tags" to "authenticated";

grant update on table "public"."work_tags" to "authenticated";

grant delete on table "public"."work_tags" to "service_role";

grant insert on table "public"."work_tags" to "service_role";

grant references on table "public"."work_tags" to "service_role";

grant select on table "public"."work_tags" to "service_role";

grant trigger on table "public"."work_tags" to "service_role";

grant truncate on table "public"."work_tags" to "service_role";

grant update on table "public"."work_tags" to "service_role";

grant delete on table "public"."works" to "anon";

grant insert on table "public"."works" to "anon";

grant references on table "public"."works" to "anon";

grant select on table "public"."works" to "anon";

grant trigger on table "public"."works" to "anon";

grant truncate on table "public"."works" to "anon";

grant update on table "public"."works" to "anon";

grant delete on table "public"."works" to "authenticated";

grant insert on table "public"."works" to "authenticated";

grant references on table "public"."works" to "authenticated";

grant select on table "public"."works" to "authenticated";

grant trigger on table "public"."works" to "authenticated";

grant truncate on table "public"."works" to "authenticated";

grant update on table "public"."works" to "authenticated";

grant delete on table "public"."works" to "service_role";

grant insert on table "public"."works" to "service_role";

grant references on table "public"."works" to "service_role";

grant select on table "public"."works" to "service_role";

grant trigger on table "public"."works" to "service_role";

grant truncate on table "public"."works" to "service_role";

grant update on table "public"."works" to "service_role";

CREATE TRIGGER update_alliances_updated_at BEFORE UPDATE ON public.alliances FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chain_nodes_updated_at BEFORE UPDATE ON public.chain_nodes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chains_updated_at BEFORE UPDATE ON public.chains FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_genres_updated_at BEFORE UPDATE ON public.genres FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_group_members_updated_at BEFORE UPDATE ON public.group_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON public.groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_languages_updated_at BEFORE UPDATE ON public.languages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lists_updated_at BEFORE UPDATE ON public.lists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mandala_sheet_cells_updated_at BEFORE UPDATE ON public.mandala_sheet_cells FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mandala_sheets_updated_at BEFORE UPDATE ON public.mandala_sheets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_relationships_updated_at BEFORE UPDATE ON public.relationships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_route_accounts_updated_at BEFORE UPDATE ON public.route_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON public.skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON public.tags FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_translations_updated_at BEFORE UPDATE ON public.translations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profile_favorite_works_updated_at BEFORE UPDATE ON public.user_profile_favorite_works FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profile_selected_values_updated_at BEFORE UPDATE ON public.user_profile_selected_values FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profile_skills_updated_at BEFORE UPDATE ON public.user_profile_skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_value_choices_updated_at BEFORE UPDATE ON public.value_choices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_value_themes_updated_at BEFORE UPDATE ON public.value_themes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_work_authors_updated_at BEFORE UPDATE ON public.work_authors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_works_updated_at BEFORE UPDATE ON public.works FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


