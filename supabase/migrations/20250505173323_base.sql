create table "public"."production" (
    "id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone
);


create table "public"."user" (
    "id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone,
    "email" character varying(255) not null,
    "password" character varying(255) not null
);


CREATE UNIQUE INDEX production_pkey ON public.production USING btree (id);

CREATE UNIQUE INDEX user_email_key ON public."user" USING btree (email);

CREATE UNIQUE INDEX user_pkey ON public."user" USING btree (id);

alter table "public"."production" add constraint "production_pkey" PRIMARY KEY using index "production_pkey";

alter table "public"."user" add constraint "user_pkey" PRIMARY KEY using index "user_pkey";

alter table "public"."user" add constraint "user_email_key" UNIQUE using index "user_email_key";

grant delete on table "public"."production" to "anon";

grant insert on table "public"."production" to "anon";

grant references on table "public"."production" to "anon";

grant select on table "public"."production" to "anon";

grant trigger on table "public"."production" to "anon";

grant truncate on table "public"."production" to "anon";

grant update on table "public"."production" to "anon";

grant delete on table "public"."production" to "authenticated";

grant insert on table "public"."production" to "authenticated";

grant references on table "public"."production" to "authenticated";

grant select on table "public"."production" to "authenticated";

grant trigger on table "public"."production" to "authenticated";

grant truncate on table "public"."production" to "authenticated";

grant update on table "public"."production" to "authenticated";

grant delete on table "public"."production" to "service_role";

grant insert on table "public"."production" to "service_role";

grant references on table "public"."production" to "service_role";

grant select on table "public"."production" to "service_role";

grant trigger on table "public"."production" to "service_role";

grant truncate on table "public"."production" to "service_role";

grant update on table "public"."production" to "service_role";

grant delete on table "public"."user" to "anon";

grant insert on table "public"."user" to "anon";

grant references on table "public"."user" to "anon";

grant select on table "public"."user" to "anon";

grant trigger on table "public"."user" to "anon";

grant truncate on table "public"."user" to "anon";

grant update on table "public"."user" to "anon";

grant delete on table "public"."user" to "authenticated";

grant insert on table "public"."user" to "authenticated";

grant references on table "public"."user" to "authenticated";

grant select on table "public"."user" to "authenticated";

grant trigger on table "public"."user" to "authenticated";

grant truncate on table "public"."user" to "authenticated";

grant update on table "public"."user" to "authenticated";

grant delete on table "public"."user" to "service_role";

grant insert on table "public"."user" to "service_role";

grant references on table "public"."user" to "service_role";

grant select on table "public"."user" to "service_role";

grant trigger on table "public"."user" to "service_role";

grant truncate on table "public"."user" to "service_role";

grant update on table "public"."user" to "service_role";

create policy "All production are public"
on "public"."production"
as permissive
for select
to public
using (true);


create policy "All user are public"
on "public"."user"
as permissive
for select
to public
using (true);



