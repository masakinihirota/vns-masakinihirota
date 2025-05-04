create table "public"."production" (
    "id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone
);


CREATE UNIQUE INDEX production_pkey ON public.production USING btree (id);

alter table "public"."production" add constraint "production_pkey" PRIMARY KEY using index "production_pkey";

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


create policy "All root_account are public" on root_account for select
using (true);
