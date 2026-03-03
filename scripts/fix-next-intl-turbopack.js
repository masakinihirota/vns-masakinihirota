const fs = require('fs');
const path = require('path');

// This script patches next-intl to fix Turbopack module resolution in Next.js 16
// Next.js 16 removes the experimental.turbo / turbo keys from next.config.ts,
// causing the next-intl plugin to fail to register the 'next-intl/config' alias.
// This patch simply overrides the fallback config module to import our request.ts directly.

const targetPath = path.resolve(process.cwd(), 'src/i18n/request'); // Leave off .ts so Next.js resolves it

const LOGICAL_RELATIVE_PATH = '../../../../src/i18n/request';

function patch(filePath, contentFn) {
  const absolutePath = path.resolve(process.cwd(), filePath);
  if (fs.existsSync(absolutePath)) {
    fs.writeFileSync(absolutePath, contentFn(LOGICAL_RELATIVE_PATH), 'utf8');
    console.log(`[next-intl-patch] Patched ${filePath} with logical path ${LOGICAL_RELATIVE_PATH}`);
  }
}

// ESM
patch('node_modules/next-intl/dist/esm/config.js', (reqPath) => `
  export default function() {
    return require('${reqPath}').default();
  }
`);

// Production
patch('node_modules/next-intl/dist/production/config.js', (reqPath) => `
  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.default = function() {
    return require('${reqPath}').default;
  };
`);

// Development
patch('node_modules/next-intl/dist/development/config.js', (reqPath) => `
  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.default = function() {
    return require('${reqPath}').default;
  };
`);

console.log('[next-intl-patch] Completed patching next-intl.');
