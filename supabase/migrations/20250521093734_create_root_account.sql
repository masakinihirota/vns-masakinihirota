create table "public"."root_account" (
    "id" uuid not null,
    "aud" text,
    "role" text,
    "email" text,
    "email_confirmed_at" timestamp with time zone,
    "last_sign_in_at" timestamp with time zone,
    "raw_app_meta_data" jsonb,
    "raw_user_meta_data" jsonb,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."root_account" enable row level security;

CREATE UNIQUE INDEX root_account_email_key ON public.root_account USING btree (email);

CREATE UNIQUE INDEX root_account_pkey ON public.root_account USING btree (id);

alter table "public"."root_account" add constraint "root_account_pkey" PRIMARY KEY using index "root_account_pkey";

alter table "public"."root_account" add constraint "root_account_email_key" UNIQUE using index "root_account_email_key";

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

create policy "Users can delete only their own root_account row"
on "public"."root_account"
as permissive
for delete
to public
using ((auth.uid() = id));


create policy "Users can insert only their own root_account row"
on "public"."root_account"
as permissive
for insert
to public
with check ((auth.uid() = id));


create policy "Users can select only their own root_account row"
on "public"."root_account"
as permissive
for select
to public
using ((auth.uid() = id));


create policy "Users can update only their own root_account row"
on "public"."root_account"
as permissive
for update
to public
using ((auth.uid() = id));



