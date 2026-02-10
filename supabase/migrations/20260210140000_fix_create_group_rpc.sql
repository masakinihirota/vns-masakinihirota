-- Fix create_group_with_leader logic to correctly handle user_profile_id
CREATE OR REPLACE FUNCTION public.create_group_with_leader(
    p_name TEXT,
    p_leader_id UUID, -- This is expected to be user_profile_id
    p_description TEXT DEFAULT NULL,
    p_avatar_url TEXT DEFAULT NULL,
    p_cover_url TEXT DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
    v_group_id UUID;
    v_result JSONB;
    v_is_owner BOOLEAN;
BEGIN
    -- Security Check: Verify that the p_leader_id belongs to the authenticated user
    SELECT EXISTS (
        SELECT 1
        FROM public.user_profiles up
        JOIN public.root_accounts ra ON up.root_account_id = ra.id
        WHERE up.id = p_leader_id
        AND ra.auth_user_id = auth.uid()
    ) INTO v_is_owner;

    IF NOT v_is_owner THEN
        RAISE EXCEPTION 'Unauthorized: The specified profile does not belong to you.';
    END IF;

    -- Create Group
    INSERT INTO public.groups (
        name, description, leader_id, avatar_url, cover_url
    ) VALUES (
        p_name, p_description, p_leader_id, p_avatar_url, p_cover_url
    ) RETURNING id INTO v_group_id;

    -- Add Leader as Member
    INSERT INTO public.group_members (
        group_id, user_profile_id, role
    ) VALUES (
        v_group_id, p_leader_id, 'leader'
    );

    -- Return the created group object as JSONB
    -- We construct the result manually to ensure it matches expected format
    SELECT jsonb_build_object(
        'id', id,
        'name', name,
        'description', description,
        'leader_id', leader_id,
        'created_at', created_at,
        'updated_at', updated_at,
        'avatar_url', avatar_url,
        'cover_url', cover_url
    ) INTO v_result
    FROM public.groups
    WHERE id = v_group_id;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
