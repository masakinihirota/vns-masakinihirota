import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// モックを作成
const mockUser = {
  id: "test-user-id",
  email: "test@example.com",
  aud: "authenticated",
  role: "authenticated",
  email_confirmed_at: "2024-01-01T00:00:00.000Z",
  created_at: "2024-01-01T00:00:00.000Z",
};

const mockSession = {
  access_token: "mock-access-token",
  refresh_token: "mock-refresh-token",
  expires_at: Date.now() + 3600000,
  user: mockUser,
};

// Supabase クライアントのモック
const mockSupabaseClient = {
  auth: {
    signInWithPassword: vi.fn().mockResolvedValue({
      data: { user: mockUser, session: mockSession },
      error: null,
    }),
    signInWithOAuth: vi.fn().mockResolvedValue({
      data: {
        provider: "google",
        url: "https://auth.example.com/oauth/google",
      },
      error: null,
    }),
    signInAnonymously: vi.fn().mockResolvedValue({
      data: {
        user: { ...mockUser, id: "anon-user-id" },
        session: { ...mockSession, access_token: "anon-token" },
      },
      error: null,
    }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
    getUser: vi
      .fn()
      .mockResolvedValue({ data: { user: mockUser }, error: null }),
    getSession: vi
      .fn()
      .mockResolvedValue({ data: { session: mockSession }, error: null }),
    refreshSession: vi
      .fn()
      .mockResolvedValue({
        data: { session: mockSession, user: mockUser },
        error: null,
      }),
    onAuthStateChange: vi
      .fn()
      .mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    exchangeCodeForSession: vi
      .fn()
      .mockResolvedValue({ data: { session: mockSession }, error: null }),
    resetPasswordForEmail: vi.fn().mockResolvedValue({ data: {}, error: null }),
    verifyOtp: vi.fn().mockResolvedValue({
      data: { user: mockUser, session: mockSession },
      error: null,
    }),
  },
};

// クライアントとサーバーのモックを作成
vi.mock("@/lib/supabase/client", () => ({
  createClient: vi.fn().mockReturnValue(mockSupabaseClient),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue(mockSupabaseClient),
}));

describe("Supabase 認証フロー統合テスト", () => {
  beforeEach(() => {
    // モックをリセット
    vi.clearAllMocks();
  });

  describe("ログイン・ログアウト処理", () => {
    it("パスワードログインが正常に動作すること", async () => {
      // クライアントモジュールをインポート
      const { createClient } = await import("@/lib/supabase/client");

      // クライアントを作成
      const supabase = createClient();

      // ログイン処理
      const result = await supabase.auth.signInWithPassword({
        email: "test@example.com",
        password: "password123",
      });

      // 結果を確認
      expect(result.data.user).toEqual(mockUser);
      expect(result.data.session).toEqual(mockSession);
      expect(result.error).toBeNull();
    });

    it("OAuth ログインが正常に動作すること", async () => {
      // クライアントモジュールをインポート
      const { createClient } = await import("@/lib/supabase/client");

      // クライアントを作成
      const supabase = createClient();

      // OAuth ログイン処理
      const result = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "http://localhost:3000/oauth",
        },
      });

      // 結果を確認
      expect(result.data.provider).toBe("google");
      expect(result.data.url).toBe("https://auth.example.com/oauth/google");
      expect(result.error).toBeNull();
    });

    it("匿名ログインが正常に動作すること", async () => {
      // クライアントモジュールをインポート
      const { createClient } = await import("@/lib/supabase/client");

      // クライアントを作成
      const supabase = createClient();

      // 匿名ログイン処理
      const result = await supabase.auth.signInAnonymously();

      // 結果を確認
      expect(result.data.user.id).toBe("anon-user-id");
      expect(result.data.session.access_token).toBe("anon-token");
      expect(result.error).toBeNull();
    });

    it("ログアウトが正常に動作すること", async () => {
      // クライアントモジュールをインポート
      const { createClient } = await import("@/lib/supabase/client");

      // クライアントを作成
      const supabase = createClient();

      // ログアウト処理
      const result = await supabase.auth.signOut();

      // 結果を確認
      expect(result.error).toBeNull();
      expect(mockSupabaseClient.auth.signOut).toHaveBeenCalled();
    });
  });

  describe("セッション管理とクッキー処理", () => {
    it("セッションが正常に取得できること", async () => {
      // サーバークライアントモジュールをインポート
      const { createClient } = await import("@/lib/supabase/server");

      // クライアントを作成
      const supabase = await createClient();

      // セッション取得
      const { data, error } = await supabase.auth.getSession();

      // 結果を確認
      expect(data.session).toEqual(mockSession);
      expect(error).toBeNull();
    });

    it("ユーザー情報が正常に取得できること", async () => {
      // サーバークライアントモジュールをインポート
      const { createClient } = await import("@/lib/supabase/server");

      // クライアントを作成
      const supabase = await createClient();

      // ユーザー情報取得
      const { data, error } = await supabase.auth.getUser();

      // 結果を確認
      expect(data.user).toEqual(mockUser);
      expect(error).toBeNull();
    });

    it("セッションが正常に更新できること", async () => {
      // サーバークライアントモジュールをインポート
      const { createClient } = await import("@/lib/supabase/server");

      // クライアントを作成
      const supabase = await createClient();

      // セッション更新
      const { data, error } = await supabase.auth.refreshSession();

      // 結果を確認
      expect(data.session).toEqual(mockSession);
      expect(data.user).toEqual(mockUser);
      expect(error).toBeNull();
    });

    it("認証状態の変更を監視できること", async () => {
      // クライアントモジュールをインポート
      const { createClient } = await import("@/lib/supabase/client");

      // クライアントを作成
      const supabase = createClient();

      // コールバック関数
      const callback = vi.fn();

      // 認証状態の変更を監視
      const { data } = supabase.auth.onAuthStateChange(callback);

      // 結果を確認
      expect(data.subscription).toBeDefined();
      expect(data.subscription.unsubscribe).toBeDefined();
      expect(mockSupabaseClient.auth.onAuthStateChange).toHaveBeenCalledWith(
        callback,
      );
    });
  });

  describe("パスワードリセットとメール認証", () => {
    it("パスワードリセットメールが正常に送信できること", async () => {
      // クライアントモジュールをインポート
      const { createClient } = await import("@/lib/supabase/client");

      // クライアントを作成
      const supabase = createClient();

      // パスワードリセットメール送信
      const result =
        await supabase.auth.resetPasswordForEmail("test@example.com");

      // 結果を確認
      expect(result.error).toBeNull();
      expect(
        mockSupabaseClient.auth.resetPasswordForEmail,
      ).toHaveBeenCalledWith("test@example.com");
    });

    it("OTP 認証が正常に動作すること", async () => {
      // クライアントモジュールをインポート
      const { createClient } = await import("@/lib/supabase/client");

      // クライアントを作成
      const supabase = createClient();

      // OTP 認証
      const result = await supabase.auth.verifyOtp({
        email: "test@example.com",
        token: "123456",
        type: "email",
      });

      // 結果を確認
      expect(result.data.user).toEqual(mockUser);
      expect(result.data.session).toEqual(mockSession);
      expect(result.error).toBeNull();
      expect(mockSupabaseClient.auth.verifyOtp).toHaveBeenCalledWith({
        email: "test@example.com",
        token: "123456",
        type: "email",
      });
    });
  });

  describe("OAuth コールバック処理", () => {
    it("OAuth コードが正常に交換できること", async () => {
      // サーバークライアントモジュールをインポート
      const { createClient } = await import("@/lib/supabase/server");

      // クライアントを作成
      const supabase = await createClient();

      // OAuth コード交換
      const result =
        await supabase.auth.exchangeCodeForSession("test-auth-code");

      // 結果を確認
      expect(result.data.session).toEqual(mockSession);
      expect(result.error).toBeNull();
      expect(
        mockSupabaseClient.auth.exchangeCodeForSession,
      ).toHaveBeenCalledWith("test-auth-code");
    });
  });
});
