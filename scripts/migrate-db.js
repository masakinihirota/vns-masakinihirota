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
    const existingTables = await sql`
      select tablename
      from pg_tables
      where schemaname = 'public'
    `;

    const tableSet = new Set(existingTables.map((row) => row.tablename));
    const hasBaselineTables = BASELINE_TABLES.every((table) => tableSet.has(table));

    const migrationTable = await sql`
      select exists (
        select 1
        from information_schema.tables
        where table_schema = 'drizzle'
          and table_name = '__drizzle_migrations'
      ) as exists
    `;

    let migrationCount = 0;
    if (migrationTable[0]?.exists) {
        const countRows = await sql`select count(*)::int as count from drizzle.__drizzle_migrations`;
        migrationCount = countRows[0]?.count ?? 0;
    }

    return {
        hasBaselineTables,
        migrationCount,
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

        if (!state.hasBaselineTables) {
            logger.info('[DB_MIGRATE] Fresh DB detected. Applying full drizzle migration history.');
            const status = runDrizzleMigrate();
            if (status !== 0) {
                process.exit(status);
            }
        } else if (state.migrationCount === 0) {
            logger.warn('[DB_MIGRATE] Existing baseline tables detected with empty drizzle migration history.');
            logger.warn('[DB_MIGRATE] Skipping full replay to avoid "relation already exists" and applying idempotent layer.');
        } else {
            logger.info('[DB_MIGRATE] Existing migration history detected. Applying pending drizzle migrations.');
            const status = runDrizzleMigrate();
            if (status !== 0) {
                process.exit(status);
            }
        }

        const securityStatus = runApplySecurity();
        if (securityStatus !== 0) {
            process.exit(securityStatus);
        }

        logger.info(`[DB_MIGRATE] PASSED (env: ${envPath})`);
    } catch (error) {
        logger.error(`[DB_MIGRATE] FAILED (env: ${envPath})`, { error });
        process.exit(1);
    } finally {
        await sql.end();
    }
}

main();
