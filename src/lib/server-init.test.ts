/**
 * Server Initialization Tests
 *
 * サーバー起動時の環境変数検証テスト
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { validateServerEnvironment } from '@/lib/server-init';

describe('validateServerEnvironment', () => {
  beforeEach(() => {
    // テスト前に全ての環境変数をリセット
    vi.unstubAllEnvs();
    // テスト環境の基本設定
    vi.stubEnv('NODE_ENV', 'test');
    vi.stubEnv('USE_REAL_AUTH', 'false');
    vi.stubEnv('DATABASE_URL', 'postgresql://test:test@localhost:5432/test_db');
    // 本番環境テスト用にデフォルトでOAuth変数を設定
    vi.stubEnv('GOOGLE_CLIENT_ID', 'test-id');
    vi.stubEnv('GOOGLE_CLIENT_SECRET', 'test-secret');
    vi.stubEnv('GITHUB_CLIENT_ID', 'test-id');
    vi.stubEnv('GITHUB_CLIENT_SECRET', 'test-secret');
    vi.stubEnv('BETTER_AUTH_SECRET', 'test-secret');
    vi.stubEnv('BETTER_AUTH_URL', 'http://localhost:3000');
  });

  afterEach(() => {
    // テスト後に全ての環境変数をリセット
    vi.unstubAllEnvs();
  });

  describe('本番環境でのチェック', () => {
    beforeEach(() => {
      vi.stubEnv('NODE_ENV', 'production');
    });

    it('本番環境でOAuth認証情報が不足している場合はエラーをスロー', () => {
      // OAuth情報をクリア
      delete process.env.GOOGLE_CLIENT_ID;
      delete process.env.GOOGLE_CLIENT_SECRET;
      delete process.env.GITHUB_CLIENT_ID;
      delete process.env.GITHUB_CLIENT_SECRET;
      vi.stubEnv('USE_REAL_AUTH', 'true');

      expect(() => validateServerEnvironment()).toThrow(
        /本番環境で必須のOAuth認証情報が不足しています/
      );
    });

    it('本番環境でUSE_REAL_AUTH=falseの場合はエラーをスロー', () => {
      vi.stubEnv('GOOGLE_CLIENT_ID', 'test-id');
      vi.stubEnv('GOOGLE_CLIENT_SECRET', 'test-secret');
      vi.stubEnv('GITHUB_CLIENT_ID', 'test-id');
      vi.stubEnv('GITHUB_CLIENT_SECRET', 'test-secret');
      vi.stubEnv('BETTER_AUTH_SECRET', 'test-secret');
      vi.stubEnv('BETTER_AUTH_URL', 'http://localhost:3000');
      vi.stubEnv('USE_REAL_AUTH', 'false');

      expect(() => validateServerEnvironment()).toThrow(
        /USE_REAL_AUTH=trueを設定してください/
      );
    });

    it('本番環境で全ての必須環境変数が設定されている場合は成功', () => {
      vi.stubEnv('GOOGLE_CLIENT_ID', 'test-id');
      vi.stubEnv('GOOGLE_CLIENT_SECRET', 'test-secret');
      vi.stubEnv('GITHUB_CLIENT_ID', 'test-id');
      vi.stubEnv('GITHUB_CLIENT_SECRET', 'test-secret');
      vi.stubEnv('BETTER_AUTH_SECRET', 'test-secret');
      vi.stubEnv('BETTER_AUTH_URL', 'http://localhost:3000');
      vi.stubEnv('USE_REAL_AUTH', 'true');

      expect(() => validateServerEnvironment()).not.toThrow();
    });
  });

  describe('開発環境でのチェック', () => {
    beforeEach(() => {
      vi.stubEnv('NODE_ENV', 'development');
      vi.stubEnv('DATABASE_URL', 'postgresql://test:test@localhost:5432/test_db');
    });

    it('開発環境でOAuth認証情報がなくても エラーをスロー しない（警告のみ）', () => {
      vi.stubEnv('GOOGLE_CLIENT_ID', undefined);

      // 警告は出力されるが、エラーをスローしない
      expect(() => validateServerEnvironment()).not.toThrow();
    });

    it('開発環境でUSE_REAL_AUTH=falseでもエラーをスロー しない', () => {
      vi.stubEnv('USE_REAL_AUTH', 'false');

      expect(() => validateServerEnvironment()).not.toThrow();
    });

    it('開発環境で最小限の環境変数でも動作', () => {
      expect(() => validateServerEnvironment()).not.toThrow();
    });
  });

  describe('共通の必須チェック', () => {
    it('DATABASE_URLが不足している場合はエラーをスロー', () => {
      // 開発環境で DATABASE_URL をクリア
      vi.stubEnv('NODE_ENV', 'development');
      delete process.env.DATABASE_URL;

      expect(() => validateServerEnvironment()).toThrow(
        /環境変数が不足しています/
      );
    });

    it('DATABASE_URLが設定されている場合は成功', () => {
      vi.stubEnv('DATABASE_URL', 'postgresql://test:test@localhost:5432/test_db');

      expect(() => validateServerEnvironment()).not.toThrow();
    });
  });
});
