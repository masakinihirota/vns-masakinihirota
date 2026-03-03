const fs = require('fs');
const path = require('path');

function main() {
    const drizzleDir = path.resolve(process.cwd(), 'drizzle');
    const journalPath = path.resolve(process.cwd(), 'drizzle/meta/_journal.json');

    if (!fs.existsSync(drizzleDir)) {
        console.error('[MIGRATION_FILES] drizzle directory not found');
        process.exit(1);
    }

    if (!fs.existsSync(journalPath)) {
        console.error('[MIGRATION_FILES] drizzle/meta/_journal.json not found');
        process.exit(1);
    }

    const sqlFiles = fs
        .readdirSync(drizzleDir)
        .filter((fileName) => /^\d{4}_.+\.sql$/.test(fileName))
        .sort();

    const journal = JSON.parse(fs.readFileSync(journalPath, 'utf8'));
    const entries = journal.entries || [];
    const expectedFiles = entries
        .map((entry) => `${entry.tag}.sql`)
        .sort();

    const duplicatePrefixMap = new Map();
    for (const fileName of sqlFiles) {
        const match = fileName.match(/^(\d{4})_/);
        if (!match) continue;
        const prefix = match[1];
        if (!duplicatePrefixMap.has(prefix)) {
            duplicatePrefixMap.set(prefix, []);
        }
        duplicatePrefixMap.get(prefix).push(fileName);
    }

    const duplicatePrefixes = [...duplicatePrefixMap.entries()]
        .filter(([, files]) => files.length > 1)
        .map(([prefix, files]) => ({ prefix, files }));

    const missingInJournal = sqlFiles.filter((fileName) => !expectedFiles.includes(fileName));
    const missingSqlFile = expectedFiles.filter((fileName) => !sqlFiles.includes(fileName));

    let hasError = false;

    console.log('=== Migration File Integrity Check ===');

    if (duplicatePrefixes.length > 0) {
        hasError = true;
        console.error('[ERROR] Duplicate migration prefixes detected:');
        for (const duplicate of duplicatePrefixes) {
            console.error(`  - ${duplicate.prefix}: ${duplicate.files.join(', ')}`);
        }
    } else {
        console.log('[OK] No duplicate migration prefixes');
    }

    if (missingInJournal.length > 0) {
        hasError = true;
        console.error('[ERROR] SQL files not tracked in _journal.json:');
        for (const fileName of missingInJournal) {
            console.error(`  - ${fileName}`);
        }
    } else {
        console.log('[OK] All SQL migration files are tracked in _journal.json');
    }

    if (missingSqlFile.length > 0) {
        hasError = true;
        console.error('[ERROR] _journal.json entries without SQL files:');
        for (const fileName of missingSqlFile) {
            console.error(`  - ${fileName}`);
        }
    } else {
        console.log('[OK] All _journal.json migration entries have SQL files');
    }

    if (hasError) {
        console.error('\n[MIGRATION_FILES] FAILED');
        process.exit(1);
    }

    console.log('\n[MIGRATION_FILES] PASSED');
}

main();
