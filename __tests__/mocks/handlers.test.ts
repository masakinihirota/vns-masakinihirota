import { describe, it, expect, beforeEach } from "vitest";
import { mswServer, http, HttpResponse } from "./server";

const server = mswServer;

describe("MSW API モックハンドラー", () => {
  beforeEach(() => {
    // 各テスト前にハンドラーをリセット
    server.resetHandlers();
  });

  describe("Hono API ルートのモック", () => {
    it("/api/hello エンドポイントが正しいレスポンスを返す", async () => {
      const response = await fetch("/api/hello");
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        message: "Hello from Hono!",
      });
    });

    it("エラーレスポンスが正しく処理される", async () => {
      const response = await fetch("/api/hello/error");
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({
        error: "Internal Server Error",
        message: "Something went wrong",
      });
    });

    it("認証が必要なエンドポイントで認証ヘッダーなしの場合401を返す", async () => {
      const response = await fetch("/api/protected");
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toEqual({
        error: "Unauthorized",
        message: "Authentication required",
      });
    });

    it("認証が必要なエンドポイントで正しい認証ヘッダーがある場合成功する", async () => {
      const response = await fetch("/api/protected", {
        headers: {
          Authorization: "Bearer test-token",
        },
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        message: "Protected resource accessed successfully",
        user: {
          id: "test-user-id",
          email: "test@example.com",
        },
      });
    });

    it("バリデーションエラーが正しく処理される", async () => {
      const response = await fetch("/api/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: "invalid json",
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({
        error: "Bad Request",
        message: "Invalid request body",
      });
    });

    it("有効なリクエストボディでバリデーションが成功する", async () => {
      const testData = { name: "テスト", email: "test@example.com" };
      const response = await fetch("/api/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        message: "Validation successful",
        data: testData,
      });
    });
  });

  describe("Supabase 認証 API のモック", () => {
    it("認証ヘッダーなしでユーザー情報取得時に401を返す", async () => {
      const response = await fetch("https://test.supabase.co/auth/v1/user");
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toEqual({
        error: "invalid_token",
        error_description: "JWT expired",
      });
    });

    it("正しい認証ヘッダーでユーザー情報を取得できる", async () => {
      const response = await fetch("https://test.supabase.co/auth/v1/user", {
        headers: {
          Authorization: "Bearer test-token",
        },
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toMatchObject({
        id: "test-user-id",
        email: "test@example.com",
        aud: "authenticated",
        role: "authenticated",
      });
    });

    it("正しい認証情報でログインが成功する", async () => {
      const response = await fetch("https://test.supabase.co/auth/v1/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toMatchObject({
        access_token: "test-access-token",
        token_type: "bearer",
        expires_in: 3600,
        refresh_token: "test-refresh-token",
        user: {
          id: "test-user-id",
          email: "test@example.com",
        },
      });
    });

    it("間違った認証情報でログインが失敗する", async () => {
      const response = await fetch("https://test.supabase.co/auth/v1/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "wrong@example.com",
          password: "wrongpassword",
        }),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({
        error: "invalid_grant",
        error_description: "Invalid login credentials",
      });
    });

    it("ログアウトが正常に処理される", async () => {
      const response = await fetch("https://test.supabase.co/auth/v1/logout", {
        method: "POST",
      });

      expect(response.status).toBe(204);
    });
  });

  describe("エラーレスポンスとエッジケース", () => {
    it("ネットワークエラーが正しく処理される", async () => {
      try {
        await fetch("/api/network-error");
        // ここに到達してはいけない
        expect(true).toBe(false);
      } catch (error) {
        // ネットワークエラーが発生することを確認
        expect(error).toBeDefined();
      }
    });

    it("レート制限エラーが正しく処理される", async () => {
      const response = await fetch("/api/rate-limit");
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data).toEqual({
        error: "Too Many Requests",
        message: "Rate limit exceeded",
        retry_after: 60,
      });
    });

    it("サーバーメンテナンスエラーが正しく処理される", async () => {
      const response = await fetch("/api/maintenance");
      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data).toEqual({
        error: "Service Unavailable",
        message: "Server is under maintenance",
      });
    });
  });

  describe("カスタムハンドラーの動的追加", () => {
    it("テスト中にカスタムハンドラーを追加できる", async () => {
      // カスタムハンドラーを追加
      server.use(
        http.get("/api/custom", () => {
          return HttpResponse.json({
            message: "Custom handler response",
          });
        }),
      );

      const response = await fetch("/api/custom");
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        message: "Custom handler response",
      });
    });

    it("既存のハンドラーを上書きできる", async () => {
      // 既存の /api/hello ハンドラーを上書き
      server.use(
        http.get("/api/hello", () => {
          return HttpResponse.json({
            message: "Overridden response",
          });
        }),
      );

      const response = await fetch("/api/hello");
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        message: "Overridden response",
      });
    });
  });
});
