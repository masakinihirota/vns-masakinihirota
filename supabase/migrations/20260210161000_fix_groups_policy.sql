-- Fix RLS policies for groups table

-- Drop incorrect policies
DROP POLICY IF EXISTS "Leaders can update groups" ON public.groups;
DROP POLICY IF EXISTS "Leaders can delete groups" ON public.groups;

-- Re-create with correct logic (check ownership of leader_id which is a user_profile_id)
CREATE POLICY "Leaders can update groups"
    ON public.groups
    FOR UPDATE
    USING (
        leader_id IN (
            SELECT id FROM public.user_profiles
            WHERE root_account_id IN (
                SELECT id FROM public.root_accounts WHERE auth_user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Leaders can delete groups"
    ON public.groups
    FOR DELETE
    USING (
        leader_id IN (
            SELECT id FROM public.user_profiles
            WHERE root_account_id IN (
                SELECT id FROM public.root_accounts WHERE auth_user_id = auth.uid()
            )
        )
    );
