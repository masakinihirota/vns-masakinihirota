const envPath = process.env.ENV_FILE || '.env.local';
require('dotenv').config({ path: envPath });
const postgres = require('postgres');

const AUTH_TABLES = ['user', 'session', 'account', 'verification'];
const REQUIRED_COLUMNS = {
  user: ['id', 'name', 'email', 'email_verified', 'created_at', 'updated_at'],
  session: ['id', 'token', 'expires_at', 'created_at', 'updated_at', 'user_id'],
  account: ['id', 'account_id', 'provider_id', 'user_id', 'created_at', 'updated_at'],
  verification: ['id', 'identifier', 'value', 'expires_at', 'created_at', 'updated_at'],
};

const LEGACY_CAMEL_COLUMNS = {
  user: ['emailVerified', 'createdAt', 'updatedAt'],
  session: ['expiresAt', 'createdAt', 'updatedAt', 'ipAddress', 'userAgent', 'userId'],
  account: ['accountId', 'providerId', 'userId', 'accessToken', 'refreshToken', 'idToken', 'createdAt', 'updatedAt'],
  verification: ['expiresAt', 'createdAt', 'updatedAt'],
};

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error(`[DB_CHECK] DATABASE_URL is missing in ${envPath}`);
    process.exit(1);
  }

  const sql = postgres(databaseUrl, { prepare: false });

  try {
    const columns = await sql`
      select table_name, column_name
      from information_schema.columns
      where table_schema = 'public'
        and table_name in ('user', 'session', 'account', 'verification')
      order by table_name, ordinal_position
    `;

    const rlsRows = await sql`
      select relname as table_name, relrowsecurity as rls_enabled, relforcerowsecurity as rls_forced
      from pg_class
      where relkind = 'r' and relname in ('user', 'session', 'account', 'verification')
      order by relname
    `;

    const policyRows = await sql`
      select tablename, policyname
      from pg_policies
      where schemaname = 'public' and tablename in ('user', 'session', 'account', 'verification')
      order by tablename, policyname
    `;

    const byTable = new Map();
    for (const row of columns) {
      if (!byTable.has(row.table_name)) byTable.set(row.table_name, new Set());
      byTable.get(row.table_name).add(row.column_name);
    }

    let hasError = false;

    console.log('=== Auth DB Schema Check ===');
    for (const table of AUTH_TABLES) {
      const colSet = byTable.get(table) || new Set();
      const missing = REQUIRED_COLUMNS[table].filter((name) => !colSet.has(name));
      const legacy = LEGACY_CAMEL_COLUMNS[table].filter((name) => colSet.has(name));

      if (missing.length > 0) {
        hasError = true;
        console.error(`[ERROR] ${table}: missing required columns -> ${missing.join(', ')}`);
      } else {
        console.log(`[OK] ${table}: required snake_case columns exist`);
      }

      if (legacy.length > 0) {
        console.warn(`[WARN] ${table}: legacy camelCase columns still present -> ${legacy.join(', ')}`);
      }
    }

    console.log('\n=== RLS Status (Auth Tables) ===');
    for (const table of AUTH_TABLES) {
      const row = rlsRows.find((r) => r.table_name === table);
      if (!row) {
        console.warn(`[WARN] ${table}: table not found in pg_class`);
        continue;
      }
      const mark = row.rls_enabled ? 'ON' : 'OFF';
      console.log(`[${mark}] ${table} (forced=${row.rls_forced})`);
    }

    const policiesByTable = new Map();
    for (const row of policyRows) {
      if (!policiesByTable.has(row.tablename)) policiesByTable.set(row.tablename, []);
      policiesByTable.get(row.tablename).push(row.policyname);
    }

    console.log('\n=== RLS Policies (Auth Tables) ===');
    for (const table of AUTH_TABLES) {
      const names = policiesByTable.get(table) || [];
      if (names.length === 0) {
        console.log(`[INFO] ${table}: no policies`);
      } else {
        console.log(`[INFO] ${table}: ${names.join(', ')}`);
      }
    }

    if (hasError) {
      console.error('\n[DB_CHECK] FAILED: auth schema is incompatible with Better Auth runtime expectations.');
      console.error('[DB_CHECK] Run: pnpm db:auth:fix-compat');
      process.exit(1);
    }

    console.log(`\n[DB_CHECK] PASSED (env: ${envPath})`);
  } catch (error) {
    console.error(`[DB_CHECK] FAILED with runtime error (env: ${envPath})`);
    console.error(error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main();
