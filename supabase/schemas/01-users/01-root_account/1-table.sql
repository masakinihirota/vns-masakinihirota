CREATE TABLE IF NOT EXISTS public.root_account (
  id UUID PRIMARY KEY,
  aud TEXT,
  role TEXT,
  email TEXT UNIQUE,
  email_confirmed_at TIMESTAMPTZ,
  last_sign_in_at TIMESTAMPTZ,
  raw_app_meta_data JSONB,
  raw_user_meta_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
