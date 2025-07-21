import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// @supabase/ssr のモックを作成
const mockBrowserClient = {
  auth: {
    getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
  },
};

const mockServerClient = {
  auth: {
    getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
  },
};

const mockCreateBrowserClient = vi.fn().mockReturnValue(mockBrowserClient);
const mockCreateServerClient = vi.fn().mockReturnValue(mockServerClient);

vi.mock("@supabase/ssr", () => ({
  createBrowserClient: mockCreateBrowserClient,
  createServerClient: mockCreateServerClient,
}));

// next/headers のモックを作成
const mockCookieStore = {
  getAll: vi.fn().mockReturnValue([]),
  set: vi.fn(),
};

vi.mock("next/headers", () => ({
  cookies: vi.fn().mockReturnValue(mockCookieStore),
}));

describe("Supabase 環境変数検証とエラーハンドリングテスト", () => {
  // 環境変数のオリジナル値を保存
  const originalEnv = { ...process.env };

  // 各テスト前に環境をリセット
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test-url.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";

    // モックをリセット
    vi.clearAllMocks();
    vi.resetModules();
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
    it("SUPABASE_URL が未設定の場合にエラーが発生すること", async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;

      // クライアントモジュールをインポート
      const { createClient } = await import("@/lib/supabase/client");

      expect(() => createClient()).toThrow();
    });

    it("SUPABASE_ANON_KEY が未設定の場合にエラーが発生すること", async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      // クライアントモジュールをインポート
      const { createClient } = await import("@/lib/supabase/client");

      expect(() => createClient()).toThrow();
    });
  });

  describe("サーバークライアントのエラーハンドリング", () => {
    it("SUPABASE_URL が未設定の場合にエラーが発生すること", async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;

      // サーバークライアントモジュールをインポート
      const { createClient } = await import("@/lib/supabase/server");

      await expect(createClient()).rejects.toThrow();
    });

    it("SUPABASE_ANON_KEY が未設定の場合にエラーが発生すること", async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      // サーバークライアントモジュールをインポート
      const { createClient } = await import("@/lib/supabase/server");

      await expect(createClient()).rejects.toThrow();
    });

    it("cookies の設定中にエラーが発生した場合も処理が継続すること", async () => {
      // cookies.set がエラーをスローするように設定
      mockCookieStore.set.mockImplementationOnce(() => {
        throw new Error("Cannot set cookies in this context");
      });

      // サーバークライアントモジュールをインポート
      const { createClient } = await import("@/lib/supabase/server");

      // クライアントを作成
      await createClient();

      // createServerClient の呼び出し引数を取得
      const options = mockCreateServerClient.mock.calls[0][2];

      // エラーがスローされないことを確認（try-catch でキャッチされるため）
      expect(() => {
        options.cookies.setAll([{ name: "test", value: "value", options: {} }]);
      }).not.toThrow();
    });
  });
});
