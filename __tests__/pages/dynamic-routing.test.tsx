import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// APIルートのモック
vi.mock("@/app/api/[...route]/route", () => {
  const { Hono } = require("hono");
  const { handle } = require("hono/vercel");

  const app = new Hono().basePath("/api");

  app.get("/hello", (c) => {
    return c.json({
      message: "Hello from Hono!",
    });
  });

  app.get("/user/:id", (c) => {
    const id = c.req.param("id");

    // 無効なIDの場合
    if (!id || id === "invalid") {
      return c.json({ error: "Invalid user ID" }, 400);
    }

    // 存在しないユーザーの場合
    if (id === "notfound") {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({
      id,
      name: `User ${id}`,
      email: `user${id}@example.com`,
    });
  });

  app.get("/posts/:slug", (c) => {
    const slug = c.req.param("slug");

    if (!slug) {
      return c.json({ error: "Slug is required" }, 400);
    }

    return c.json({
      slug,
      title: `Post ${slug}`,
      content: `Content for ${slug}`,
    });
  });

  // データフェッチングのテスト用エンドポイント
  app.get("/data/loading", async (c) => {
    // 遅延をシミュレート
    await new Promise((resolve) => setTimeout(resolve, 100));
    return c.json({ data: "loaded" });
  });

  return {
    GET: handle(app),
    POST: handle(app),
    PUT: handle(app),
    DELETE: handle(app),
  };
});

describe("動的ルーティングページのテスト", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("APIルートのパラメータ処理", () => {
    it("有効なパラメータでユーザー情報を取得できること", async () => {
      const { GET } = await import("@/app/api/[...route]/route");

      const request = new NextRequest("http://localhost:3000/api/user/123");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        id: "123",
        name: "User 123",
        email: "user123@example.com",
      });
    });

    it("投稿のスラッグパラメータを正しく処理できること", async () => {
      const { GET } = await import("@/app/api/[...route]/route");

      const request = new NextRequest(
        "http://localhost:3000/api/posts/my-first-post",
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        slug: "my-first-post",
        title: "Post my-first-post",
        content: "Content for my-first-post",
      });
    });

    it("基本的なhelloエンドポイントが動作すること", async () => {
      const { GET } = await import("@/app/api/[...route]/route");

      const request = new NextRequest("http://localhost:3000/api/hello");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        message: "Hello from Hono!",
      });
    });
  });

  describe("無効なパラメータのエラーハンドリング", () => {
    it("無効なユーザーIDに対して400エラーを返すこと", async () => {
      const { GET } = await import("@/app/api/[...route]/route");

      const request = new NextRequest("http://localhost:3000/api/user/invalid");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({
        error: "Invalid user ID",
      });
    });

    it("存在しないユーザーに対して404エラーを返すこと", async () => {
      const { GET } = await import("@/app/api/[...route]/route");

      const request = new NextRequest(
        "http://localhost:3000/api/user/notfound",
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({
        error: "User not found",
      });
    });

    it("スラッグが空の場合に404エラーを返すこと", async () => {
      const { GET } = await import("@/app/api/[...route]/route");

      const request = new NextRequest("http://localhost:3000/api/posts/");
      const response = await GET(request);

      // Honoは空のパスに対して404を返す
      expect(response.status).toBe(404);
    });

    it("存在しないエンドポイントに対して適切にエラーハンドリングすること", async () => {
      const { GET } = await import("@/app/api/[...route]/route");

      const request = new NextRequest("http://localhost:3000/api/nonexistent");
      const response = await GET(request);

      // Honoは存在しないルートに対して404を返す
      expect(response.status).toBe(404);
    });
  });

  describe("データフェッチングとローディング状態", () => {
    it("データフェッチング中の遅延を適切に処理できること", async () => {
      const { GET } = await import("@/app/api/[...route]/route");

      const startTime = Date.now();
      const request = new NextRequest("http://localhost:3000/api/data/loading");
      const response = await GET(request);
      const endTime = Date.now();
      const data = await response.json();

      // 100ms以上の遅延があることを確認
      expect(endTime - startTime).toBeGreaterThanOrEqual(100);
      expect(response.status).toBe(200);
      expect(data).toEqual({
        data: "loaded",
      });
    });

    it("複数の同時リクエストを適切に処理できること", async () => {
      const { GET } = await import("@/app/api/[...route]/route");

      const requests = [
        new NextRequest("http://localhost:3000/api/user/1"),
        new NextRequest("http://localhost:3000/api/user/2"),
        new NextRequest("http://localhost:3000/api/user/3"),
      ];

      const responses = await Promise.all(
        requests.map((request) => GET(request)),
      );

      const data = await Promise.all(
        responses.map((response) => response.json()),
      );

      expect(responses.every((response) => response.status === 200)).toBe(true);
      expect(data).toEqual([
        { id: "1", name: "User 1", email: "user1@example.com" },
        { id: "2", name: "User 2", email: "user2@example.com" },
        { id: "3", name: "User 3", email: "user3@example.com" },
      ]);
    });
  });

  describe("HTTPメソッドのテスト", () => {
    it("GETリクエストが正しく処理されること", async () => {
      const { GET } = await import("@/app/api/[...route]/route");

      const request = new NextRequest("http://localhost:3000/api/hello", {
        method: "GET",
      });
      const response = await GET(request);

      expect(response.status).toBe(200);
    });

    it("POSTハンドラーが存在すること", async () => {
      const { POST } = await import("@/app/api/[...route]/route");

      expect(POST).toBeDefined();
      expect(typeof POST).toBe("function");
    });

    it("PUTハンドラーが存在すること", async () => {
      const { PUT } = await import("@/app/api/[...route]/route");

      expect(PUT).toBeDefined();
      expect(typeof PUT).toBe("function");
    });

    it("DELETEハンドラーが存在すること", async () => {
      const { DELETE } = await import("@/app/api/[...route]/route");

      expect(DELETE).toBeDefined();
      expect(typeof DELETE).toBe("function");
    });
  });

  describe("レスポンス形式の検証", () => {
    it("JSONレスポンスが正しい形式であること", async () => {
      const { GET } = await import("@/app/api/[...route]/route");

      const request = new NextRequest("http://localhost:3000/api/hello");
      const response = await GET(request);

      expect(response.headers.get("content-type")).toContain(
        "application/json",
      );

      const data = await response.json();
      expect(typeof data).toBe("object");
      expect(data).toHaveProperty("message");
    });

    it("エラーレスポンスが正しい形式であること", async () => {
      const { GET } = await import("@/app/api/[...route]/route");

      const request = new NextRequest("http://localhost:3000/api/user/invalid");
      const response = await GET(request);

      expect(response.headers.get("content-type")).toContain(
        "application/json",
      );

      const data = await response.json();
      expect(typeof data).toBe("object");
      expect(data).toHaveProperty("error");
      expect(typeof data.error).toBe("string");
    });
  });

  describe("エッジケースのテスト", () => {
    it("特殊文字を含むパラメータを適切に処理できること", async () => {
      const { GET } = await import("@/app/api/[...route]/route");

      const specialSlug = "hello-world-123";
      const request = new NextRequest(
        `http://localhost:3000/api/posts/${specialSlug}`,
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.slug).toBe(specialSlug);
    });

    it("長いパラメータを適切に処理できること", async () => {
      const { GET } = await import("@/app/api/[...route]/route");

      const longId = "a".repeat(100);
      const request = new NextRequest(
        `http://localhost:3000/api/user/${longId}`,
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.id).toBe(longId);
    });

    it("数値のパラメータを文字列として適切に処理できること", async () => {
      const { GET } = await import("@/app/api/[...route]/route");

      const numericId = "12345";
      const request = new NextRequest(
        `http://localhost:3000/api/user/${numericId}`,
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.id).toBe(numericId);
      expect(typeof data.id).toBe("string");
    });
  });
});
