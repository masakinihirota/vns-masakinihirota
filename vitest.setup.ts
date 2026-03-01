import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import 'vitest-axe/extend-expect';

// React Testing Library cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock environment variables
process.env.USE_REAL_AUTH = 'false';
process.env.NEXT_PUBLIC_USE_REAL_AUTH = 'false';

// ✅ テスト環境用のダミー DATABASE_URL を設定
// 実際のDBに接続しないため、モックDBまたはインメモリDBを使用することを推奨
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/test_db';

// Better Auth 環境変数（テスト用）
process.env.BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET || 'test-secret-key-min-32-characters-for-testing';
process.env.BETTER_AUTH_URL = process.env.BETTER_AUTH_URL || 'http://localhost:3000';

// OAuth 環境変数（テスト用ダミー値）
process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'test-google-client-id';
process.env.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'test-google-client-secret';
process.env.GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || 'test-github-client-id';
process.env.GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || 'test-github-client-secret';

// NODE_ENV は読み取り専用なため Object.defineProperty を使用
// テスト環境では自動的に 'test' が設定される
