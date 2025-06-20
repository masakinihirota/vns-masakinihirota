-- ルートアカウントテーブル
-- CREATE TABLE public.root_account (
--   id                   UUID PRIMARY KEY,
--   aud                  TEXT,
--   role                 TEXT,
--   email                TEXT UNIQUE,
--   email_confirmed_at   TIMESTAMPTZ,
--   last_sign_in_at      TIMESTAMPTZ,
--   raw_app_meta_data    JSONB,
--   raw_user_meta_data   JSONB,
--   created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
--   updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
-- );

-- ルートアカウント詳細テーブル（言語テーブルに依存）
CREATE TABLE public.route_accounts (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aud                  TEXT,
  role                 TEXT,
  email                TEXT UNIQUE NOT NULL,
  email_confirmed_at   TIMESTAMPTZ,
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
  created_at           TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at           TIMESTAMPTZ DEFAULT now() NOT NULL
);
