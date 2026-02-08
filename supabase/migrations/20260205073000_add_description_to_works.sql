-- Add description column to works table
alter table "public"."works"
add column if not exists "description" text;
