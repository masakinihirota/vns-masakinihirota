-- CREATE TABLE IF NOT EXISTS public.user_profiles (
--   id UUID PRIMARY KEY,
--   created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
--   updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
-- );

CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    root_account_id UUID NOT NULL REFERENCES root_accounts(id) ON DELETE CASCADE,
    profile_name TEXT NOT NULL,
    profile_type profile_type NOT NULL DEFAULT 'self',
    status profile_status NOT NULL DEFAULT 'other',
    purpose TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
