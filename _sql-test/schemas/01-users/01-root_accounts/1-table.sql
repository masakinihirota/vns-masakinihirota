-- -- ルートアカウント詳細テーブル（言語テーブルに依存）
-- CREATE TABLE public.root_accounts (
--   id                   UUID PRIMARY KEY,
--   aud                  TEXT,
--   role                 TEXT,
--   email                TEXT UNIQUE,
--   email_confirmed_at   TEXT UNIQUE,
--   last_sign_in_at      TIMESTAMPTZ,
--   raw_app_meta_data    JSONB,
--   raw_user_meta_data   JSONB,
--   is_verified          BOOLEAN DEFAULT FALSE NOT NULL,
--   mother_tongue_code   VARCHAR(10) REFERENCES languages(id),
--   site_language_code   VARCHAR(10) REFERENCES languages(id),
--   birth_generation     VARCHAR(50),
--   total_points         INTEGER DEFAULT 0 NOT NULL CHECK (total_points >= 0),
--   living_area_segment  living_area_segment,
--   last_login_at        TIMESTAMPTZ,
--   warning_count        INTEGER DEFAULT 0 NOT NULL CHECK (warning_count >= 0),
--   last_warning_at      TIMESTAMPTZ,
--   is_anonymous_initial_auth BOOLEAN DEFAULT FALSE NOT NULL,
--   created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
--   updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
-- );


-- ルートアカウント詳細テーブル（言語テーブルに依存）
CREATE TABLE public.root_accounts (
  id                   UUID PRIMARY KEY,
  aud                  TEXT,
  role                 TEXT,
  email                TEXT UNIQUE,
  email_confirmed_at   TEXT UNIQUE,
  last_sign_in_at      TIMESTAMPTZ,
  raw_app_meta_data    JSONB,
  raw_user_meta_data   JSONB,
  is_verified          BOOLEAN DEFAULT FALSE NOT NULL,
  mother_tongue_code   VARCHAR(10) REFERENCES languages(id),
  site_language_code   VARCHAR(10) REFERENCES languages(id),
  birth_generation     VARCHAR(50),
  total_points         INTEGER DEFAULT 0 NOT NULL CHECK (total_points >= 0),
  living_area_segment  living_area_segment,
  last_login_at        TIMESTAMPTZ,
  warning_count        INTEGER DEFAULT 0 NOT NULL CHECK (warning_count >= 0),
  last_warning_at      TIMESTAMPTZ,
  is_anonymous_initial_auth BOOLEAN DEFAULT FALSE NOT NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  ---auth.usersテーブルのカラムを追加
  instance_id uuid null,
  encrypted_password character varying(255) null,
  invited_at timestamp with time zone null,
  confirmation_token character varying(255) null,
  confirmation_sent_at timestamp with time zone null,
  recovery_token character varying(255) null,
  recovery_sent_at timestamp with time zone null,
  email_change_token_new character varying(255) null,
  email_change character varying(255) null,
  email_change_sent_at timestamp with time zone null,
  is_super_admin boolean null,
  phone text null,
  phone_confirmed_at timestamp with time zone null,
  phone_change text null,
  phone_change_token character varying(255) null,
  phone_change_sent_at timestamp with time zone null,
  -- confirmed_at timestamp with time zone GENERATED ALWAYS as (LEAST(email_confirmed_at, phone_confirmed_at)) STORED null,
  email_change_token_current character varying(255) null,
  email_change_confirm_status smallint null,
  banned_until timestamp with time zone null,
  reauthentication_token character varying(255) null,
  reauthentication_sent_at timestamp with time zone null,
  is_sso_user boolean not null,
  deleted_at timestamp with time zone null,
  is_anonymous boolean not null,
  constraint users_phone_key unique (phone),
  constraint users_email_change_confirm_status_check check (
    (
      (email_change_confirm_status >= 0)
      and (email_change_confirm_status <= 2)
    )
  )
);
