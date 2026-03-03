import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, expect, vi } from 'vitest';
import 'vitest-axe/extend-expect';
import * as axeMatchers from 'vitest-axe/matchers';
import React from 'react';

expect.extend(axeMatchers);

// React Testing Library cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock environment variables
process.env.USE_REAL_AUTH = 'false';

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

// =============================================================================
// グローバルモック設定
// =============================================================================

// window.matchMedia のモック (next-themes等で使用)
// HTMLCanvasElement.getContext のモック (axe-core 用)
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  getImageData: vi.fn(() => ({
    data: new Array(4),
  })),
  putImageData: vi.fn(),
  createImageData: vi.fn(() => ({
    data: new Array(4),
  })),
  setTransform: vi.fn(),
  drawImage: vi.fn(),
  save: vi.fn(),
  fillText: vi.fn(),
  restore: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  stroke: vi.fn(),
  translate: vi.fn(),
  scale: vi.fn(),
  rotate: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  measureText: vi.fn(() => ({ width: 0 })),
  transform: vi.fn(),
  rect: vi.fn(),
  clip: vi.fn(),
  createLinearGradient: vi.fn(() => ({
    addColorStop: vi.fn(),
  })),
} as any));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: query === '(prefers-color-scheme: dark)',
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// LocaleContext のグローバルモック (i18n翻訳用)
const translations: Record<string, string> = {
  'header.loading': '読み込み中',
  'header.checkingAuth': '認証確認中',
  'header.signIn': 'ログイン',
  'header.account': 'ダッシュボードへ移動',
  'header.signOut': 'ログアウト',
  'header.inTrialMode': 'お試し中',
  'header.stopTrial': '体験をやめる',
  'ads.on': '広告を表示',
  'ads.off': '広告を非表示',
  'language.select': '言語を選択',
  'theme.toggle': 'テーマを切り替え',
};

vi.mock('@/context/locale-context', async () => {
  return {
    useLocale: () => ({
      locale: 'ja',
      t: (key: string) => translations[key] || key,
      changeLocale: vi.fn(),
    }),
    LocaleProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});
