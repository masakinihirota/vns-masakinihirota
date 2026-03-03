import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom', // JSX/React テスト用に jsdom に変更
    // Use projects for test isolation instead of multiple config files
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
      },
    },
    setupFiles: ['./vitest.setup.ts', './src/__tests__/accessibility/setup.ts'],
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
    // テスト除外設定
    exclude: [
      'node_modules/**',
      '**/node_modules/**',
      'dist/**',
      '.next/**',
      // 'src/__tests__/api/**' // 一時的にコメントアウト
    ],
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
