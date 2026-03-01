-- Migration: Add app-layer fields to users table (Stage 1)
-- Issue #2: スキーマ統合 - Phase 1: users テーブルの拡張
-- Created: 2026-03-01

-- ============================================================================
-- Step 1: users テーブルに App層フィールドを追加
-- ============================================================================

ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "display_name" text DEFAULT 'Anonymous';
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "avatar_url" text;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "mask_category" text DEFAULT 'persona';
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "points" integer DEFAULT 0;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "level" integer DEFAULT 1;

-- ============================================================================
-- Step 2: 既存の userProfiles データを users テーブルに migrate
-- ============================================================================

-- userProfiles が存在する場合、データを移行
UPDATE "user" u
SET
  display_name = COALESCE(up.display_name, 'Anonymous'),
  avatar_url = up.avatar_url,
  mask_category = COALESCE(up.mask_category, 'persona'),
  points = COALESCE(up.points, 0),
  level = COALESCE(up.level, 1)
FROM "user_profiles" up
JOIN "root_accounts" ra ON up.root_account_id = ra.id
WHERE u.id = ra.auth_user_id
AND (
  u.display_name = 'Anonymous' OR
  u.display_name IS NULL OR
  u.avatar_url IS NULL
);

-- ============================================================================
-- Step 3: インデックスを追加（パフォーマンス最適化）
-- ============================================================================

CREATE INDEX IF NOT EXISTS "idx_user_mask_category" ON "user"("mask_category");
CREATE INDEX IF NOT EXISTS "idx_user_points" ON "user"("points");
CREATE INDEX IF NOT EXISTS "idx_user_level" ON "user"("level");

-- ============================================================================
-- Note:
-- Phase 2 (TODO): groupMembers.user_profile_id を users.id に統合
-- Phase 3 (TODO): rootAccounts, userProfiles テーブルを削除
-- ============================================================================
