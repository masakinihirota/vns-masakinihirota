create table "public"."root_account" (
    "id" uuid not null,
    "aud" text,
    "role" text,
    "email" text,
    "email_confirmed_at" timestamp with time zone,
    "raw_app_meta_data" jsonb,
    "raw_user_meta_data" jsonb,
    "confirmed_at" timestamp with time zone,
    "is_sso_user" boolean not null default false,
    "is_anonymous" boolean not null default false,
    "provider" text,
    "name" text,
    "avatar_url" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone
);


CREATE UNIQUE INDEX root_account_pkey ON public.root_account USING btree (id);

alter table "public"."root_account" add constraint "root_account_pkey" PRIMARY KEY using index "root_account_pkey";

grant delete on table "public"."root_account" to "anon";

grant insert on table "public"."root_account" to "anon";

grant references on table "public"."root_account" to "anon";

grant select on table "public"."root_account" to "anon";

grant trigger on table "public"."root_account" to "anon";

grant truncate on table "public"."root_account" to "anon";

grant update on table "public"."root_account" to "anon";

grant delete on table "public"."root_account" to "authenticated";

grant insert on table "public"."root_account" to "authenticated";

grant references on table "public"."root_account" to "authenticated";

grant select on table "public"."root_account" to "authenticated";

grant trigger on table "public"."root_account" to "authenticated";

grant truncate on table "public"."root_account" to "authenticated";

grant update on table "public"."root_account" to "authenticated";

grant delete on table "public"."root_account" to "service_role";

grant insert on table "public"."root_account" to "service_role";

grant references on table "public"."root_account" to "service_role";

grant select on table "public"."root_account" to "service_role";

grant trigger on table "public"."root_account" to "service_role";

grant truncate on table "public"."root_account" to "service_role";

grant update on table "public"."root_account" to "service_role";


