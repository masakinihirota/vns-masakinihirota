create table "public"."works" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "author" text,
    "category" text not null check (category in ('anime', 'manga', 'other')),
    "is_official" boolean not null default false,
    "owner_user_id" uuid references auth.users(id) on delete set null,
    "status" text not null default 'pending' check (status in ('public', 'pending', 'private')),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    primary key ("id")
);

alter table "public"."works" enable row level security;

create policy "Public works are viewable by everyone"
on "public"."works"
for select
using (status = 'public' or is_official = true);

create policy "Users can view their own pending/private works"
on "public"."works"
for select
using (auth.uid() = owner_user_id);

create policy "Users can insert their own works"
on "public"."works"
for insert
with check (auth.uid() = owner_user_id);

create policy "Users can update their own works"
on "public"."works"
for update
using (auth.uid() = owner_user_id);

create index "idx_works_owner_status" on "public"."works" ("owner_user_id", "status");
