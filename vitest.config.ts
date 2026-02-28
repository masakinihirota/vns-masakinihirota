import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    // デフォルト: happy-dom (コンポーネント・ロジックテスト用)
    environment: 'happy-dom',
    // API テストは Node 環境に切り替え
    environmentMatcherRegex: /\.(test|spec)\.[jt]sx?$/,
    // API テストファイルは Node 環境で実行
    poolOptions: {
      threads: {
        isolate: true,
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
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
