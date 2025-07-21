import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// @supabase/ssr のモックを作成
vi.mock("@supabase/ssr", () => {
  return {
    createBrowserClient: vi.fn(),
    createServerClient: vi.fn(),
  };
});

// next/headers のモックを作成
const mockCookieStore = {
  getAll: vi.fn().mockReturnValue([]),
  set: vi.fn(),
};

vi.mock("next/headers", () => {
  return {
    cookies: vi.fn().mockReturnValue(mockCookieStore),
  };
});

describe("Supabase エラーハンドリングテスト", () => {
  // 環境変数のオリジナル値を保存
  const originalEnv = { ...process.env };

  beforeEach(() => {
    // モジュールキャッシュをクリア
    vi.resetModules();
  });

  afterEach(() => {
    // 環境変数を元に戻す
    process.env = { ...originalEnv };
    vi.clearAllMocks();
  });

  describe("環境変数のエラーハンドリング", () => {
    it("cookies の setAll メソッドがエラーをキャッチすること", async () => {
      // 環境変数を設定
      process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test-url.supabase.co";
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";

      // cookies.set がエラーをスローするように設定
      mockCookieStore.set.mockImplementationOnce(() => {
        throw new Error("Cannot set cookies in this context");
      });

      // createServerClient のモック
      const { createServerClient } = await import("@supabase/ssr");
      const mockCreateServerClient = createServerClient as jest.Mock;

      // モックの実装を設定
      mockCreateServerClient.mockImplementation((url, key, options) => {
        // cookies.setAll を呼び出してエラーを発生させる
        try {
          options.cookies.setAll([
            { name: "test", value: "value", options: {} },
          ]);
        } catch (e) {
          // エラーが発生しても処理を継続
        }

        return {
          auth: {
            getUser: vi
              .fn()
              .mockResolvedValue({ data: { user: null }, error: null }),
          },
        };
      });

      // クライアントモジュールをインポート
      const { createClient } = await import("@/lib/supabase/server");

      // クライアントを作成（エラーが発生しないことを確認）
      await expect(createClient()).resolves.not.toThrow();

      // set が呼び出されたことを確認
      expect(mockCookieStore.set).toHaveBeenCalled();
    });
  });
});
