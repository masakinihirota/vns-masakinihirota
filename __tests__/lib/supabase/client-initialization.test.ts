import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// モックを作成
const mockBrowserClient = {
  auth: {
    getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
  },
};

// @supabase/ssr のモックを作成
vi.mock("@supabase/ssr", () => {
  return {
    createBrowserClient: vi.fn().mockReturnValue(mockBrowserClient),
  };
});

describe("Supabase クライアント初期化テスト", () => {
  beforeEach(() => {
    // テスト用の環境変数を設定
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test-url.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";

    // モジュールキャッシュをクリア
    vi.resetModules();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("ブラウザクライアントが正しく初期化されること", async () => {
    // createBrowserClient のインポート
    const { createBrowserClient } = await import("@supabase/ssr");

    // クライアントモジュールをインポート
    const { createClient } = await import("@/lib/supabase/client");

    // クライアントを作成
    createClient();

    // createBrowserClient が正しいパラメータで呼び出されたことを確認
    expect(createBrowserClient).toHaveBeenCalledWith(
      "https://test-url.supabase.co",
      "test-anon-key",
    );
  });
});
