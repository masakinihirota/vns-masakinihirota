#!/usr/bin/env node

/**
 * ページコンポーネントのダークモード・i18n対応チェックスクリプト
 *
 * Usage: node scripts/check-page-compliance.js <file1.tsx> [file2.tsx ...]
 *
 * Checks:
 * 1. Dark mode support: Ensures `dark:` variants are used with color classes
 * 2. i18n support: DISABLED (時期尚早のため無効化)
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m',
};

// Files/directories to skip
const SKIP_PATTERNS = [
    /node_modules/,
    /\.next/,
    /\.git/,
    /dist/,
    /build/,
    /__tests__/,
    /\.test\./,
    /\.spec\./,
    // Skip certain component directories that don't need strict checking
    /components\/ui\//,
    /components\/layout\/header\//,  // Header components already checked
];

// Color classes that should have dark: variants
const COLOR_CLASSES = [
    'bg-white', 'bg-gray-50', 'bg-gray-100', 'bg-gray-200',
    'text-gray-900', 'text-gray-800', 'text-gray-700', 'text-gray-600',
    'border-gray-200', 'border-gray-300',
    'hover:bg-gray-50', 'hover:bg-gray-100',
];

// Regex patterns
const HARDCODED_JAPANESE_REGEX = /(?:>|\{['"`])([^<>'"`{}]*[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF]+[^<>'"`{}]*)(?:<|\}|['"`])/g;
const USE_LOCALE_REGEX = /useLocale\(\)/;
const T_FUNCTION_REGEX = /\bt\(['"`][^'"`]+['"`]\)/;
const DARK_VARIANT_REGEX = /dark:[a-z-]+/;

class ComplianceChecker {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.filesChecked = 0;
        this.filesWithIssues = 0;
    }

    shouldSkip(filePath) {
        return SKIP_PATTERNS.some(pattern => pattern.test(filePath));
    }

    checkFile(filePath) {
        if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) {
            return; // Only check TypeScript React files
        }

        if (this.shouldSkip(filePath)) {
            console.log(`${colors.gray}⊘ Skipping: ${filePath}${colors.reset}`);
            return;
        }

        if (!fs.existsSync(filePath)) {
            console.error(`${colors.red}✗ File not found: ${filePath}${colors.reset}`);
            return;
        }

        const content = fs.readFileSync(filePath, 'utf-8');
        this.filesChecked++;

        const fileErrors = [];
        const fileWarnings = [];

        // Normalize path separators for cross-platform compatibility
        const normalizedPath = filePath.replace(/\\/g, '/');

        // Check 1: Dark mode support
        if (normalizedPath.includes('/app/') && filePath.endsWith('.tsx')) {
            const darkModeIssues = this.checkDarkMode(content, filePath);
            fileWarnings.push(...darkModeIssues);
        }

        // Check 2: i18n support (DISABLED - 時期尚早のため無効化)
        // if (normalizedPath.includes('/app/') && filePath.endsWith('.tsx')) {
        //   const i18nIssues = this.checkI18n(content, filePath);
        //   fileErrors.push(...i18nIssues);
        // }

        if (fileErrors.length > 0 || fileWarnings.length > 0) {
            this.filesWithIssues++;
            console.log(`\n${colors.cyan}Checking: ${filePath}${colors.reset}`);

            if (fileErrors.length > 0) {
                fileErrors.forEach(error => {
                    console.log(`  ${colors.red}✗ ERROR: ${error}${colors.reset}`);
                    this.errors.push({ file: filePath, message: error });
                });
            }

            if (fileWarnings.length > 0) {
                fileWarnings.forEach(warning => {
                    console.log(`  ${colors.yellow}⚠ WARNING: ${warning}${colors.reset}`);
                    this.warnings.push({ file: filePath, message: warning });
                });
            }
        } else {
            console.log(`${colors.green}✓ ${filePath}${colors.reset}`);
        }
    }

    checkDarkMode(content, filePath) {
        const issues = [];

        // Check if file uses color classes without dark: variants
        const hasColorClasses = COLOR_CLASSES.some(colorClass =>
            content.includes(colorClass)
        );

        const hasDarkVariants = DARK_VARIANT_REGEX.test(content);

        if (hasColorClasses && !hasDarkVariants) {
            issues.push('ダークモード対応が不足しています。bg-white, text-gray-* などに dark: バリアントを追加してください。');
        }

        // Check specific color classes without dark: pairs
        // Match className attributes
        const classNameRegex = /className\s*=\s*"([^"]*)"/g;
        let match;

        while ((match = classNameRegex.exec(content)) !== null) {
            const fullClassName = match[1];
            const lineNumber = content.substring(0, match.index).split('\n').length;

            // Check if this className contains color classes but no dark: variant
            const hasColor = COLOR_CLASSES.some(colorClass => {
                // Match whole word only
                const wordBoundaryRegex = new RegExp(`\\b${colorClass.replace(/:/g, '\\:')}\\b`);
                return wordBoundaryRegex.test(fullClassName);
            });

            const hasDark = /\bdark:/.test(fullClassName);

            if (hasColor && !hasDark) {
                const displayText = fullClassName.length > 60
                    ? fullClassName.substring(0, 60) + '...'
                    : fullClassName;
                issues.push(`Line ${lineNumber}: className に dark: バリアントがありません - "${displayText}"`);
            }
        }

        return issues;
    }

    checkI18n(content, filePath) {
        const issues = [];

        // Simple regex to find Japanese characters
        const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF]+/g;
        const japaneseMatches = content.match(japaneseRegex);

        if (japaneseMatches && japaneseMatches.length > 0) {
            const hasUseLocale = USE_LOCALE_REGEX.test(content);
            const hasTFunction = T_FUNCTION_REGEX.test(content);

            if (!hasUseLocale || !hasTFunction) {
                if (!hasUseLocale && !hasTFunction) {
                    issues.push('ハードコードされた日本語テキストが検出されました。useLocale() と t() を使用してください。');
                } else if (!hasUseLocale) {
                    issues.push('useLocale() フックが見つかりません。i18n対応のためにインポートしてください。');
                } else if (!hasTFunction) {
                    issues.push('t() 関数が使用されていません。ハードコードされたテキストを t() で置き換えてください。');
                }
            }

            // Report specific instances of hardcoded text
            const lines = content.split('\n');
            const reportedLines = new Set();

            lines.forEach((line, index) => {
                if (japaneseRegex.test(line) && !reportedLines.has(index) && issues.length < 10) {
                    const lineNumber = index + 1;
                    const match = line.match(japaneseRegex);
                    if (match) {
                        const text = match[0];
                        // Skip comment lines
                        if (!line.trim().startsWith('//') && !line.trim().startsWith('*')) {
                            issues.push(`Line ${lineNumber}: ハードコードされたテキスト - "${text.substring(0, 20)}..."`);
                            reportedLines.add(index);
                        }
                    }
                }
            });

            const unreportedCount = japaneseMatches.length - reportedLines.size;
            if (unreportedCount > 0) {
                issues.push(`... 他 ${unreportedCount} 箇所でハードコードされた日本語が検出されました`);
            }
        }

        return issues;
    }

    printSummary() {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`${colors.cyan}ページコンプライアンスチェック結果${colors.reset}`);
        console.log(`${'='.repeat(60)}`);
        console.log(`チェックしたファイル: ${this.filesChecked}`);
        console.log(`問題のあるファイル: ${this.filesWithIssues}`);
        console.log(`エラー: ${this.errors.length}`);
        console.log(`警告: ${this.warnings.length}`);

        if (this.errors.length > 0) {
            console.log(`\n${colors.red}❌ エラーが見つかりました。修正が必要です。${colors.reset}`);
            return false;
        }

        if (this.warnings.length > 0) {
            console.log(`\n${colors.yellow}⚠️  警告が見つかりました。確認してください。${colors.reset}`);
            console.log(`${colors.gray}(警告はコミットをブロックしません)${colors.reset}`);
        } else {
            console.log(`\n${colors.green}✅ すべてのチェックに合格しました！${colors.reset}`);
        }

        return true;
    }
}

// Main execution
function main() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.error(`${colors.red}使用方法: node scripts/check-page-compliance.js <file1.tsx> [file2.tsx ...]${colors.reset}`);
        process.exit(1);
    }

    const checker = new ComplianceChecker();

    args.forEach(file => {
        const absolutePath = path.resolve(file);
        checker.checkFile(absolutePath);
    });

    const passed = checker.printSummary();

    // Exit with error code if there are errors (not warnings)
    process.exit(passed ? 0 : 1);
}

if (require.main === module) {
    main();
}

module.exports = { ComplianceChecker };
