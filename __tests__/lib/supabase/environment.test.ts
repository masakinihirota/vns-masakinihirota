import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// モックを作成
const mockCreateBrowserClient = vi.fn().mockImplementation((url, key) => ({
  _url: url,
  _key: key,
}));

const mockCreateServerClient = vi
  .fn()
  .mockImplementation((url, key, options) => ({
    _url: url,
    _key: key,
    _options: options,
  }));

// @supabase/ssr のモックを作成
vi.mock("@supabase/ssr", () => ({
  createBrowserClient: mockCreateBrowserClient,
  createServerClient: mockCreateServerClient,
}));

// next/headers のモックを作成
const mockCookies = {
  getAll: vi.fn().mockReturnValue([]),
  set: vi.fn(),
};

vi.mock("next/headers", () => ({
  cookies: vi.fn().mockReturnValue(mockCookies),
}));

// 実際のモジュールをインポート
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import { createClient as createServerClient } from "@/lib/supabase/server";

describe("Supabase 環境変数検証とエラーハンドリングテスト", () => {
  // 環境変数のオリジナル値を保存
  const originalEnv = { ...process.env };

  // 各テスト前に環境をリセット
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test-url.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";

    // モックをリセット
    vi.clearAllMocks();
  });

  // 各テスト後に環境を元に戻す
  afterEach(() => {
    process.env = { ...originalEnv };
  });

  describe("環境変数の検証", () => {
    it("必要な環境変数が設定されていること", () => {
      expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined();
      expect(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeDefined();
    });

    it("環境変数の値が空でないこと", () => {
      expect(process.env.NEXT_PUBLIC_SUPABASE_URL).not.toBe("");
      expect(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).not.toBe("");
    });
  });

  describe("ブラウザクライアントのエラーハンドリング", () => {
    it("SUPABASE_URL が未設定の場合にエラーが発生すること", () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;

      expect(() => createBrowserClient()).toThrow();
    });

    it("SUPABASE_ANON_KEY が未設定の場合にエラーが発生すること", () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      expect(() => createBrowserClient()).toThrow();
    });
  });

  describe("サーバークライアントのエラーハンドリング", () => {
    it("SUPABASE_URL が未設定の場合にエラーが発生すること", async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;

      await expect(createServerClient()).rejects.toThrow();
    });

    it("SUPABASE_ANON_KEY が未設定の場合にエラーが発生すること", async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      await expect(createServerClient()).rejects.toThrow();
    });

    it("cookies の設定中にエラーが発生した場合も処理が継続すること", async () => {
      // cookies.set がエラーをスローするように設定
      mockCookies.set.mockImplementationOnce(() => {
        throw new Error("Cannot set cookies in this context");
      });

      // クライアントを作成
      await createServerClient();

      // createServerClient が呼び出されたことを確認
      expect(mockCreateServerClient).toHaveBeenCalled();

      // cookies.setAll を呼び出す
      const options = mockCreateServerClient.mock.calls[0][2];

      // エラーがスローされないことを確認（try-catch でキャッチされるため）
      expect(() => {
        options.cookies.setAll([{ name: "test", value: "value", options: {} }]);
      }).not.toThrow();
    });
  });
});
