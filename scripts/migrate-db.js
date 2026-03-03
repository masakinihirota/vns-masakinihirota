const { spawnSync } = require('child_process');
const postgres = require('postgres');

// simple logger
const logger = {
    info: console.log.bind(console),
    debug: console.debug ? console.debug.bind(console) : console.log.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console),
};

const envPath = process.env.ENV_FILE || '.env.local';
require('dotenv').config({ path: envPath });

const BASELINE_TABLES = ['user', 'session', 'account', 'verification'];

function runCommand(command, args) {
    const executable = command === 'node'
        ? process.execPath
        : (process.platform === 'win32' ? `${command}.cmd` : command);
    const result = spawnSync(executable, args, {
        stdio: 'inherit',
        env: process.env,
        cwd: process.cwd(),
    });

    if (result.error) {
        throw result.error;
    }

    return result.status === null ? 1 : result.status;
}

async function inspectDbState(sql) {
    // Check if migration metadata table exists
    const migrationMetaTableResult = await sql`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = 'drizzle'
        AND table_name = '__drizzle_migrations'
    ) as "exists"
  `;

    const hasMigrationTable = migrationMetaTableResult[0]?.exists ?? false;

    // Check for raw baseline tables (user, session, account, verification)
    const existingTables = await sql`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
  `;

    const tableSet = new Set(existingTables.map((row) => row.tablename));
    const hasBaselineTables = BASELINE_TABLES.every((table) => tableSet.has(table));

    // Check migration history
    let migrationCount = 0;
    if (hasMigrationTable) {
        const countRows = await sql`
      SELECT count(*)::int as "count" FROM drizzle.__drizzle_migrations
    `;
        migrationCount = countRows[0]?.count ?? 0;
    }

    return {
        hasMigrationTable,    // ✅ Better indicator of full Drizzle setup
        hasBaselineTables,    // May exist without full Drizzle (manual creation)
    };
}

function runDrizzleMigrate() {
    logger.info('[DB_MIGRATE] Running drizzle-kit migrate ...');
    return runCommand('pnpm', ['exec', 'drizzle-kit', 'migrate']);
}

function runApplySecurity() {
    logger.info('[DB_MIGRATE] Running security/idempotent migration layer ...');
    return runCommand('node', ['scripts/apply-db-security-migrations.js']);
}

async function main() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        logger.error(`[DB_MIGRATE] DATABASE_URL is missing in ${envPath}`);
        process.exit(1);
    }

    const sql = postgres(databaseUrl, { prepare: false });

    try {
        const state = await inspectDbState(sql);

        // Priority 1: Check for Drizzle migration metadata table
        if (!state.hasMigrationTable) {
            // Completely fresh database, or existing tables created without Drizzle
            if (state.hasBaselineTables) {
                logger.warn('[DB_MIGRATE] ⚠️ CAREFUL: Baseline tables exist but NO Drizzle migration history detected!');
                logger.warn('[DB_MIGRATE] This may indicate:');
                logger.warn('[DB_MIGRATE]   - Tables were created manually (not via Drizzle)');
                logger.warn('[DB_MIGRATE]   - Previous migration attempt failed partway');
                logger.warn('[DB_MIGRATE]   - Database was restored from backup');
                logger.warn('[DB_MIGRATE] → Skipping full replay to avoid "relation already exists" errors');
                logger.warn('[DB_MIGRATE] → Applying only idempotent security layer...');
            } else {
                logger.info('[DB_MIGRATE] Fresh database detected. Applying full Drizzle migration history.');
                const status = runDrizzleMigrate();
                if (status !== 0) {
                    process.exit(status);
                }
            }
        } else if (state.migrationCount === 0) {
            // Migration table exists but is empty - unusual state
            logger.warn('[DB_MIGRATE] ⚠️ Drizzle migration table exists but is empty.');
            logger.warn('[DB_MIGRATE] This indicates previous migration setup was incomplete.');
            logger.warn('[DB_MIGRATE] Applying full migration history...');
            const status = runDrizzleMigrate();
            if (status !== 0) {
                process.exit(status);
            }
        } else {
            // Normal case: migration history exists
            logger.info(
                `[DB_MIGRATE] Existing migration history detected (${state.migrationCount} applied). ` +
                'Applying pending Drizzle migrations...'
            );
            const status = runDrizzleMigrate();
            if (status !== 0) {
                process.exit(status);
            }
        }

        const securityStatus = runApplySecurity();
        if (securityStatus !== 0) {
            process.exit(securityStatus);
        }

        logger.info(`[DB_MIGRATE] ✅ PASSED (env: ${envPath})`);
    } catch (error) {
        logger.error(`[DB_MIGRATE] ❌ FAILED (env: ${envPath})`);
        if (error instanceof Error) {
            logger.error(`  Error: ${error.message}`);
        } process.exit(1);
    }
}) ();
