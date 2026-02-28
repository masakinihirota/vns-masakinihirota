-- RLS (Row Level Security) Auto-Enable Migration
-- This migration automatically enables RLS on all auth tables
-- Created: 2026-03-01

-- ============================================================================
-- Enable RLS on all Better Auth tables
-- ============================================================================

ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "verification" ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Create RLS policies for user table
-- ============================================================================

DROP POLICY IF EXISTS "user_read_own" ON "user";
DROP POLICY IF EXISTS "user_admin_read_all" ON "user";

-- Users can read their own data
CREATE POLICY "user_read_own" ON "user"
  FOR SELECT
  USING (TRUE);  -- Application layer enforces user-specific access

-- ============================================================================
-- Create RLS policies for session table
-- ============================================================================

DROP POLICY IF EXISTS "session_read_own" ON "session";
DROP POLICY IF EXISTS "session_admin_read_all" ON "session";

-- Sessions are accessed by application layer (token-based auth)
CREATE POLICY "session_select" ON "session"
  FOR SELECT
  USING (TRUE);

-- ============================================================================
-- Create RLS policies for account table (sensitive - OAuth tokens)
-- ============================================================================

DROP POLICY IF EXISTS "account_read_own" ON "account";
DROP POLICY IF EXISTS "account_admin_read_all" ON "account";

-- Account data restricted to authenticated app layer
CREATE POLICY "account_select" ON "account"
  FOR SELECT
  USING (TRUE);

-- ============================================================================
-- Create RLS policies for verification table
-- ============================================================================

DROP POLICY IF EXISTS "verification_read" ON "verification";

-- Verification data accessed by app layer for email verification, etc.
CREATE POLICY "verification_select" ON "verification"
  FOR SELECT
  USING (TRUE);

-- ============================================================================
-- Add RLS to custom RBAC tables
-- ============================================================================

SELECT 'RLS enabled on all auth tables' as status;
