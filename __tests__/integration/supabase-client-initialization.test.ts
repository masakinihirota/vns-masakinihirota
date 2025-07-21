import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// @supabase/ssr のモックを作成
const mockBrowserClient = {
  auth: {
    getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
  },
};

const mockCreateBrowserClient = vi.fn().mockReturnValue(mockBrowserClient);

vi.mock("@supabase/ssr", () => ({
  createBrowserClient: mockCreateBrowserClient,
}));

describe("Supabase ブラウザクライアント初期化テスト", () => {
  // 環境変数のオリジナル値を保存
  const originalEnv = { ...process.env };

  beforeEach(() => {
    // テスト用の環境変数を設定
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test-url.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";

    // モックをリセット
    vi.clearAllMocks();
    vi.resetModules();
  });

  afterEach(() => {
    // 環境変数を元に戻す
    process.env = { ...originalEnv };
  });

  it("正しい環境変数でブラウザクライアントを初期化すること", async () => {
    // クライアントモジュールをインポート
    const { createClient } = await import("@/lib/supabase/client");

    // クライアントを作成
    const client = createClient();

    // createBrowserClient が正しいパラメータで呼び出されたことを確認
    expect(mockCreateBrowserClient).toHaveBeenCalledWith(
      "https://test-url.supabase.co",
      "test-anon-key",
    );

    // 返されたクライアントが期待通りであることを確認
    expect(client).toBe(mockBrowserClient);
  });

  it("環境変数が未設定の場合にエラーが発生すること", async () => {
    // 環境変数を未設定に
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;

    // クライアントモジュールをインポート
    const { createClient } = await import("@/lib/supabase/client");

    // エラーが発生することを確認
    expect(() => createClient()).toThrow();
  });
});
