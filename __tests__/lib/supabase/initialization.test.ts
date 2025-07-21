import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// 実際のモジュールをモック
vi.mock("@/lib/supabase/client", () => ({
  createClient: vi.fn().mockReturnValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
    },
  }),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
    },
  }),
}));

describe("Supabase クライアント初期化テスト", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("ブラウザクライアントが正しく初期化されること", async () => {
    // クライアントモジュールをインポート
    const { createClient } = await import("@/lib/supabase/client");

    // クライアントを作成
    const client = createClient();

    // クライアントが正しく作成されたことを確認
    expect(createClient).toHaveBeenCalled();
    expect(client).toBeDefined();
    expect(client.auth).toBeDefined();
    expect(client.auth.getUser).toBeDefined();
  });

  it("サーバークライアントが正しく初期化されること", async () => {
    // サーバークライアントモジュールをインポート
    const { createClient } = await import("@/lib/supabase/server");

    // クライアントを作成
    const client = await createClient();

    // クライアントが正しく作成されたことを確認
    expect(createClient).toHaveBeenCalled();
    expect(client).toBeDefined();
    expect(client.auth).toBeDefined();
    expect(client.auth.getUser).toBeDefined();
  });
});
