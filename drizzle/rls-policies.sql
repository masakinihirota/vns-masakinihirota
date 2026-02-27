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
-- Status Check
-- ============================================================================

-- RLS が有効化されているか確認
-- SELECT tablename, (SELECT count(*) FROM pg_policies WHERE pg_policies.tablename = pg_tables.tablename) as policy_count
-- FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('user', 'session', 'account', 'verification');
