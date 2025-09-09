create extension if not exists "pgjwt" with schema "extensions";

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

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.root_accounts (id, aud, role, email, email_confirmed_at, last_sign_in_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
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


