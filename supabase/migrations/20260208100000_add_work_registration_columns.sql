-- Add missing columns to works table
alter table "public"."works"
add column if not exists "release_year" text,
add column if not exists "scale" text check (scale in ('half_day', 'one_day', 'one_week', 'one_month', 'one_cour', 'long_term')),
add column if not exists "is_purchasable" boolean default true;

-- Create user_work_entries table
create table if not exists "public"."user_work_entries" (
    "user_id" uuid not null references auth.users(id) on delete cascade,
    "work_id" uuid not null references "public"."works"(id) on delete cascade,
    "status" text not null check (status in ('expecting', 'reading', 'interesting')),
    "tier" integer,
    "memo" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    primary key ("user_id", "work_id")
);

-- Enable RLS for user_work_entries
alter table "public"."user_work_entries" enable row level security;

-- Policies for user_work_entries
create policy "Users can view their own entries"
on "public"."user_work_entries"
for select
using (auth.uid() = user_id);

create policy "Users can insert their own entries"
on "public"."user_work_entries"
for insert
with check (auth.uid() = user_id);

create policy "Users can update their own entries"
on "public"."user_work_entries"
for update
using (auth.uid() = user_id);

create policy "Users can delete their own entries"
on "public"."user_work_entries"
for delete
using (auth.uid() = user_id);

-- Create index for performance
create index if not exists "idx_user_work_entries_user_work" on "public"."user_work_entries" ("user_id", "work_id");
