/**
 * Vitest configuration for API tests
 *
 * Node.js environment for Hono/API testing
 * Usage: pnpm vitest --config vitest.api.config.ts
 */

import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node', // Node.js environment for Hono
    include: ['src/__tests__/api/**/*.test.ts'],
    exclude: ['node_modules/**', 'dist/**'],
    setupFiles: [], // API テストは setupFiles 不要
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '.next/',
        '**/*.config.ts',
        '**/*.d.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
