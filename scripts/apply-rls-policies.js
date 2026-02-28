const fs = require('fs');
const path = require('path');
const envPath = process.env.ENV_FILE || '.env.local';
require('dotenv').config({ path: envPath });
const postgres = require('postgres');

async function main() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        console.error(`[RLS_APPLY] DATABASE_URL is missing in ${envPath}`);
        process.exit(1);
    }

    const sql = postgres(databaseUrl, { prepare: false });

    try {
        console.log('\n=== Applying RLS Policies ===\n');

        // Read RLS policies SQL file
        const rlsPoliciesPath = path.join(__dirname, '../drizzle/rls-policies.sql');
        const rlsPoliciesSql = fs.readFileSync(rlsPoliciesPath, 'utf-8');

        // Split by statement (using --> statement-breakpoint convention if present)
        const statements = rlsPoliciesSql
            .split('\n')
            .filter((line) => line.trim() && !line.startsWith('--'))
            .join('\n')
            .split(';')
            .map((stmt) => stmt.trim())
            .filter((stmt) => stmt.length > 0);

        console.log(`Found ${statements.length} SQL statements to execute\n`);

        let executed = 0;
        let skipped = 0;

        for (const statement of statements) {
            // Skip comments and empty lines
            if (statement.startsWith('--')) continue;

            try {
                // Extract operation type for logging
                const opMatch = statement.match(/^(ALTER|DROP|CREATE)\s+(\w+)/i);
                const opType = opMatch ? `${opMatch[1]} ${opMatch[2]}` : 'EXECUTE';

                await sql.unsafe(statement);
                console.log(`✓ ${opType}`);
                executed++;
            } catch (err) {
                // Some statements might fail (e.g., DROP IF NOT EXISTS when doesn't exist)
                // This is expected behavior
                if (
                    err.message.includes('already exists') ||
                    err.message.includes('does not exist') ||
                    err.message.includes('ENOENT')
                ) {
                    // console.log(`⊘ SKIP: ${statement.substring(0, 60)}...`);
                    skipped++;
                } else {
                    console.error(`✗ ERROR in statement:`, statement.substring(0, 100));
                    console.error(`  Cause: ${err.message}\n`);
                    // Continue processing other statements
                }
            }
        }

        console.log(`\n[RLS_APPLY] Executed: ${executed}, Skipped: ${skipped}\n`);

        // Verify RLS is enabled
        console.log('=== Verification: RLS Status ===\n');

        const rlsStatus = await sql`
            SELECT relname as table_name, relrowsecurity as rls_enabled
            FROM pg_class
            WHERE relkind = 'r'
              AND relname IN ('user', 'session', 'account', 'verification', 'groups', 'group_members', 'nations', 'nation_groups')
            ORDER BY relname
        `;

        for (const row of rlsStatus) {
            const status = row.rls_enabled ? '✓ ON' : '✗ OFF';
            console.log(`  ${row.table_name}: RLS ${status}`);
        }

        console.log('\n=== Verification: Policies Count ===\n');

        const policyCounts = await sql`
            SELECT tablename, COUNT(*) as policy_count
            FROM pg_policies
            WHERE schemaname = 'public'
              AND tablename IN ('user', 'session', 'account', 'verification', 'groups', 'group_members', 'nations', 'nation_groups')
            GROUP BY tablename
            ORDER BY tablename
        `;

        for (const row of policyCounts) {
            console.log(`  ${row.table_name}: ${row.policy_count} policies`);
        }

        console.log('\n[RLS_APPLY] COMPLETED ✓\n');
        process.exit(0);
    } catch (err) {
        console.error('[RLS_APPLY] FAILED:', err.message);
        process.exit(1);
    }
}

main();
