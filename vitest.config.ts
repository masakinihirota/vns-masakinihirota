import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'node', // Use Node for all tests (setup files handle React)
    // Use projects for test isolation instead of multiple config files
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
      },
    },
    setupFiles: './vitest.setup.ts',
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
    // テスト除外設定: API テストは別に実行
    exclude: ['node_modules/', 'dist/', 'src/__tests__/api/**'],
    include: ['src/**/*.test.ts', '**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
