-- Create enum types for relationship statuses
CREATE TYPE public.follow_status AS ENUM ('watch', 'follow');
CREATE TYPE public.alliance_status AS ENUM ('requested', 'pre_partner', 'partner');

-- Create follows table (One-way relationships: Watch, Follow)
CREATE TABLE public.follows (
    follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    followed_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status public.follow_status NOT NULL DEFAULT 'follow',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT follows_pkey PRIMARY KEY (follower_id, followed_id),
    CONSTRAINT follows_self_check CHECK (follower_id != followed_id)
);

-- Enable RLS for follows
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- RLS Policies for follows

-- 1. SELECT: Users can see who they follow/watch.
CREATE POLICY "Users can view their own follows and watches"
    ON public.follows FOR SELECT
    USING (auth.uid() = follower_id);

-- 2. SELECT: Users can see who follows them (BUT NOT who watches them).
-- Watch status is stealth.
CREATE POLICY "Users can view their followers (excluding watches)"
    ON public.follows FOR SELECT
    USING (auth.uid() = followed_id AND status = 'follow');

-- 3. INSERT: Users can create their own follows/watches.
CREATE POLICY "Users can create their own follows"
    ON public.follows FOR INSERT
    WITH CHECK (auth.uid() = follower_id);

-- 4. UPDATE: Users can update their own follows/watches.
CREATE POLICY "Users can update their own follows"
    ON public.follows FOR UPDATE
    USING (auth.uid() = follower_id);

-- 5. DELETE: Users can delete their own follows/watches.
CREATE POLICY "Users can delete their own follows"
    ON public.follows FOR DELETE
    USING (auth.uid() = follower_id);


-- Create alliances table (Two-way relationships: Pre-Partner, Partner)
CREATE TABLE public.alliances (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_a_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    user_b_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status public.alliance_status NOT NULL DEFAULT 'requested',
    expires_at TIMESTAMPTZ, -- For pre-partner expiration
    metadata JSONB DEFAULT '{}'::jsonb, -- Store history, context, drift logs
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Ensure A < B to prevent duplicate pairs (A-B and B-A)
    CONSTRAINT alliances_user_order_check CHECK (user_a_id < user_b_id),
    CONSTRAINT alliances_unique_pair UNIQUE (user_a_id, user_b_id)
);

-- Enable RLS for alliances
ALTER TABLE public.alliances ENABLE ROW LEVEL SECURITY;

-- RLS Policies for alliances

-- 1. SELECT: Involved users can view the alliance.
CREATE POLICY "Users can view their own alliances"
    ON public.alliances FOR SELECT
    USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);

-- 2. INSERT: Any user can initiate a request (logic should handle validation).
-- Note: Ideally creating a request needs only one signature, but enforcing A < B means
-- the initiator might be B. So we allow if auth.uid is either A or B.
CREATE POLICY "Users can initiate alliances"
    ON public.alliances FOR INSERT
    WITH CHECK (auth.uid() = user_a_id OR auth.uid() = user_b_id);

-- 3. UPDATE: Involved users can update (e.g., accept request, change status).
CREATE POLICY "Users can update their own alliances"
    ON public.alliances FOR UPDATE
    USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);

-- 4. DELETE: Involved users can dissolve the alliance.
CREATE POLICY "Users can delete their own alliances"
    ON public.alliances FOR DELETE
    USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);

-- Indexes for performance
CREATE INDEX idx_follows_follower ON public.follows(follower_id);
CREATE INDEX idx_follows_followed ON public.follows(followed_id);
CREATE INDEX idx_alliances_user_a ON public.alliances(user_a_id);
CREATE INDEX idx_alliances_user_b ON public.alliances(user_b_id);

-- Validations and Triggers (Optional but recommended for timestamps)
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
