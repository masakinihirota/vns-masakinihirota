-- Add RLS policies for groups and group_members

-- Groups Table Policies
-- Note: SELECT and INSERT are already defined in 20260209000000_create_community_schema.sql

-- UPDATE: Only the leader can update the group details
CREATE POLICY "Leaders can update groups"
    ON public.groups
    FOR UPDATE
    USING (auth.uid() = leader_id);

-- DELETE: Only the leader can delete the group
CREATE POLICY "Leaders can delete groups"
    ON public.groups
    FOR DELETE
    USING (auth.uid() = leader_id);


-- Group Members Table Policies

-- SELECT: Public read access
CREATE POLICY "Public read access for group_members"
    ON public.group_members
    FOR SELECT
    USING (true);

-- INSERT: Users can join themselves
CREATE POLICY "Users can join groups"
    ON public.group_members
    FOR INSERT
    WITH CHECK (auth.uid() = user_profile_id);

-- INSERT: Leader can add members
CREATE POLICY "Leaders can add members"
    ON public.group_members
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.groups
            WHERE id = group_id AND leader_id = auth.uid()
        )
    );

-- UPDATE: Leader can update member roles
CREATE POLICY "Leaders can update members"
    ON public.group_members
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.groups
            WHERE id = group_id AND leader_id = auth.uid()
        )
    );

-- DELETE: Users can leave (delete their own membership)
CREATE POLICY "Users can leave groups"
    ON public.group_members
    FOR DELETE
    USING (auth.uid() = user_profile_id);

-- DELETE: Leader can remove members
CREATE POLICY "Leaders can remove members"
    ON public.group_members
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.groups
            WHERE id = group_id AND leader_id = auth.uid()
        )
    );
