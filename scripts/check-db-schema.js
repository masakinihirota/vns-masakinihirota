const fs = require('fs');
const path = require('path');
const envPath = process.env.ENV_FILE || '.env.local';
require('dotenv').config({ path: envPath });
const postgres = require('postgres');

const REQUIRED_TABLES = [
    'user_preferences',
    'audit_logs',
    'session_tokens',
    'two_factor_secrets',
    'rate_limit_keys',
    'feature_flags',
];

function checkMigrationFileIntegrity() {
    const drizzleDir = path.resolve(process.cwd(), 'drizzle');
    const journalPath = path.resolve(process.cwd(), 'drizzle/meta/_journal.json');

    if (!fs.existsSync(drizzleDir) || !fs.existsSync(journalPath)) {
        return {
            hasError: true,
            missingJournalOrDir: true,
            duplicatePrefixes: [],
            orphanFiles: [],
        };
    }

    const sqlFiles = fs
        .readdirSync(drizzleDir)
        .filter((fileName) => /^\d{4}_.+\.sql$/.test(fileName))
        .sort();

    const journal = JSON.parse(fs.readFileSync(journalPath, 'utf8'));
    const expectedFiles = new Set((journal.entries || []).map((entry) => `${entry.tag}.sql`));

    const prefixMap = new Map();
    for (const fileName of sqlFiles) {
        const match = fileName.match(/^(\d{4})_/);
        if (!match) continue;
        const prefix = match[1];
        if (!prefixMap.has(prefix)) {
            prefixMap.set(prefix, []);
        }
        prefixMap.get(prefix).push(fileName);
    }

    const duplicatePrefixes = [...prefixMap.entries()]
        .filter(([, files]) => files.length > 1)
        .map(([prefix, files]) => ({ prefix, files }));

    const orphanFiles = sqlFiles.filter((fileName) => !expectedFiles.has(fileName));

    return {
        hasError: duplicatePrefixes.length > 0 || orphanFiles.length > 0,
        missingJournalOrDir: false,
        duplicatePrefixes,
        orphanFiles,
    };
}

async function main() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        console.error(`[DB_SCHEMA] DATABASE_URL is missing in ${envPath}`);
        process.exit(1);
    }

    const sql = postgres(databaseUrl, { prepare: false });

    try {
        const tables = await sql`
      select tablename
      from pg_tables
      where schemaname = 'public'
      order by tablename
    `;

        const tableSet = new Set(tables.map((row) => row.tablename));
        const missingTables = REQUIRED_TABLES.filter((table) => !tableSet.has(table));

        const rlsStatus = await sql`
      select relname as table_name, relrowsecurity as rls_enabled
      from pg_class
      where relkind = 'r'
        and relnamespace = 'public'::regnamespace
      order by relname
    `;

        const rlsOff = rlsStatus
            .filter((row) => REQUIRED_TABLES.includes(row.table_name) && !row.rls_enabled)
            .map((row) => row.table_name);

        const timestampWithoutTz = await sql`
      select table_name, column_name
      from information_schema.columns
      where table_schema = 'public'
        and data_type = 'timestamp without time zone'
      order by table_name, column_name
    `;

        const migrationIntegrity = checkMigrationFileIntegrity();

        let hasError = false;

        console.log('=== DB Schema Check ===');

        if (missingTables.length > 0) {
            hasError = true;
            console.error(`[ERROR] Missing required tables: ${missingTables.join(', ')}`);
        } else {
            console.log('[OK] Required tables exist');
        }

        if (rlsOff.length > 0) {
            hasError = true;
            console.error(`[ERROR] RLS is OFF on required tables: ${rlsOff.join(', ')}`);
        } else {
            console.log('[OK] RLS is enabled on required tables');
        }

        if (timestampWithoutTz.length > 0) {
            hasError = true;
            console.error('[ERROR] timestamp without time zone columns found:');
            for (const row of timestampWithoutTz) {
                console.error(`  - ${row.table_name}.${row.column_name}`);
            }
        } else {
            console.log('[OK] All timestamp columns are timezone-aware');
        }

        if (migrationIntegrity.missingJournalOrDir) {
            hasError = true;
            console.error('[ERROR] Missing drizzle directory or drizzle/meta/_journal.json');
        } else {
            if (migrationIntegrity.duplicatePrefixes.length > 0) {
                hasError = true;
                console.error('[ERROR] Duplicate migration prefixes detected:');
                for (const duplicate of migrationIntegrity.duplicatePrefixes) {
                    console.error(`  - ${duplicate.prefix}: ${duplicate.files.join(', ')}`);
                }
            } else {
                console.log('[OK] No duplicate migration prefixes in drizzle/*.sql');
            }

            if (migrationIntegrity.orphanFiles.length > 0) {
                hasError = true;
                console.error('[ERROR] Migration files not tracked in drizzle/meta/_journal.json:');
                for (const fileName of migrationIntegrity.orphanFiles) {
                    console.error(`  - ${fileName}`);
                }
            } else {
                console.log('[OK] All migration files are tracked in drizzle/meta/_journal.json');
            }
        }

        if (hasError) {
            console.error(`\n[DB_SCHEMA] FAILED (env: ${envPath})`);
            process.exit(1);
        }

        console.log(`\n[DB_SCHEMA] PASSED (env: ${envPath})`);
    } catch (error) {
        console.error(`[DB_SCHEMA] FAILED with runtime error (env: ${envPath})`);
        console.error(error);
        process.exit(1);
    } finally {
        await sql.end();
    }
}

main();
