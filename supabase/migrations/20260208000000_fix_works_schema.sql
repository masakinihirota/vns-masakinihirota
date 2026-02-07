-- Add missing columns to works table
alter table "public"."works"
add column if not exists "tags" text[] default '{}'::text[],
add column if not exists "external_url" text,
add column if not exists "affiliate_url" text;

-- Create user_work_ratings table
create table if not exists "public"."user_work_ratings" (
    "user_id" uuid not null references auth.users(id) on delete cascade,
    "work_id" uuid not null references "public"."works"(id) on delete cascade,
    "rating" text not null,
    "last_tier" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    primary key ("user_id", "work_id")
);

-- Enable RLS
alter table "public"."user_work_ratings" enable row level security;

-- Policies for user_work_ratings
create policy "Users can view their own ratings"
on "public"."user_work_ratings"
for select
using (auth.uid() = user_id);

create policy "Users can insert their own ratings"
on "public"."user_work_ratings"
for insert
with check (auth.uid() = user_id);

create policy "Users can update their own ratings"
on "public"."user_work_ratings"
for update
using (auth.uid() = user_id);

create policy "Users can delete their own ratings"
on "public"."user_work_ratings"
for delete
using (auth.uid() = user_id);

-- Create index for performance
create index if not exists "idx_user_work_ratings_user_work" on "public"."user_work_ratings" ("user_id", "work_id");
