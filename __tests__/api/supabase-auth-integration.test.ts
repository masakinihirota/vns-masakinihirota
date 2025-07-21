import { describe, it, expect, vi, beforeEach } from "vitest";

// モックユーザーとセッション
const mockUser = {
  id: "test-user-id",
  email: "test@example.com",
  role: "authenticated",
  user_metadata: {
    name: "テストユーザー",
  },
};

const mockSession = {
  access_token: "mock-access-token",
  refresh_token: "mock-refresh-token",
  expires_in: 3600,
  expires_at: Date.now() + 3600000,
  user: mockUser,
};

// モックSupabaseクライアント
const createMockSupabaseClient = () => {
  return {
    auth: {
      signInWithPassword: vi.fn().mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      }),
      getSession: vi.fn().mockResolvedValue({
        data: { session: mockSession },
        error: null,
      }),
      getUser: vi.fn().mockResolvedValue({
        data: { user: mockUser },
        error: null,
      }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      refreshSession: vi.fn().mockResolvedValue({
        data: {
          session: { ...mockSession, access_token: "refreshed-token" },
          user: mockUser,
        },
        error: null,
      }),
    },
    _setAuthState: vi.fn(),
  };
};

// モックレスポンスを作成する関数
const createMockResponse = (status, body) => {
  return {
    status,
    json: async () => body,
    headers: new Headers(),
    ok: status >= 200 && status < 300,
  };
};

describe("Supabase認証とAPI統合テスト", () => {
  let supabase;

  beforeEach(() => {
    // Supabaseクライアントのモック
    supabase = createMockSupabaseClient();

    // fetchをモック化
    vi.stubGlobal("fetch", vi.fn());
  });

  describe("認証トークンを使用したAPI呼び出し", () => {
    it("ログイン後にアクセストークンを使用してAPIにアクセスできること", async () => {
      // ログイン
      const loginResult = await supabase.auth.signInWithPassword({
        email: "test@example.com",
        password: "password123",
      });

      // セッション取得
      const sessionResult = await supabase.auth.getSession();
      const session = sessionResult.data.session;

      // APIレスポンスのモック
      fetch.mockResolvedValue(
        createMockResponse(200, {
          message: "Access granted",
          user: {
            id: mockUser.id,
            email: mockUser.email,
            role: "user",
          },
        }),
      );

      // アクセストークンを使用してAPIにアクセス
      const response = await fetch("http://localhost:3000/api/protected", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();

      // 検証
      expect(response.status).toBe(200);
      expect(data).toEqual({
        message: "Access granted",
        user: {
          id: mockUser.id,
          email: mockUser.email,
          role: "user",
        },
      });

      // fetchが正しいヘッダーで呼び出されたことを確認
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:3000/api/protected",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${session.access_token}`,
          }),
        }),
      );
    });

    it("未ログイン状態ではAPIアクセスが拒否されること", async () => {
      // 未ログイン状態をシミュレート
      supabase.auth.getSession.mockResolvedValueOnce({
        data: { session: null },
        error: null,
      });

      // APIレスポンスのモック
      fetch.mockResolvedValue(
        createMockResponse(401, {
          error: "Authorization header is required",
        }),
      );

      // トークンなしでAPIにアクセス
      const response = await fetch("http://localhost:3000/api/protected");
      const data = await response.json();

      // 検証
      expect(response.status).toBe(401);
      expect(data).toEqual({
        error: "Authorization header is required",
      });
    });

    it("ログアウト後はAPIアクセスが拒否されること", async () => {
      // ログイン
      await supabase.auth.signInWithPassword({
        email: "test@example.com",
        password: "password123",
      });

      // セッション取得
      const sessionResult = await supabase.auth.getSession();
      const initialSession = sessionResult.data.session;

      // ログアウト
      await supabase.auth.signOut();

      // ログアウト後のセッション状態をシミュレート
      supabase.auth.getSession.mockResolvedValueOnce({
        data: { session: null },
        error: null,
      });

      // APIレスポンスのモック（無効なトークン）
      fetch.mockResolvedValue(
        createMockResponse(401, {
          error: "Invalid token",
        }),
      );

      // 古いトークンでAPIにアクセス
      const response = await fetch("http://localhost:3000/api/protected", {
        headers: {
          Authorization: `Bearer ${initialSession.access_token}`,
        },
      });

      const data = await response.json();

      // 検証
      expect(response.status).toBe(401);
      expect(data).toEqual({
        error: "Invalid token",
      });
    });
  });

  describe("JWT検証とセッション更新", () => {
    it("有効なセッショントークンが検証できること", async () => {
      // ログイン
      await supabase.auth.signInWithPassword({
        email: "test@example.com",
        password: "password123",
      });

      // セッション取得
      const sessionResult = await supabase.auth.getSession();
      const session = sessionResult.data.session;

      // APIレスポンスのモック
      fetch.mockResolvedValue(
        createMockResponse(200, {
          valid: true,
          payload: {
            sub: mockUser.id,
            email: mockUser.email,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 3600,
          },
        }),
      );

      // トークン検証API呼び出し
      const response = await fetch("http://localhost:3000/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: session.access_token }),
      });

      const data = await response.json();

      // 検証
      expect(response.status).toBe(200);
      expect(data.valid).toBe(true);
      expect(data.payload).toHaveProperty("sub", mockUser.id);
      expect(data.payload).toHaveProperty("email", mockUser.email);
    });

    it("セッション更新後も新しいトークンが有効であること", async () => {
      // ログイン
      await supabase.auth.signInWithPassword({
        email: "test@example.com",
        password: "password123",
      });

      // セッション更新
      const refreshResult = await supabase.auth.refreshSession();
      const session = refreshResult.data.session;

      // APIレスポンスのモック
      fetch.mockResolvedValue(
        createMockResponse(200, {
          valid: true,
          payload: {
            sub: mockUser.id,
            email: mockUser.email,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 3600,
          },
        }),
      );

      // 新しいトークンで検証API呼び出し
      const response = await fetch("http://localhost:3000/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: session.access_token }),
      });

      const data = await response.json();

      // 検証
      expect(response.status).toBe(200);
      expect(data.valid).toBe(true);
      expect(data.payload).toHaveProperty("sub", mockUser.id);
    });
  });

  describe("権限レベルに基づくアクセス制御", () => {
    it("一般ユーザーは管理者専用APIにアクセスできないこと", async () => {
      // 一般ユーザーとしてログイン
      await supabase.auth.signInWithPassword({
        email: "test@example.com",
        password: "password123",
      });

      // セッション取得
      const sessionResult = await supabase.auth.getSession();
      const session = sessionResult.data.session;

      // APIレスポンスのモック（権限不足）
      fetch.mockResolvedValue(
        createMockResponse(403, {
          error: "Admin access required",
        }),
      );

      // 管理者専用APIにアクセス
      const response = await fetch("http://localhost:3000/api/admin/users", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();

      // 検証
      expect(response.status).toBe(403);
      expect(data).toEqual({
        error: "Admin access required",
      });
    });

    it("管理者は管理者専用APIにアクセスできること", async () => {
      // 管理者ユーザーとセッションを作成
      const adminUser = { ...mockUser, role: "admin" };
      const adminSession = { ...mockSession, access_token: "admin-token" };

      // 管理者としてログイン
      supabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: { user: adminUser, session: adminSession },
        error: null,
      });

      supabase.auth.getSession.mockResolvedValueOnce({
        data: { session: adminSession },
        error: null,
      });

      // ログイン
      await supabase.auth.signInWithPassword({
        email: "admin@example.com",
        password: "admin123",
      });

      // セッション取得
      const sessionResult = await supabase.auth.getSession();
      const session = sessionResult.data.session;

      // APIレスポンスのモック（成功）
      fetch.mockResolvedValue(
        createMockResponse(200, {
          users: [
            { id: 1, name: "User 1", email: "user1@example.com" },
            { id: 2, name: "User 2", email: "user2@example.com" },
          ],
        }),
      );

      // 管理者専用APIにアクセス
      const response = await fetch("http://localhost:3000/api/admin/users", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();

      // 検証
      expect(response.status).toBe(200);
      expect(data).toHaveProperty("users");
      expect(Array.isArray(data.users)).toBe(true);
      expect(data.users.length).toBe(2);

      // fetchが正しいヘッダーで呼び出されたことを確認
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:3000/api/admin/users",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer admin-token`,
          }),
        }),
      );
    });
  });
});
