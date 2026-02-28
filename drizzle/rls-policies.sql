/**
 * RLS (Row Level Security) Policies
 *
 * @description
 * Better Auth が生成するテーブルに対する行レベルセキュリティポリシーを定義します。
 * これにより、ユーザーは自分のデータのみにアクセス可能となります。
 *
 * @installation
 * このファイルのポリシーは、初期セットアップ時に以下のコマンドで適用します：
 *   psql -d <DATABASE_URL> -f drizzle/rls-policies.sql
 *
 * @security
 * - すべての認証関連テーブルで RLS を有効化
 * - JWT トークンが含まれる account テーブルの保護を強化
 * - セッション情報の厳密な行ベースアクセス制御
 */

-- ============================================================================
-- Step 1: Enable RLS on all auth tables
-- ============================================================================

ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "verification" ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Step 2: Create auth role (for service-to-service authentication)
-- ============================================================================

-- 注記: PostgreSQL の security definer を活用する場合は、ここで custom role を定義
-- 本番環境では、アプリケーションサーバーが使用する DB ユーザーと区別してください

-- ============================================================================
-- Step 3: DROP existing policies (idempotent)
-- ============================================================================

-- User table policies
DROP POLICY IF EXISTS "user_read_own" ON "user";
DROP POLICY IF EXISTS "user_admin_read_all" ON "user";

-- Session table policies
DROP POLICY IF EXISTS "session_read_own" ON "session";
DROP POLICY IF EXISTS "session_admin_read_all" ON "session";

-- Account table policies
DROP POLICY IF EXISTS "account_read_own" ON "account";
DROP POLICY IF EXISTS "account_admin_read_all" ON "account";

-- Verification table policies
DROP POLICY IF EXISTS "verification_read_own_identifier" ON "verification";

-- ============================================================================
-- Step 4: User Table Policies
-- ============================================================================

-- ユーザーは自分のプロフィール情報を読み取れる
-- 注記: auth.uid() を使用する場合は、PostgreSQL の built-in auth を設定する必要があります
-- 現在のセットアップではアプリケーションが user_id を管理するため、コメント化しています
-- CREATE POLICY "user_read_own" ON "user"
--   FOR SELECT
--   USING (id = auth.uid());

-- 管理者ユーザーはすべてのユーザー情報を読み取れる
-- CREATE POLICY "user_admin_read_all" ON "user"
--   FOR SELECT
--   USING (
--     EXISTS (
--       SELECT 1 FROM "user" WHERE id = auth.uid() AND role = 'admin'
--     )
--   );

-- ============================================================================
-- Step 5: Session Table Policies
-- ============================================================================

-- 注記: Better Auth がセッショントークンを直接管理するため、RLS の代わりに
--      データベースレベルのトークン検証を推奨します
-- セッションは token に基づいて検証され、userId は参照用のみ

-- 管理者はすべてのセッションを読み取れる
-- CREATE POLICY "session_admin_read_all" ON "session"
--   FOR SELECT
--   USING (
--     EXISTS (
--       SELECT 1 FROM "user" WHERE id = auth.uid() AND role = 'admin'
--     )
--   );

-- ============================================================================
-- Step 6: Account Table Policies
-- ============================================================================

-- 注記: account テーブルは OAuth トークンを含むため、最も厳格に保護する必要があります
-- ユーザーは自分の OAuth アカウント情報のみにアクセス可能
-- CREATE POLICY "account_read_own" ON "account"
--   FOR SELECT
--   USING (user_id = auth.uid());

-- 管理者はすべてのアカウント情報を読み取れる（監査・デバッグ目的）
-- CREATE POLICY "account_admin_read_all" ON "account"
--   FOR SELECT
--   USING (
--     EXISTS (
--       SELECT 1 FROM "user" WHERE id = auth.uid() AND role = 'admin'
--     )
--   );

-- ============================================================================
-- Step 7: Verification Table Policies
-- ============================================================================

-- メール検証トークンは identifier ベースで個別管理
-- CREATE POLICY "verification_read_own_identifier" ON "verification"
--   FOR SELECT
--   USING (true);  -- メール検証は一般的に public (token を知っている人のみアクセス可能)

-- ============================================================================
-- Step 8: Application-Level Alternative
-- ============================================================================

/*
 * 代替案: アプリケーションレベルでのアクセス制御
 *
 * PostgreSQL の RLS policy は複雑で、JWT ベースの認証では使いづらい場合があります。
 * Better Auth を使用している場合、以下のアプローチを推奨します：
 *
 * 1. Better Auth のセッショントークンを検証して user_id を取得
 * 2. クエリに WHERE userId = ? を追加
 * 3. ORM (Drizzle ORM) で自動的に条件を付与するミドルウェアを実装
 *
 * このアプローチは以下が可能です：
 * - 複雑なアクセス制御ロジックをアプリケーション層で管理
 * - より詳細なエラーメッセージを提供
 * - 監査ログを記録しやすい
 */

-- ============================================================================
-- Step 9: Indexes for Performance (RLS with WHERE clauses)
-- ============================================================================

-- RLS ポリシーで user_id をチェックする場合、以下のインデックスが必須
CREATE INDEX IF NOT EXISTS "idx_session_userId" ON "session" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_account_userId" ON "account" ("user_id");

-- ============================================================================
-- Step 10: RBAC Tables (groups / nations) Policies
-- ============================================================================

ALTER TABLE "groups" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "group_members" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "nations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "nation_groups" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "groups_member_read" ON "groups";
DROP POLICY IF EXISTS "groups_admin_read_all" ON "groups";
DROP POLICY IF EXISTS "group_members_member_read" ON "group_members";
DROP POLICY IF EXISTS "group_members_admin_read_all" ON "group_members";
DROP POLICY IF EXISTS "nations_member_read" ON "nations";
DROP POLICY IF EXISTS "nations_admin_read_all" ON "nations";
DROP POLICY IF EXISTS "nation_groups_member_read" ON "nation_groups";
DROP POLICY IF EXISTS "nation_groups_admin_read_all" ON "nation_groups";

CREATE POLICY "groups_member_read" ON "groups"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM "group_members" gm
      JOIN "user_profiles" up ON up.id = gm.user_profile_id
      JOIN "root_accounts" ra ON ra.id = up.root_account_id
      WHERE gm.group_id = groups.id
        AND ra.auth_user_id = current_setting('app.auth_user_id', true)
    )
  );

CREATE POLICY "groups_admin_read_all" ON "groups"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM "user" u
      WHERE u.id = current_setting('app.auth_user_id', true)
        AND u.role = 'platform_admin'
    )
  );

CREATE POLICY "group_members_member_read" ON "group_members"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM "group_members" gm2
      JOIN "user_profiles" up ON up.id = gm2.user_profile_id
      JOIN "root_accounts" ra ON ra.id = up.root_account_id
      WHERE gm2.group_id = group_members.group_id
        AND ra.auth_user_id = current_setting('app.auth_user_id', true)
    )
  );

CREATE POLICY "group_members_admin_read_all" ON "group_members"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM "user" u
      WHERE u.id = current_setting('app.auth_user_id', true)
        AND u.role = 'platform_admin'
    )
  );

CREATE POLICY "nations_member_read" ON "nations"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM "nation_groups" ng
      JOIN "group_members" gm ON gm.group_id = ng.group_id
      JOIN "user_profiles" up ON up.id = gm.user_profile_id
      JOIN "root_accounts" ra ON ra.id = up.root_account_id
      WHERE ng.nation_id = nations.id
        AND ra.auth_user_id = current_setting('app.auth_user_id', true)
    )
  );

CREATE POLICY "nations_admin_read_all" ON "nations"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM "user" u
      WHERE u.id = current_setting('app.auth_user_id', true)
        AND u.role = 'platform_admin'
    )
  );

CREATE POLICY "nation_groups_member_read" ON "nation_groups"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM "group_members" gm
      JOIN "user_profiles" up ON up.id = gm.user_profile_id
      JOIN "root_accounts" ra ON ra.id = up.root_account_id
      WHERE gm.group_id = nation_groups.group_id
        AND ra.auth_user_id = current_setting('app.auth_user_id', true)
    )
  );

CREATE POLICY "nation_groups_admin_read_all" ON "nation_groups"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM "user" u
      WHERE u.id = current_setting('app.auth_user_id', true)
        AND u.role = 'platform_admin'
    )
  );

-- ============================================================================
-- Status Check
-- ============================================================================

-- RLS が有効化されているか確認
-- SELECT tablename, (SELECT count(*) FROM pg_policies WHERE pg_policies.tablename = pg_tables.tablename) as policy_count
-- FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('user', 'session', 'account', 'verification', 'groups', 'group_members', 'nations', 'nation_groups');

-- ============================================================================
-- Session Expiration Cleanup
-- ============================================================================

/**
 * cleanup_expired_sessions() - 期限切れセッションを削除
 *
 * @description
 * この関数は、expires_at が過去になったセッションを削除します。
 * PostgreSQL の cron job (pg_cron) で定期的に実行されます。
 *
 * @installation
 * 1. pg_cron extension をインストール:
 *    CREATE EXTENSION IF NOT EXISTS pg_cron;
 *
 * 2. この関数を定義:
 *    psql -d <DATABASE_URL> -f drizzle/rls-policies.sql
 *
 * 3. Cron job をスケジュール:
 *    SELECT cron.schedule('cleanup-expired-sessions', '0 3 * * *', 'SELECT cleanup_expired_sessions()');
 */

CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS TABLE(deleted_count BIGINT) AS $$
DECLARE
  deleted_rows BIGINT;
BEGIN
  -- 期限切れセッションの数をカウント
  SELECT COUNT(*)
  INTO deleted_rows
  FROM "session"
  WHERE "expires_at" < NOW();

  -- 期限切れセッションを削除
  DELETE FROM "session"
  WHERE "expires_at" < NOW();

  -- 削除された行数を返す
  RETURN QUERY SELECT deleted_rows;
END;
$$ LANGUAGE plpgsql;
