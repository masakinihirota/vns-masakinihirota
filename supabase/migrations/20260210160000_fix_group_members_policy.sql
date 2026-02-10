-- Fix RLS policies for group_members

-- Drop incorrect policies
DROP POLICY IF EXISTS "Users can join groups" ON public.group_members;
DROP POLICY IF EXISTS "Users can leave groups" ON public.group_members;

-- Re-create with correct logic (check ownership of user_profile)
CREATE POLICY "Users can join groups"
    ON public.group_members
    FOR INSERT
    WITH CHECK (
        user_profile_id IN (
            SELECT id FROM public.user_profiles
            WHERE root_account_id IN (
                SELECT id FROM public.root_accounts WHERE auth_user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can leave groups"
    ON public.group_members
    FOR DELETE
    USING (
        user_profile_id IN (
            SELECT id FROM public.user_profiles
            WHERE root_account_id IN (
                SELECT id FROM public.root_accounts WHERE auth_user_id = auth.uid()
            )
        )
    );
