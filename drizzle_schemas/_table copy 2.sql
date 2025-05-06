create table "root_account" (
  "id" uuid primary key not null,
  "aud" text,
  "role" text,
  "email" text,
  "email_confirmed_at" timestamptz,
  "raw_app_meta_data" jsonb,
  "raw_user_meta_data" jsonb,
  "confirmed_at" timestamptz,
  "is_sso_user" boolean,
  "is_anonymous" boolean,
  "provider" text,
  "name" text,
  "avatar_url" text,
  "created_at" timestamptz,
  "updated_at" timestamptz
);

