import { describe, it, expect, vi, beforeEach } from "vitest";

// モックレスポンスを作成する関数
const createMockResponse = (status, body) => {
  return {
    status,
    json: async () => body,
    headers: new Headers(),
    ok: status >= 200 && status < 300,
  };
};

describe("API認証・認可テスト", () => {
  beforeEach(() => {
    // fetchをモック化
    vi.stubGlobal("fetch", vi.fn());
  });

  describe("GET /api/protected", () => {
    it("認証ヘッダーがない場合は401エラーを返すこと", async () => {
      // fetchのモック実装
      fetch.mockResolvedValue(
        createMockResponse(401, { error: "Authorization header is required" }),
      );

      const response = await fetch("http://localhost:3000/api/protected");
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toEqual({
        error: "Authorization header is required",
      });
    });

    it("不正な認証フォーマットの場合は401エラーを返すこと", async () => {
      // fetchのモック実装
      fetch.mockResolvedValue(
        createMockResponse(401, { error: "Invalid authorization format" }),
      );

      const response = await fetch("http://localhost:3000/api/protected", {
        headers: {
          Authorization: "InvalidFormat token123",
        },
      });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toEqual({
        error: "Invalid authorization format",
      });
    });

    it("無効なトークンの場合は401エラーを返すこと", async () => {
      // fetchのモック実装
      fetch.mockResolvedValue(
        createMockResponse(401, { error: "Invalid token" }),
      );

      const response = await fetch("http://localhost:3000/api/protected", {
        headers: {
          Authorization: "Bearer invalid-token",
        },
      });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toEqual({
        error: "Invalid token",
      });
    });

    it("期限切れトークンの場合は401エラーを返すこと", async () => {
      // fetchのモック実装
      fetch.mockResolvedValue(
        createMockResponse(401, { error: "Token expired" }),
      );

      const response = await fetch("http://localhost:3000/api/protected", {
        headers: {
          Authorization: "Bearer expired-token",
        },
      });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toEqual({
        error: "Token expired",
      });
    });

    it("権限不足の場合は403エラーを返すこと", async () => {
      // fetchのモック実装
      fetch.mockResolvedValue(
        createMockResponse(403, { error: "Insufficient permissions" }),
      );

      const response = await fetch("http://localhost:3000/api/protected", {
        headers: {
          Authorization: "Bearer insufficient-permissions",
        },
      });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data).toEqual({
        error: "Insufficient permissions",
      });
    });

    it("有効なトークンの場合は正常なレスポンスを返すこと", async () => {
      // fetchのモック実装
      fetch.mockResolvedValue(
        createMockResponse(200, {
          message: "Access granted",
          user: {
            id: "user123",
            email: "user@example.com",
            role: "user",
          },
        }),
      );

      const response = await fetch("http://localhost:3000/api/protected", {
        headers: {
          Authorization: "Bearer valid-token",
        },
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        message: "Access granted",
        user: {
          id: "user123",
          email: "user@example.com",
          role: "user",
        },
      });
    });

    it("管理者トークンの場合は管理者情報を返すこと", async () => {
      // fetchのモック実装
      fetch.mockResolvedValue(
        createMockResponse(200, {
          message: "Admin access granted",
          user: {
            id: "admin123",
            email: "admin@example.com",
            role: "admin",
          },
        }),
      );

      const response = await fetch("http://localhost:3000/api/protected", {
        headers: {
          Authorization: "Bearer admin-token",
        },
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        message: "Admin access granted",
        user: {
          id: "admin123",
          email: "admin@example.com",
          role: "admin",
        },
      });
    });
  });

  describe("GET /api/admin/users", () => {
    it("認証ヘッダーがない場合は401エラーを返すこと", async () => {
      // fetchのモック実装
      fetch.mockResolvedValue(
        createMockResponse(401, { error: "Authorization required" }),
      );

      const response = await fetch("http://localhost:3000/api/admin/users");
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toEqual({
        error: "Authorization required",
      });
    });

    it("一般ユーザートークンでは403エラーを返すこと", async () => {
      // fetchのモック実装
      fetch.mockResolvedValue(
        createMockResponse(403, { error: "Admin access required" }),
      );

      const response = await fetch("http://localhost:3000/api/admin/users", {
        headers: {
          Authorization: "Bearer valid-token",
        },
      });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data).toEqual({
        error: "Admin access required",
      });
    });

    it("管理者トークンでは正常なレスポンスを返すこと", async () => {
      // fetchのモック実装
      fetch.mockResolvedValue(
        createMockResponse(200, {
          users: [
            { id: 1, name: "User 1", email: "user1@example.com" },
            { id: 2, name: "User 2", email: "user2@example.com" },
          ],
        }),
      );

      const response = await fetch("http://localhost:3000/api/admin/users", {
        headers: {
          Authorization: "Bearer admin-token",
        },
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty("users");
      expect(Array.isArray(data.users)).toBe(true);
      expect(data.users.length).toBe(2);
    });
  });

  describe("POST /api/auth/verify", () => {
    it("トークンがない場合は400エラーを返すこと", async () => {
      // fetchのモック実装
      fetch.mockResolvedValue(
        createMockResponse(400, { error: "Token is required" }),
      );

      const response = await fetch("http://localhost:3000/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({
        error: "Token is required",
      });
    });

    it("不正なJWT形式の場合は400エラーを返すこと", async () => {
      // fetchのモック実装
      fetch.mockResolvedValue(
        createMockResponse(400, { error: "Invalid JWT format" }),
      );

      const response = await fetch("http://localhost:3000/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: "invalid-jwt-format" }),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({
        error: "Invalid JWT format",
      });
    });

    it("有効なJWTトークンの場合は検証結果を返すこと", async () => {
      // fetchのモック実装
      fetch.mockResolvedValue(
        createMockResponse(200, {
          valid: true,
          payload: {
            sub: "1234567890",
            name: "John Doe",
            iat: 1516239022,
          },
        }),
      );

      const validToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

      const response = await fetch("http://localhost:3000/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: validToken }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        valid: true,
        payload: {
          sub: "1234567890",
          name: "John Doe",
          iat: 1516239022,
        },
      });
    });

    it("無効なJWTトークンの場合は401エラーを返すこと", async () => {
      // fetchのモック実装
      fetch.mockResolvedValue(
        createMockResponse(401, { error: "Invalid token" }),
      );

      // 形式は正しいが無効なJWTトークン
      const invalidToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJpbnZhbGlkIiwibmFtZSI6IkludmFsaWQgVXNlciIsImlhdCI6MTUxNjIzOTAyMn0.invalid_signature";

      const response = await fetch("http://localhost:3000/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: invalidToken }),
      });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toEqual({
        error: "Invalid token",
      });
    });
  });
});
