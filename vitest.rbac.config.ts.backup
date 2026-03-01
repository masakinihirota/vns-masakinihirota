import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/__tests__/rbac-authorization.test.ts'],
    exclude: ['node_modules', 'dist'],
    // DATABASE_URL が必要なテストを除外
    setupFiles: [],
    // RBAC テストは単位テスト（ユニットテスト）のため、モックで十分
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },
});
