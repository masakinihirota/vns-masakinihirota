-- RLS policy baseline for VNS
--
-- 前提:
-- - 接続ごとに `set_config('app.auth_user_id', '<user-id>', true)` を設定する
-- - 設定されない場合、policy 式は false となり default deny になる

CREATE SCHEMA IF NOT EXISTS app;

CREATE OR REPLACE FUNCTION app.current_auth_user_id()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(current_setting('app.auth_user_id', true), '');
$$;

CREATE OR REPLACE FUNCTION app.is_platform_admin()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM "user" u
    WHERE u.id = app.current_auth_user_id()
      AND u.role = 'platform_admin'
  );
$$;

CREATE OR REPLACE FUNCTION app.owns_root_account(root_account_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM root_accounts ra
    WHERE ra.id = root_account_uuid
      AND ra.auth_user_id = app.current_auth_user_id()
  );
$$;

CREATE OR REPLACE FUNCTION app.owns_profile(profile_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM user_profiles up
    JOIN root_accounts ra ON ra.id = up.root_account_id
    WHERE up.id = profile_uuid
      AND ra.auth_user_id = app.current_auth_user_id()
  );
$$;

DO $$
DECLARE table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'user','session','account','verification',
    'user_preferences','session_tokens','two_factor_secrets','rate_limit_keys','feature_flags',
    'root_accounts','user_profiles','business_cards','alliances','works',
    'groups','group_members','nations','nation_groups','nation_citizens',
    'nation_events','nation_event_participants','notifications','nation_posts',
    'follows','relationships','user_work_ratings','user_work_entries',
    'point_transactions','market_items','market_transactions',
    'penalties','approvals','audit_logs','admin_dashboard_cache'
  ]
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_name);
  END LOOP;
END $$;

-- auth tables
DROP POLICY IF EXISTS user_owner_or_admin ON "user";
CREATE POLICY user_owner_or_admin ON "user"
  FOR ALL
  USING (id = app.current_auth_user_id() OR app.is_platform_admin())
  WITH CHECK (id = app.current_auth_user_id() OR app.is_platform_admin());

DROP POLICY IF EXISTS session_owner_or_admin ON "session";
CREATE POLICY session_owner_or_admin ON "session"
  FOR ALL
  USING (user_id = app.current_auth_user_id() OR app.is_platform_admin())
  WITH CHECK (user_id = app.current_auth_user_id() OR app.is_platform_admin());

DROP POLICY IF EXISTS account_owner_or_admin ON "account";
CREATE POLICY account_owner_or_admin ON "account"
  FOR ALL
  USING (user_id = app.current_auth_user_id() OR app.is_platform_admin())
  WITH CHECK (user_id = app.current_auth_user_id() OR app.is_platform_admin());

DROP POLICY IF EXISTS verification_admin_only ON "verification";
CREATE POLICY verification_admin_only ON "verification"
  FOR ALL
  USING (app.is_platform_admin())
  WITH CHECK (app.is_platform_admin());

DROP POLICY IF EXISTS user_preferences_owner_or_admin ON user_preferences;
CREATE POLICY user_preferences_owner_or_admin ON user_preferences
  FOR ALL
  USING (user_id = app.current_auth_user_id() OR app.is_platform_admin())
  WITH CHECK (user_id = app.current_auth_user_id() OR app.is_platform_admin());

DROP POLICY IF EXISTS session_tokens_owner_or_admin ON session_tokens;
CREATE POLICY session_tokens_owner_or_admin ON session_tokens
  FOR ALL
  USING (user_id = app.current_auth_user_id() OR app.is_platform_admin())
  WITH CHECK (user_id = app.current_auth_user_id() OR app.is_platform_admin());

DROP POLICY IF EXISTS two_factor_secrets_owner_or_admin ON two_factor_secrets;
CREATE POLICY two_factor_secrets_owner_or_admin ON two_factor_secrets
  FOR ALL
  USING (user_id = app.current_auth_user_id() OR app.is_platform_admin())
  WITH CHECK (user_id = app.current_auth_user_id() OR app.is_platform_admin());

DROP POLICY IF EXISTS rate_limit_keys_admin_only ON rate_limit_keys;
CREATE POLICY rate_limit_keys_admin_only ON rate_limit_keys
  FOR ALL
  USING (app.is_platform_admin())
  WITH CHECK (app.is_platform_admin());

DROP POLICY IF EXISTS feature_flags_admin_read_public ON feature_flags;
CREATE POLICY feature_flags_admin_read_public ON feature_flags
  FOR SELECT
  USING (enabled = true OR app.is_platform_admin());

DROP POLICY IF EXISTS feature_flags_admin_write ON feature_flags;
CREATE POLICY feature_flags_admin_write ON feature_flags
  FOR ALL
  USING (app.is_platform_admin())
  WITH CHECK (app.is_platform_admin());

-- root/profile tables
DROP POLICY IF EXISTS root_accounts_owner_or_admin ON root_accounts;
CREATE POLICY root_accounts_owner_or_admin ON root_accounts
  FOR ALL
  USING (auth_user_id = app.current_auth_user_id() OR app.is_platform_admin())
  WITH CHECK (auth_user_id = app.current_auth_user_id() OR app.is_platform_admin());

DROP POLICY IF EXISTS user_profiles_owner_or_admin ON user_profiles;
CREATE POLICY user_profiles_owner_or_admin ON user_profiles
  FOR ALL
  USING (app.owns_root_account(root_account_id) OR app.is_platform_admin())
  WITH CHECK (app.owns_root_account(root_account_id) OR app.is_platform_admin());

DROP POLICY IF EXISTS business_cards_owner_or_admin ON business_cards;
CREATE POLICY business_cards_owner_or_admin ON business_cards
  FOR ALL
  USING (app.owns_profile(user_profile_id) OR app.is_platform_admin())
  WITH CHECK (app.owns_profile(user_profile_id) OR app.is_platform_admin());

DROP POLICY IF EXISTS point_transactions_owner_or_admin ON point_transactions;
CREATE POLICY point_transactions_owner_or_admin ON point_transactions
  FOR ALL
  USING (app.owns_profile(user_profile_id) OR app.is_platform_admin())
  WITH CHECK (app.owns_profile(user_profile_id) OR app.is_platform_admin());

DROP POLICY IF EXISTS follows_owner_or_admin ON follows;
CREATE POLICY follows_owner_or_admin ON follows
  FOR ALL
  USING (
    app.owns_profile(follower_profile_id)
    OR app.owns_profile(followed_profile_id)
    OR app.is_platform_admin()
  )
  WITH CHECK (
    app.owns_profile(follower_profile_id)
    OR app.is_platform_admin()
  );

DROP POLICY IF EXISTS relationships_owner_or_admin ON relationships;
CREATE POLICY relationships_owner_or_admin ON relationships
  FOR ALL
  USING (
    app.owns_profile(user_profile_id)
    OR app.owns_profile(target_profile_id)
    OR app.is_platform_admin()
  )
  WITH CHECK (
    app.owns_profile(user_profile_id)
    OR app.is_platform_admin()
  );

-- group / nation tables
DROP POLICY IF EXISTS groups_member_or_admin ON groups;
CREATE POLICY groups_member_or_admin ON groups
  FOR ALL
  USING (
    app.is_platform_admin()
    OR EXISTS (
      SELECT 1
      FROM group_members gm
      WHERE gm.group_id = groups.id
        AND app.owns_profile(gm.user_profile_id)
    )
  )
  WITH CHECK (
    app.is_platform_admin()
    OR EXISTS (
      SELECT 1
      FROM group_members gm
      WHERE gm.group_id = groups.id
        AND app.owns_profile(gm.user_profile_id)
    )
  );

DROP POLICY IF EXISTS group_members_member_or_admin ON group_members;
CREATE POLICY group_members_member_or_admin ON group_members
  FOR ALL
  USING (
    app.is_platform_admin()
    OR app.owns_profile(user_profile_id)
    OR EXISTS (
      SELECT 1
      FROM group_members gm2
      WHERE gm2.group_id = group_members.group_id
        AND app.owns_profile(gm2.user_profile_id)
        AND gm2.role = 'leader'
    )
  )
  WITH CHECK (
    app.is_platform_admin()
    OR EXISTS (
      SELECT 1
      FROM group_members gm2
      WHERE gm2.group_id = group_members.group_id
        AND app.owns_profile(gm2.user_profile_id)
        AND gm2.role = 'leader'
    )
  );

DROP POLICY IF EXISTS nations_member_or_admin ON nations;
CREATE POLICY nations_member_or_admin ON nations
  FOR ALL
  USING (
    app.is_platform_admin()
    OR EXISTS (
      SELECT 1
      FROM nation_groups ng
      JOIN group_members gm ON gm.group_id = ng.group_id
      WHERE ng.nation_id = nations.id
        AND app.owns_profile(gm.user_profile_id)
    )
  )
  WITH CHECK (
    app.is_platform_admin()
    OR EXISTS (
      SELECT 1
      FROM nation_groups ng
      JOIN group_members gm ON gm.group_id = ng.group_id
      WHERE ng.nation_id = nations.id
        AND app.owns_profile(gm.user_profile_id)
    )
  );

DROP POLICY IF EXISTS nation_groups_member_or_admin ON nation_groups;
CREATE POLICY nation_groups_member_or_admin ON nation_groups
  FOR ALL
  USING (
    app.is_platform_admin()
    OR EXISTS (
      SELECT 1
      FROM group_members gm
      WHERE gm.group_id = nation_groups.group_id
        AND app.owns_profile(gm.user_profile_id)
    )
  )
  WITH CHECK (
    app.is_platform_admin()
    OR EXISTS (
      SELECT 1
      FROM group_members gm
      WHERE gm.group_id = nation_groups.group_id
        AND app.owns_profile(gm.user_profile_id)
    )
  );

DROP POLICY IF EXISTS nation_citizens_member_or_admin ON nation_citizens;
CREATE POLICY nation_citizens_member_or_admin ON nation_citizens
  FOR ALL
  USING (app.owns_profile(user_profile_id) OR app.is_platform_admin())
  WITH CHECK (app.owns_profile(user_profile_id) OR app.is_platform_admin());

DROP POLICY IF EXISTS nation_events_member_or_admin ON nation_events;
CREATE POLICY nation_events_member_or_admin ON nation_events
  FOR ALL
  USING (
    app.is_platform_admin()
    OR app.owns_profile(organizer_id)
    OR EXISTS (
      SELECT 1
      FROM nation_groups ng
      JOIN group_members gm ON gm.group_id = ng.group_id
      WHERE ng.nation_id = nation_events.nation_id
        AND app.owns_profile(gm.user_profile_id)
    )
  )
  WITH CHECK (
    app.is_platform_admin()
    OR app.owns_profile(organizer_id)
  );

DROP POLICY IF EXISTS nation_event_participants_member_or_admin ON nation_event_participants;
CREATE POLICY nation_event_participants_member_or_admin ON nation_event_participants
  FOR ALL
  USING (app.owns_profile(user_profile_id) OR app.is_platform_admin())
  WITH CHECK (app.owns_profile(user_profile_id) OR app.is_platform_admin());

DROP POLICY IF EXISTS nation_posts_member_or_admin ON nation_posts;
CREATE POLICY nation_posts_member_or_admin ON nation_posts
  FOR ALL
  USING (
    app.is_platform_admin()
    OR app.owns_profile(author_id)
    OR EXISTS (
      SELECT 1
      FROM group_members gm
      WHERE gm.group_id = nation_posts.author_group_id
        AND app.owns_profile(gm.user_profile_id)
    )
  )
  WITH CHECK (
    app.is_platform_admin()
    OR app.owns_profile(author_id)
    OR EXISTS (
      SELECT 1
      FROM group_members gm
      WHERE gm.group_id = nation_posts.author_group_id
        AND app.owns_profile(gm.user_profile_id)
    )
  );

-- work tables
DROP POLICY IF EXISTS works_owner_or_public_or_admin ON works;
CREATE POLICY works_owner_or_public_or_admin ON works
  FOR SELECT
  USING (
    status = 'public'
    OR owner_user_id = app.current_auth_user_id()
    OR app.is_platform_admin()
  );

DROP POLICY IF EXISTS works_owner_or_admin_write ON works;
CREATE POLICY works_owner_or_admin_write ON works
  FOR ALL
  USING (owner_user_id = app.current_auth_user_id() OR app.is_platform_admin())
  WITH CHECK (owner_user_id = app.current_auth_user_id() OR app.is_platform_admin());

DROP POLICY IF EXISTS user_work_entries_owner_or_admin ON user_work_entries;
CREATE POLICY user_work_entries_owner_or_admin ON user_work_entries
  FOR ALL
  USING (user_id = app.current_auth_user_id() OR app.is_platform_admin())
  WITH CHECK (user_id = app.current_auth_user_id() OR app.is_platform_admin());

DROP POLICY IF EXISTS user_work_ratings_owner_or_admin ON user_work_ratings;
CREATE POLICY user_work_ratings_owner_or_admin ON user_work_ratings
  FOR ALL
  USING (user_id = app.current_auth_user_id() OR app.is_platform_admin())
  WITH CHECK (user_id = app.current_auth_user_id() OR app.is_platform_admin());

-- market tables
DROP POLICY IF EXISTS market_items_member_or_admin ON market_items;
CREATE POLICY market_items_member_or_admin ON market_items
  FOR ALL
  USING (
    app.is_platform_admin()
    OR app.owns_profile(seller_id)
    OR EXISTS (
      SELECT 1
      FROM group_members gm
      WHERE gm.group_id = market_items.seller_group_id
        AND app.owns_profile(gm.user_profile_id)
    )
  )
  WITH CHECK (
    app.is_platform_admin()
    OR app.owns_profile(seller_id)
    OR EXISTS (
      SELECT 1
      FROM group_members gm
      WHERE gm.group_id = market_items.seller_group_id
        AND app.owns_profile(gm.user_profile_id)
    )
  );

DROP POLICY IF EXISTS market_transactions_member_or_admin ON market_transactions;
CREATE POLICY market_transactions_member_or_admin ON market_transactions
  FOR ALL
  USING (
    app.is_platform_admin()
    OR app.owns_profile(buyer_id)
    OR app.owns_profile(seller_id)
  )
  WITH CHECK (
    app.is_platform_admin()
    OR app.owns_profile(buyer_id)
    OR app.owns_profile(seller_id)
  );

-- alliance / notification
DROP POLICY IF EXISTS alliances_member_or_admin ON alliances;
CREATE POLICY alliances_member_or_admin ON alliances
  FOR ALL
  USING (app.owns_profile(profile_a_id) OR app.owns_profile(profile_b_id) OR app.is_platform_admin())
  WITH CHECK (app.owns_profile(profile_a_id) OR app.owns_profile(profile_b_id) OR app.is_platform_admin());

DROP POLICY IF EXISTS notifications_owner_or_admin ON notifications;
CREATE POLICY notifications_owner_or_admin ON notifications
  FOR ALL
  USING (app.owns_profile(user_profile_id) OR app.is_platform_admin())
  WITH CHECK (app.owns_profile(user_profile_id) OR app.is_platform_admin());

-- admin only
DROP POLICY IF EXISTS penalties_admin_only ON penalties;
CREATE POLICY penalties_admin_only ON penalties
  FOR ALL
  USING (app.is_platform_admin())
  WITH CHECK (app.is_platform_admin());

DROP POLICY IF EXISTS approvals_admin_only ON approvals;
CREATE POLICY approvals_admin_only ON approvals
  FOR ALL
  USING (app.is_platform_admin())
  WITH CHECK (app.is_platform_admin());

DROP POLICY IF EXISTS audit_logs_admin_only ON audit_logs;
CREATE POLICY audit_logs_admin_only ON audit_logs
  FOR ALL
  USING (app.is_platform_admin())
  WITH CHECK (app.is_platform_admin());

DROP POLICY IF EXISTS admin_dashboard_cache_admin_only ON admin_dashboard_cache;
CREATE POLICY admin_dashboard_cache_admin_only ON admin_dashboard_cache
  FOR ALL
  USING (app.is_platform_admin())
  WITH CHECK (app.is_platform_admin());
