import fs from 'fs';
import path from 'path';

const componentsDir = path.join(process.cwd(), 'src', 'components');
const dirs = fs.readdirSync(componentsDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

const results = [];

for (const dir of dirs) {
  const dirPath = path.join(componentsDir, dir);

  // check index.ts
  const hasIndexTs = fs.existsSync(path.join(dirPath, 'index.ts'));

  // recursive find files
  const files = [];
  function readFiles(currentPath) {
    try {
      const entries = fs.readdirSync(currentPath, { withFileTypes: true });
      for (const entry of entries) {
        const entryPath = path.join(currentPath, entry.name);
        if (entry.isDirectory()) {
          readFiles(entryPath);
        } else {
          files.push(entryPath);
        }
      }
    } catch (e) {
      // Handle issues reading a directory gently
    }
  }
  readFiles(dirPath);

  let tests = 0;
  let hasAxe = false;
  let usesServer = 0;
  let usesAny = 0;
  let hasDangerously = false;

  for (const file of files) {
    if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      const content = fs.readFileSync(file, 'utf-8');
      if (file.endsWith('.test.tsx') || file.endsWith('.test.ts')) {
        tests++;
        if (content.includes('vitest-axe') || content.includes('axe(')) {
          hasAxe = true;
        }
      }

      const useServerMatches = content.match(/['"]use server['"]/g);
      if (useServerMatches) usesServer += useServerMatches.length;

      const anyMatches = content.match(/:\s*any\b|<\s*any\s*>/g);
      if (anyMatches) usesAny += anyMatches.length;

      if (content.includes('dangerouslySetInnerHTML')) hasDangerously = true;
    }
  }

  results.push({
    name: dir,
    hasIndexTs,
    tests,
    hasAxe,
    usesServer,
    usesAny,
    hasDangerously,
    totalFiles: files.length
  });
}

let md = `# Automated Code Review Report\n\n`;
md += `*Generated on ${new Date().toISOString()}*\n\n`;
md += `## Overview\n`;
md += `- **Total Components Evaluated**: ${results.length}\n\n`;

md += `## Automated Checks Summary\n\n`;
md += `| Component | \`index.ts\` (Barrel) | Tests | Axe A11y | \`use server\` | \`any\` Usage | \`dangerouslySetInnerHTML\` |\n`;
md += `|---|---|---|---|---|---|---|\n`;

for (const r of results) {
  const indexTsSt = r.hasIndexTs ? '✅' : '❌';
  const testSt = r.tests > 0 ? r.tests : '❌';
  const axeSt = r.hasAxe ? '✅' : '❌';
  const useServerSt = r.usesServer > 0 ? `❌ (${r.usesServer})` : '✅';
  const anySt = r.usesAny > 0 ? `❌ (${r.usesAny})` : '✅';
  const dangerouslySt = r.hasDangerously ? '❌' : '✅';

  md += `| ${r.name} | ${indexTsSt} | ${testSt} | ${axeSt} | ${useServerSt} | ${anySt} | ${dangerouslySt} |\n`;
}

fs.writeFileSync('CODE_REVIEW_ALL_REPORT.md', md, 'utf-8');
console.log('Automated code review complete. Created CODE_REVIEW_ALL_REPORT.md');
