create table "root_account" (
  "id" uuid primary key not null,
  "aud" text,
  "role" text,
  "email" text,
  "email_confirmed_at" timestamptz,
  "raw_app_meta_data" jsonb,
  "raw_user_meta_data" jsonb,
  "confirmed_at" timestamptz,
  "is_sso_user" boolean not null default false,
  "is_anonymous" boolean not null default false,
  "provider" text,
  "name" text,
  "avatar_url" text,
  "created_at" timestamptz default now() not null,
  "updated_at" timestamptz,
  "age" smallint not null
);
