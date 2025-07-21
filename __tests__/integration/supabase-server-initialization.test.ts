import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// @supabase/ssr のモックを作成
const mockServerClient = {
  auth: {
    getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
  },
};

const mockCreateServerClient = vi.fn().mockReturnValue(mockServerClient);

vi.mock("@supabase/ssr", () => ({
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

describe("Supabase サーバークライアント初期化テスト", () => {
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

  it("正しい環境変数でサーバークライアントを初期化すること", async () => {
    // サーバークライアントモジュールをインポート
    const { createClient } = await import("@/lib/supabase/server");

    // クライアントを作成
    const client = await createClient();

    // createServerClient が正しいパラメータで呼び出されたことを確認
    expect(mockCreateServerClient).toHaveBeenCalledWith(
      "https://test-url.supabase.co",
      "test-anon-key",
      expect.objectContaining({
        cookies: expect.any(Object),
      }),
    );

    // 返されたクライアントが期待通りであることを確認
    expect(client).toBe(mockServerClient);
  });

  it("cookies オブジェクトが正しく設定されていること", async () => {
    // サーバークライアントモジュールをインポート
    const { createClient } = await import("@/lib/supabase/server");

    // クライアントを作成
    await createClient();

    // cookies が呼び出されたことを確認
    const { cookies } = await import("next/headers");
    expect(cookies).toHaveBeenCalled();
  });

  it("環境変数が未設定の場合にエラーが発生すること", async () => {
    // 環境変数を未設定に
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;

    // サーバークライアントモジュールをインポート
    const { createClient } = await import("@/lib/supabase/server");

    // エラーが発生することを確認
    await expect(createClient()).rejects.toThrow();
  });

  it("cookies の setAll メソッドがエラーをキャッチすること", async () => {
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

    // set が呼び出されたことを確認
    expect(mockCookieStore.set).toHaveBeenCalled();
  });
});
