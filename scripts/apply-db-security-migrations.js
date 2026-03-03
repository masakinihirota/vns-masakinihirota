const fs = require('fs');
const path = require('path');
const postgres = require('postgres');

// simple logger wrapper (avoid requiring TS compile)
const logger = {
  info: console.log.bind(console),
  debug: console.debug ? console.debug.bind(console) : console.log.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
};

const envPath = process.env.ENV_FILE || '.env.local';
require('dotenv').config({ path: envPath });

function readFile(relativePath) {
  return fs.readFileSync(path.resolve(process.cwd(), relativePath), 'utf8');
}

function splitByStatementBreakpoint(sqlText) {
  return sqlText
    .split(/-->\s*statement-breakpoint/g)
    .map((chunk) => chunk.trim())
    .filter(Boolean);
}

/**
 * Execute SQL chunks sequentially with error handling and logging
 * 注意: postgres.jsでは各sql.unsafe()が自動的に自身のコンテキストで実行される
 * 複数chunkを一つのトランザクションで実行する場合は、呼び出し側でトランザクション制御が必要
 *
 * @param {import('postgres').Sql} sql - Postgres client instance
 * @param {string[]} chunks - Array of SQL statements to execute
 * @param {string} label - Label for logging (e.g., migration name)
 * @param {boolean} useTransaction - Whether to wrap chunks in a transaction
 * @throws {Error} If any chunk fails to execute
 */
async function executeChunks(sql, chunks, label, useTransaction = false) {
  if (useTransaction) {
    return executeChunksInTransaction(sql, chunks, label);
  }

  for (let index = 0; index < chunks.length; index += 1) {
    const chunk = chunks[index];
    if (!chunk.trim()) continue; // Skip empty chunks

    try {
      await sql.unsafe(chunk);
      logger.info(`[DB_APPLY] ${label} chunk ${index + 1}/${chunks.length}: OK`);
    } catch (error) {
      logger.error(`[DB_APPLY] ${label} chunk ${index + 1}/${chunks.length}: FAILED`);

      // Provide detailed error context
      if (error instanceof Error) {
        logger.error(`  Error: ${error.message}`);
        if (error.code) logger.error(`  Code: ${error.code}`);
      }

      throw error;
    }
  }
}

/**
 * Execute chunks within a single transaction (all-or-nothing)
 */
async function executeChunksInTransaction(sql, chunks, label) {
  try {
    await sql.begin(async (tx) => {
      for (let index = 0; index < chunks.length; index += 1) {
        const chunk = chunks[index];
        if (!chunk.trim()) continue;

        try {
          await tx.unsafe(chunk);
          logger.info(`[DB_APPLY] ${label} chunk ${index + 1}/${chunks.length}: OK`);
        } catch (error) {
          logger.error(`[DB_APPLY] ${label} chunk ${index + 1}/${chunks.length}: FAILED`);
          if (error instanceof Error) {
            logger.error(`  Error: ${error.message}`);
            if (error.code) logger.error(`  Code: ${error.code}`);
          }
          throw error; // Transaction will rollback
        }
      }
    });
  } catch (error) {
    logger.error(`[DB_APPLY] Transaction rolled back for ${label}`);
    throw error;
  }
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    logger.error(`[DB_APPLY] DATABASE_URL is missing in ${envPath}`);
    process.exit(1);
  }

  const sql = postgres(databaseUrl, { prepare: false });

  try {
    // Step 1: Apply migration 0006 (idempotent migration file)
    // Use transaction for atomicity - all or nothing
    const migration0006 = readFile('drizzle/0006_database_security_foundation.sql');
    logger.info('[DB_APPLY] Step 1: Applying 0006_database_security_foundation.sql ...');
    try {
      await executeChunks(sql, splitByStatementBreakpoint(migration0006), '0006', true);
    } catch {
      logger.error('[DB_APPLY] Step 1: FAILED and rolled back');
      throw new Error('Migration 0006 failed. All changes have been rolled back.');
    }

    // Step 2: Apply RLS helper functions (core RLS scaffolding)
    logger.info('[DB_APPLY] Step 2: Creating RLS helper functions ...');
    try {
      await sql.begin(async (tx) => {
        await tx.unsafe(`
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
        `);
      });
      logger.info('[DB_APPLY] Step 2: Done');
    } catch (error) {
      logger.error('[DB_APPLY] Step 2: FAILED - RLS functions could not be created');
      throw error;
    }

    // Step 3: Enable RLS on all tables
    logger.info('[DB_APPLY] Step 3: Enabling RLS on all tables ...');
    const rlsEnableSql = `
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
    `;
    await sql.unsafe(rlsEnableSql);
    logger.info('[DB_APPLY] Step 3: Done');

    // Step 4: Apply security-specific RLS policies
    // Use transaction for atomicity
    logger.info('[DB_APPLY] Step 4: Applying security-specific RLS policies ...');
    try {
      await sql.begin(async (tx) => {
        await tx.unsafe(`
          DROP POLICY IF EXISTS verification_admin_only ON "verification";
          CREATE POLICY verification_admin_only ON "verification"
            FOR ALL
            USING (app.is_platform_admin())
            WITH CHECK (app.is_platform_admin());

          DROP POLICY IF EXISTS user_preferences_owner_or_admin ON "user_preferences";
          CREATE POLICY user_preferences_owner_or_admin ON "user_preferences"
            FOR ALL
            USING ("user_id" = app.current_auth_user_id() OR app.is_platform_admin())
            WITH CHECK ("user_id" = app.current_auth_user_id() OR app.is_platform_admin());

          DROP POLICY IF EXISTS session_tokens_owner_or_admin ON "session_tokens";
          CREATE POLICY session_tokens_owner_or_admin ON "session_tokens"
            FOR ALL
            USING ("user_id" = app.current_auth_user_id() OR app.is_platform_admin())
            WITH CHECK ("user_id" = app.current_auth_user_id() OR app.is_platform_admin());

          DROP POLICY IF EXISTS two_factor_secrets_owner_or_admin ON "two_factor_secrets";
          CREATE POLICY two_factor_secrets_owner_or_admin ON "two_factor_secrets"
            FOR ALL
            USING ("user_id" = app.current_auth_user_id() OR app.is_platform_admin())
            WITH CHECK ("user_id" = app.current_auth_user_id() OR app.is_platform_admin());

          DROP POLICY IF EXISTS rate_limit_keys_admin_only ON "rate_limit_keys";
          CREATE POLICY rate_limit_keys_admin_only ON "rate_limit_keys"
            FOR ALL
            USING (app.is_platform_admin())
            WITH CHECK (app.is_platform_admin());

          DROP POLICY IF EXISTS feature_flags_admin_read_public ON "feature_flags";
          CREATE POLICY feature_flags_admin_read_public ON "feature_flags"
            FOR SELECT
            USING ("enabled" = true OR app.is_platform_admin());

          DROP POLICY IF EXISTS feature_flags_admin_write ON "feature_flags";
          CREATE POLICY feature_flags_admin_write ON "feature_flags"
            FOR ALL
            USING (app.is_platform_admin())
            WITH CHECK (app.is_platform_admin());

          DROP POLICY IF EXISTS audit_logs_admin_only ON "audit_logs";
          CREATE POLICY audit_logs_admin_only ON "audit_logs"
            FOR ALL
            USING (app.is_platform_admin())
            WITH CHECK (app.is_platform_admin());
        `);
      });
      logger.info('[DB_APPLY] Step 4: Done');
    } catch (error) {
      logger.error('[DB_APPLY] Step 4: FAILED and rolled back - RLS policies could not be applied');
      throw error;
    }

    logger.info(`[DB_APPLY] ✅ PASSED - All security migrations applied successfully (env: ${envPath})`);
  } catch (error) {
    logger.error(`[DB_APPLY] ❌ FAILED (env: ${envPath})`);
    if (error instanceof Error) {
      logger.error(`  Message: ${error.message}`);
    }
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main();
