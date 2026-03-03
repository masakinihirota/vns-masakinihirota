/**
 * Console Log Detector
 *
 * Detects console.log, console.warn, debugger statements that should not be committed.
 * Allowed: logger.* (custom logger module)
 * Banned: console.log, console.warn, console.error (except in specific files)
 *
 * **Incremental Mode**: Only checks STAGED files (git diff --cached)
 * This allows gradual cleanup of existing code without blocking commits.
 *
 * Usage: node scripts/check-console-logs.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const srcDir = path.resolve(process.cwd(), 'src');

// Files where console.log is allowed (test files, dev tools, etc)
const ALLOWED_PATHS = [
    /\/__tests__\//,
    /\/scripts\//,
    /dev-dashboard/,
    /\.test\.(ts|tsx)$/,
    /\.spec\.(ts|tsx)$/,
];

// Patterns to detect
const BANNED_PATTERNS = [
    {
        regex: /\bconsole\.(log|warn|error)\s*\(/g,
        message: (match) => `Found ${match} - use logger.* instead`,
        type: 'console-method',
    },
    {
        regex: /\bdebugger\b/g,
        message: () => 'Found debugger statement',
        type: 'debugger',
    },
];

function isAllowedPath(filePath) {
    return ALLOWED_PATHS.some((pattern) => pattern.test(filePath));
}

function getFilesRecursive(dir) {
    const files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        // Skip node_modules, .next, etc
        if (['.next', 'node_modules', '.git', 'dist', '.husky'].includes(entry.name)) {
            continue;
        }

        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            files.push(...getFilesRecursive(fullPath));
        } else if (entry.isFile() && /\.(ts|tsx|js|jsx)$/.test(entry.name)) {
            files.push(fullPath);
        }
    }

    return files;
}

function checkFile(filePath) {
    if (isAllowedPath(filePath)) {
        return [];
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const issues = [];

    BANNED_PATTERNS.forEach((pattern) => {
        let match;
        while ((match = pattern.regex.exec(content)) !== null) {
            const lineNum = content.substring(0, match.index).split('\n').length;
            issues.push({
                type: pattern.type,
                message: pattern.message(match[0]),
                line: lineNum,
                column: match.index - content.lastIndexOf('\n', match.index - 1),
            });
        }
    });

    return issues;
}

function getStagedFiles() {
    try {
        const output = execSync('git diff --cached --name-only --diff-filter=ACM', {
            encoding: 'utf8',
            cwd: process.cwd(),
        });

        return output
            .trim()
            .split('\n')
            .filter((file) => file && /\.(ts|tsx|js|jsx)$/.test(file))
            .map((file) => path.resolve(process.cwd(), file))
            .filter((file) => fs.existsSync(file));
    } catch (error) {
        // Not in a git repository or no staged files
        console.log('[CONSOLE_LOGS] SKIPPED - No staged files or not in git repository');
        return [];
    }
}

function main() {
    // Only check STAGED files (incremental mode)
    const stagedFiles = getStagedFiles();

    if (stagedFiles.length === 0) {
        console.log('[CONSOLE_LOGS] PASSED - No staged files to check');
        return;
    }

    const allIssues = [];

    for (const filePath of stagedFiles) {
        const issues = checkFile(filePath);
        if (issues.length > 0) {
            allIssues.push({ file: filePath, issues });
        }
    }

    if (allIssues.length === 0) {
        console.log('[CONSOLE_LOGS] PASSED - No console.log or debugger statements found');
        return;
    }

    console.error('[CONSOLE_LOGS] FAILED - Found issues:\n');

    let totalIssues = 0;
    for (const { file, issues } of allIssues) {
        const relPath = path.relative(process.cwd(), file);
        console.error(`  ${relPath}`);

        for (const issue of issues) {
            console.error(`    Line ${issue.line}: ${issue.message}`);
            totalIssues += 1;
        }
    }

    console.error(`\n❌ Total: ${totalIssues} issue(s) found in staged files\n`);
    console.error(
        '💡 Tip: Use logger.* instead, or allowlist the file in ALLOWED_PATHS if needed.'
    );
    console.error('🔧 Only staged files are checked (incremental mode).');

    process.exit(1);
}

main();
