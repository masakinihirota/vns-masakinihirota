const fs = require('fs');
const path = require('path');
const postgres = require('postgres');

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

async function executeChunks(sql, chunks, label) {
    for (let index = 0; index < chunks.length; index += 1) {
        const chunk = chunks[index];
        try {
            await sql.unsafe(chunk);
            console.log(`[DB_APPLY] ${label} chunk ${index + 1}/${chunks.length}: OK`);
        } catch (error) {
            console.error(`[DB_APPLY] ${label} chunk ${index + 1}/${chunks.length}: FAILED`);
            console.error(error);
            throw error;
        }
    }
}

async function main() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        console.error(`[DB_APPLY] DATABASE_URL is missing in ${envPath}`);
        process.exit(1);
    }

    const sql = postgres(databaseUrl, { prepare: false });

    try {
        const migration0006 = readFile('drizzle/0006_database_security_foundation.sql');

        console.log('[DB_APPLY] Applying 0006_database_security_foundation.sql ...');
        await executeChunks(sql, splitByStatementBreakpoint(migration0006), '0006');

        const rlsCoreSql = `
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
          FROM \"user\" u
          WHERE u.id = app.current_auth_user_id()
            AND u.role = 'platform_admin'
        );
      $$;

      ALTER TABLE IF EXISTS \"verification\" ENABLE ROW LEVEL SECURITY;
      ALTER TABLE IF EXISTS \"user_preferences\" ENABLE ROW LEVEL SECURITY;
      ALTER TABLE IF EXISTS \"session_tokens\" ENABLE ROW LEVEL SECURITY;
      ALTER TABLE IF EXISTS \"two_factor_secrets\" ENABLE ROW LEVEL SECURITY;
      ALTER TABLE IF EXISTS \"rate_limit_keys\" ENABLE ROW LEVEL SECURITY;
      ALTER TABLE IF EXISTS \"feature_flags\" ENABLE ROW LEVEL SECURITY;
      ALTER TABLE IF EXISTS \"audit_logs\" ENABLE ROW LEVEL SECURITY;

      DROP POLICY IF EXISTS verification_admin_only ON \"verification\";
      CREATE POLICY verification_admin_only ON \"verification\"
        FOR ALL
        USING (app.is_platform_admin())
        WITH CHECK (app.is_platform_admin());

      DROP POLICY IF EXISTS user_preferences_owner_or_admin ON \"user_preferences\";
      CREATE POLICY user_preferences_owner_or_admin ON \"user_preferences\"
        FOR ALL
        USING (\"user_id\" = app.current_auth_user_id() OR app.is_platform_admin())
        WITH CHECK (\"user_id\" = app.current_auth_user_id() OR app.is_platform_admin());

      DROP POLICY IF EXISTS session_tokens_owner_or_admin ON \"session_tokens\";
      CREATE POLICY session_tokens_owner_or_admin ON \"session_tokens\"
        FOR ALL
        USING (\"user_id\" = app.current_auth_user_id() OR app.is_platform_admin())
        WITH CHECK (\"user_id\" = app.current_auth_user_id() OR app.is_platform_admin());

      DROP POLICY IF EXISTS two_factor_secrets_owner_or_admin ON \"two_factor_secrets\";
      CREATE POLICY two_factor_secrets_owner_or_admin ON \"two_factor_secrets\"
        FOR ALL
        USING (\"user_id\" = app.current_auth_user_id() OR app.is_platform_admin())
        WITH CHECK (\"user_id\" = app.current_auth_user_id() OR app.is_platform_admin());

      DROP POLICY IF EXISTS rate_limit_keys_admin_only ON \"rate_limit_keys\";
      CREATE POLICY rate_limit_keys_admin_only ON \"rate_limit_keys\"
        FOR ALL
        USING (app.is_platform_admin())
        WITH CHECK (app.is_platform_admin());

      DROP POLICY IF EXISTS feature_flags_admin_read_public ON \"feature_flags\";
      CREATE POLICY feature_flags_admin_read_public ON \"feature_flags\"
        FOR SELECT
        USING (\"enabled\" = true OR app.is_platform_admin());

      DROP POLICY IF EXISTS feature_flags_admin_write ON \"feature_flags\";
      CREATE POLICY feature_flags_admin_write ON \"feature_flags\"
        FOR ALL
        USING (app.is_platform_admin())
        WITH CHECK (app.is_platform_admin());

      DROP POLICY IF EXISTS audit_logs_admin_only ON \"audit_logs\";
      CREATE POLICY audit_logs_admin_only ON \"audit_logs\"
        FOR ALL
        USING (app.is_platform_admin())
        WITH CHECK (app.is_platform_admin());
    `;

        console.log('[DB_APPLY] Applying core RLS policies ...');
        await sql.unsafe(rlsCoreSql);

        console.log(`[DB_APPLY] PASSED (env: ${envPath})`);
    } catch (error) {
        console.error(`[DB_APPLY] FAILED (env: ${envPath})`);
        console.error(error);
        process.exit(1);
    } finally {
        await sql.end();
    }
}

main();
