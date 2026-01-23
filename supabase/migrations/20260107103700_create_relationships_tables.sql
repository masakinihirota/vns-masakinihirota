-- Create enum types for relationship statuses
CREATE TYPE public.follow_status AS ENUM ('watch', 'follow');
CREATE TYPE public.alliance_status AS ENUM ('requested', 'pre_partner', 'partner');

-- Create follows table (One-way relationships: Watch, Follow)
-- Relationships are now profile-to-profile (thousand masks)
CREATE TABLE public.follows (
    follower_profile_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    followed_profile_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    status public.follow_status NOT NULL DEFAULT 'follow',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT follows_pkey PRIMARY KEY (follower_profile_id, followed_profile_id),
    CONSTRAINT follows_self_check CHECK (follower_profile_id != followed_profile_id)
);

-- Enable RLS for follows
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- RLS Policies for follows

-- 1. SELECT: Users can see who their profiles follow/watch.
CREATE POLICY "Users can view their own profiles' follows and watches"
    ON public.follows FOR SELECT
    USING (
        follower_profile_id IN (
            SELECT id FROM public.user_profiles
            WHERE root_account_id IN (SELECT id FROM public.root_accounts WHERE auth_user_id = auth.uid())
        )
    );

-- 2. SELECT: Users can see who follows their profiles (BUT NOT who watches them).
CREATE POLICY "Users can view their profiles' followers (excluding watches)"
    ON public.follows FOR SELECT
    USING (
        followed_profile_id IN (
            SELECT id FROM public.user_profiles
            WHERE root_account_id IN (SELECT id FROM public.root_accounts WHERE auth_user_id = auth.uid())
        ) AND status = 'follow'
    );

-- 3. INSERT: Users can create follows/watches for their own profiles.
CREATE POLICY "Users can create follows for their own profiles"
    ON public.follows FOR INSERT
    WITH CHECK (
        follower_profile_id IN (
            SELECT id FROM public.user_profiles
            WHERE root_account_id IN (SELECT id FROM public.root_accounts WHERE auth_user_id = auth.uid())
        )
    );

-- 4. UPDATE: Users can update follows for their own profiles.
CREATE POLICY "Users can update follows for their own profiles"
    ON public.follows FOR UPDATE
    USING (
        follower_profile_id IN (
            SELECT id FROM public.user_profiles
            WHERE root_account_id IN (SELECT id FROM public.root_accounts WHERE auth_user_id = auth.uid())
        )
    );

-- 5. DELETE: Users can delete follows for their own profiles.
CREATE POLICY "Users can delete follows for their own profiles"
    ON public.follows FOR DELETE
    USING (
        follower_profile_id IN (
            SELECT id FROM public.user_profiles
            WHERE root_account_id IN (SELECT id FROM public.root_accounts WHERE auth_user_id = auth.uid())
        )
    );


-- Create alliances table (Two-way relationships: Pre-Partner, Partner)
-- Relationships are now profile-to-profile
CREATE TABLE public.alliances (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_a_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    profile_b_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    status public.alliance_status NOT NULL DEFAULT 'requested',
    expires_at TIMESTAMPTZ, -- For pre-partner expiration
    metadata JSONB DEFAULT '{}'::jsonb, -- Store history, context, drift logs
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Ensure A < B to prevent duplicate pairs (A-B and B-A)
    CONSTRAINT alliances_profile_order_check CHECK (profile_a_id < profile_b_id),
    CONSTRAINT alliances_unique_pair UNIQUE (profile_a_id, profile_b_id)
);

-- Enable RLS for alliances
ALTER TABLE public.alliances ENABLE ROW LEVEL SECURITY;

-- RLS Policies for alliances

-- 1. SELECT: Involved users can view the alliance.
CREATE POLICY "Users can view their own profiles' alliances"
    ON public.alliances FOR SELECT
    USING (
        profile_a_id IN (
            SELECT id FROM public.user_profiles
            WHERE root_account_id IN (SELECT id FROM public.root_accounts WHERE auth_user_id = auth.uid())
        ) OR
        profile_b_id IN (
            SELECT id FROM public.user_profiles
            WHERE root_account_id IN (SELECT id FROM public.root_accounts WHERE auth_user_id = auth.uid())
        )
    );

-- 2. INSERT: Users can initiate alliances for their own profiles.
CREATE POLICY "Users can initiate alliances for their own profiles"
    ON public.alliances FOR INSERT
    WITH CHECK (
        profile_a_id IN (
            SELECT id FROM public.user_profiles
            WHERE root_account_id IN (SELECT id FROM public.root_accounts WHERE auth_user_id = auth.uid())
        ) OR
        profile_b_id IN (
            SELECT id FROM public.user_profiles
            WHERE root_account_id IN (SELECT id FROM public.root_accounts WHERE auth_user_id = auth.uid())
        )
    );

-- 3. UPDATE: Involved users can update.
CREATE POLICY "Users can update their own profiles' alliances"
    ON public.alliances FOR UPDATE
    USING (
        profile_a_id IN (
            SELECT id FROM public.user_profiles
            WHERE root_account_id IN (SELECT id FROM public.root_accounts WHERE auth_user_id = auth.uid())
        ) OR
        profile_b_id IN (
            SELECT id FROM public.user_profiles
            WHERE root_account_id IN (SELECT id FROM public.root_accounts WHERE auth_user_id = auth.uid())
        )
    );

-- 4. DELETE: Involved users can dissolve.
CREATE POLICY "Users can delete their own profiles' alliances"
    ON public.alliances FOR DELETE
    USING (
        profile_a_id IN (
            SELECT id FROM public.user_profiles
            WHERE root_account_id IN (SELECT id FROM public.root_accounts WHERE auth_user_id = auth.uid())
        ) OR
        profile_b_id IN (
            SELECT id FROM public.user_profiles
            WHERE root_account_id IN (SELECT id FROM public.root_accounts WHERE auth_user_id = auth.uid())
        )
    );

-- Indexes for performance
CREATE INDEX idx_follows_follower_profile ON public.follows(follower_profile_id);
CREATE INDEX idx_follows_followed_profile ON public.follows(followed_profile_id);
CREATE INDEX idx_alliances_profile_a ON public.alliances(profile_a_id);
CREATE INDEX idx_alliances_profile_b ON public.alliances(profile_b_id);

-- Validations and Triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_alliances_updated_at
    BEFORE UPDATE ON public.alliances
    FOR EACH ROW
    EXECUTE PROCEDURE public.update_updated_at_column();
