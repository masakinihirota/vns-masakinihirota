import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// React Testing Library cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock environment variables
process.env.NEXT_PUBLIC_USE_REAL_AUTH = 'false';

// NODE_ENV は読み取り専用なため Object.defineProperty を使用
// テスト環境では自動的に 'test' が設定される
