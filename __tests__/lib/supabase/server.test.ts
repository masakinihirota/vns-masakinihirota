import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// モックを作成
const mockCreateServerClient = vi
  .fn()
  .mockImplementation((url, key, options) => ({
    _url: url,
    _key: key,
    _options: options,
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
    },
  }));

// @supabase/ssr のモックを作成
vi.mock("@supabase/ssr", () => ({
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
import { createClient } from "@/lib/supabase/server";

describe("Supabase サーバークライアント初期化テスト", () => {
  // 環境変数のオリジナル値を保存
  const originalEnv = { ...process.env };

  beforeEach(() => {
    // テスト用の環境変数を設定
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test-url.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";

    // モックをリセット
    vi.clearAllMocks();
  });

  afterEach(() => {
    // 環境変数を元に戻す
    process.env = { ...originalEnv };
  });

  it("正しい環境変数でサーバークライアントを初期化すること", async () => {
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
    expect(client).toHaveProperty("_url", "https://test-url.supabase.co");
    expect(client).toHaveProperty("_key", "test-anon-key");
    expect(client).toHaveProperty("_options");
  });

  it("cookies オブジェクトが正しく設定されていること", async () => {
    // クライアントを作成
    await createClient();

    // cookies が呼び出されたことを確認
    const { cookies } = await import("next/headers");
    expect(cookies).toHaveBeenCalled();
  });

  it("環境変数が未設定の場合にエラーが発生すること", async () => {
    // 環境変数を未設定に
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;

    // エラーが発生することを確認
    await expect(createClient()).rejects.toThrow();
  });

  it("cookies の setAll メソッドがエラーをキャッチすること", async () => {
    // cookies.set がエラーをスローするように設定
    mockCookies.set.mockImplementationOnce(() => {
      throw new Error("Cannot set cookies in this context");
    });

    // クライアントを作成
    const client = await createClient();

    // cookies.setAll を呼び出す
    const options = mockCreateServerClient.mock.calls[0][2];

    // エラーがスローされないことを確認（try-catch でキャッチされるため）
    expect(() => {
      options.cookies.setAll([{ name: "test", value: "value", options: {} }]);
    }).not.toThrow();

    // set が呼び出されたことを確認
    expect(mockCookies.set).toHaveBeenCalled();
  });
});
