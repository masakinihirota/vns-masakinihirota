import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createMockSupabaseClient } from "./supabase-enhanced-client";
import { mockUser, mockSession, mockAuthState } from "./supabase-auth";

describe("Supabase認証モック", () => {
  let supabase: ReturnType<typeof createMockSupabaseClient>;

  beforeEach(() => {
    supabase = createMockSupabaseClient();
    // 認証状態をリセット
    mockAuthState.user = null;
    mockAuthState.session = null;
  });

  afterEach(() => {
    supabase._clearMockData();
  });

  describe("ログイン機能", () => {
    it("メールとパスワードでログインできること", async () => {
      const result = await supabase.auth.signInWithPassword({
        email: "test@example.com",
        password: "password123",
      });

      expect(result.error).toBeNull();
      expect(result.data.user).toEqual(mockUser);
      expect(result.data.session).toBeDefined();
      expect(result.data.session?.access_token).toBeDefined();
    });

    it("不正なパスワードでログインできないこと", async () => {
      const result = await supabase.auth.signInWithPassword({
        email: "test@example.com",
        password: "wrongpassword",
      });

      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe("Invalid login credentials");
      expect(result.data.user).toBeNull();
      expect(result.data.session).toBeNull();
    });

    it("メールリンクでログインリクエストを送信できること", async () => {
      const result = await supabase.auth.signInWithOtp({
        email: "test@example.com",
      });

      expect(result.error).toBeNull();
    });

    it("OAuthプロバイダーでログインリクエストを送信できること", async () => {
      const result = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      expect(result.error).toBeNull();
      expect(result.data.provider).toBe("google");
      expect(result.data.url).toBeDefined();
    });
  });

  describe("サインアップ機能", () => {
    it("新規ユーザーを登録できること", async () => {
      const result = await supabase.auth.signUp({
        email: "new@example.com",
        password: "password123",
      });

      expect(result.error).toBeNull();
      expect(result.data.user).toBeDefined();
      expect(result.data.user?.email).toBe("new@example.com");
    });

    it("既存のメールアドレスで登録できないこと", async () => {
      const result = await supabase.auth.signUp({
        email: "test@example.com",
        password: "password123",
      });

      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe("Email already registered");
    });
  });

  describe("セッション管理", () => {
    it("ログイン後にセッションを取得できること", async () => {
      // まずログイン
      await supabase.auth.signInWithPassword({
        email: "test@example.com",
        password: "password123",
      });

      // セッション取得
      const sessionResult = await supabase.auth.getSession();
      expect(sessionResult.error).toBeNull();
      expect(sessionResult.data.session).toBeDefined();
      expect(sessionResult.data.session?.user.email).toBe("test@example.com");
    });

    it("ログイン後にユーザー情報を取得できること", async () => {
      // まずログイン
      await supabase.auth.signInWithPassword({
        email: "test@example.com",
        password: "password123",
      });

      // ユーザー情報取得
      const userResult = await supabase.auth.getUser();
      expect(userResult.error).toBeNull();
      expect(userResult.data.user).toBeDefined();
      expect(userResult.data.user?.email).toBe("test@example.com");
    });

    it("セッションを更新できること", async () => {
      // まずログイン
      await supabase.auth.signInWithPassword({
        email: "test@example.com",
        password: "password123",
      });

      const oldSession = await supabase.auth.getSession();
      const oldToken = oldSession.data.session?.access_token;

      // セッション更新
      const refreshResult = await supabase.auth.refreshSession();
      expect(refreshResult.error).toBeNull();
      expect(refreshResult.data.session).toBeDefined();

      // トークンが更新されていることを確認
      const newToken = refreshResult.data.session?.access_token;
      expect(newToken).not.toBe(oldToken);
    });

    it("ログアウトするとセッションが削除されること", async () => {
      // まずログイン
      await supabase.auth.signInWithPassword({
        email: "test@example.com",
        password: "password123",
      });

      // ログアウト
      await supabase.auth.signOut();

      // セッションが削除されていることを確認
      const sessionResult = await supabase.auth.getSession();
      expect(sessionResult.data.session).toBeNull();

      // ユーザー情報も取得できないことを確認
      const userResult = await supabase.auth.getUser();
      expect(userResult.data.user).toBeNull();
    });
  });

  describe("パスワード管理", () => {
    it("パスワードリセットメールを送信できること", async () => {
      const result =
        await supabase.auth.resetPasswordForEmail("test@example.com");
      expect(result.error).toBeNull();
    });

    it("存在しないメールアドレスにパスワードリセットメールを送信できないこと", async () => {
      const result = await supabase.auth.resetPasswordForEmail(
        "nonexistent@example.com",
      );
      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe("Email not found");
    });

    it("ログイン状態でパスワードを更新できること", async () => {
      // まずログイン
      await supabase.auth.signInWithPassword({
        email: "test@example.com",
        password: "password123",
      });

      // パスワード更新
      const result = await supabase.auth.updateUser({
        password: "newpassword123",
      });

      expect(result.error).toBeNull();
      expect(result.data.user).toBeDefined();
    });
  });
});
