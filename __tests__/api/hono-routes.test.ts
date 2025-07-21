import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

// テスト用のサーバーセットアップ
const server = setupServer();

// テスト前後の設定
beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

afterAll(() => {
  server.close();
});

beforeEach(() => {
  server.resetHandlers();
});

describe("Hono API Routes", () => {
  describe("GET /api/hello", () => {
    beforeEach(() => {
      server.use(
        http.get("http://localhost:3000/api/hello", () => {
          return HttpResponse.json({
            message: "Hello from Hono!",
          });
        }),
      );
    });

    it("正常なレスポンスを返すこと", async () => {
      const response = await fetch("http://localhost:3000/api/hello");
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toContain(
        "application/json",
      );
      expect(data).toEqual({
        message: "Hello from Hono!",
      });
    });

    it("適切なHTTPヘッダーを設定すること", async () => {
      const response = await fetch("http://localhost:3000/api/hello");

      expect(response.headers.get("content-type")).toContain(
        "application/json",
      );
      expect(response.ok).toBe(true);
    });
  });

  describe("GET /api/user/:id", () => {
    beforeEach(() => {
      server.use(
        http.get("http://localhost:3000/api/user/:id", ({ params }) => {
          const { id } = params;

          // 無効なIDの場合
          if (!id || id === "invalid") {
            return HttpResponse.json(
              { error: "Invalid user ID" },
              { status: 400 },
            );
          }

          // 存在しないユーザーの場合
          if (id === "notfound") {
            return HttpResponse.json(
              { error: "User not found" },
              { status: 404 },
            );
          }

          return HttpResponse.json({
            id,
            name: `User ${id}`,
            email: `user${id}@example.com`,
          });
        }),
      );
    });

    it("有効なユーザーIDで正常なレスポンスを返すこと", async () => {
      const response = await fetch("http://localhost:3000/api/user/123");
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        id: "123",
        name: "User 123",
        email: "user123@example.com",
      });
    });

    it("無効なユーザーIDで400エラーを返すこと", async () => {
      const response = await fetch("http://localhost:3000/api/user/invalid");
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({
        error: "Invalid user ID",
      });
    });

    it("存在しないユーザーIDで404エラーを返すこと", async () => {
      const response = await fetch("http://localhost:3000/api/user/notfound");
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({
        error: "User not found",
      });
    });
  });

  describe("GET /api/posts/:slug", () => {
    beforeEach(() => {
      server.use(
        http.get("http://localhost:3000/api/posts/:slug", ({ params }) => {
          const { slug } = params;

          if (!slug) {
            return HttpResponse.json(
              { error: "Slug is required" },
              { status: 400 },
            );
          }

          return HttpResponse.json({
            slug,
            title: `Post ${slug}`,
            content: `Content for ${slug}`,
          });
        }),
      );
    });

    it("有効なスラッグで正常なレスポンスを返すこと", async () => {
      const response = await fetch("http://localhost:3000/api/posts/test-post");
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        slug: "test-post",
        title: "Post test-post",
        content: "Content for test-post",
      });
    });
  });

  describe("GET /api/data/loading", () => {
    beforeEach(() => {
      server.use(
        http.get("http://localhost:3000/api/data/loading", async () => {
          // 遅延をシミュレート
          await new Promise((resolve) => setTimeout(resolve, 100));
          return HttpResponse.json({ data: "loaded" });
        }),
      );
    });

    it("遅延後に正常なレスポンスを返すこと", async () => {
      const startTime = Date.now();
      const response = await fetch("http://localhost:3000/api/data/loading");
      const endTime = Date.now();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ data: "loaded" });
      // 最低100ms以上の遅延があることを確認
      expect(endTime - startTime).toBeGreaterThanOrEqual(100);
    });
  });

  describe("HTTP Methods", () => {
    beforeEach(() => {
      // 各HTTPメソッドのモックハンドラーを設定
      server.use(
        http.get("http://localhost:3000/api/test-methods", () => {
          return HttpResponse.json({ method: "GET" });
        }),
        http.post("http://localhost:3000/api/test-methods", () => {
          return HttpResponse.json({ method: "POST" });
        }),
        http.put("http://localhost:3000/api/test-methods", () => {
          return HttpResponse.json({ method: "PUT" });
        }),
        http.delete("http://localhost:3000/api/test-methods", () => {
          return HttpResponse.json({ method: "DELETE" });
        }),
      );
    });

    it("GETメソッドが正常に動作すること", async () => {
      const response = await fetch("http://localhost:3000/api/test-methods", {
        method: "GET",
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ method: "GET" });
    });

    it("POSTメソッドが正常に動作すること", async () => {
      const response = await fetch("http://localhost:3000/api/test-methods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ test: "data" }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ method: "POST" });
    });

    it("PUTメソッドが正常に動作すること", async () => {
      const response = await fetch("http://localhost:3000/api/test-methods", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ test: "data" }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ method: "PUT" });
    });

    it("DELETEメソッドが正常に動作すること", async () => {
      const response = await fetch("http://localhost:3000/api/test-methods", {
        method: "DELETE",
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ method: "DELETE" });
    });
  });

  describe("レスポンス形式の検証", () => {
    beforeEach(() => {
      server.use(
        http.get("http://localhost:3000/api/response-format", () => {
          return HttpResponse.json(
            {
              success: true,
              data: {
                id: 1,
                name: "テストデータ",
                createdAt: "2024-01-01T00:00:00.000Z",
              },
              meta: {
                timestamp: "2024-01-01T00:00:00.000Z",
                version: "1.0.0",
              },
            },
            {
              status: 200,
              headers: {
                "Content-Type": "application/json",
                "X-API-Version": "1.0.0",
              },
            },
          );
        }),
      );
    });

    it("正しいJSONレスポンス形式を返すこと", async () => {
      const response = await fetch("http://localhost:3000/api/response-format");
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toContain(
        "application/json",
      );
      expect(response.headers.get("x-api-version")).toBe("1.0.0");

      expect(data).toHaveProperty("success", true);
      expect(data).toHaveProperty("data");
      expect(data).toHaveProperty("meta");
      expect(data.data).toHaveProperty("id", 1);
      expect(data.data).toHaveProperty("name", "テストデータ");
      expect(data.meta).toHaveProperty("version", "1.0.0");
    });
  });

  describe("ステータスコードの検証", () => {
    beforeEach(() => {
      server.use(
        http.get("http://localhost:3000/api/status/200", () => {
          return HttpResponse.json({ status: "OK" }, { status: 200 });
        }),
        http.get("http://localhost:3000/api/status/201", () => {
          return HttpResponse.json({ status: "Created" }, { status: 201 });
        }),
        http.get("http://localhost:3000/api/status/400", () => {
          return HttpResponse.json({ error: "Bad Request" }, { status: 400 });
        }),
        http.get("http://localhost:3000/api/status/404", () => {
          return HttpResponse.json({ error: "Not Found" }, { status: 404 });
        }),
        http.get("http://localhost:3000/api/status/500", () => {
          return HttpResponse.json(
            { error: "Internal Server Error" },
            { status: 500 },
          );
        }),
      );
    });

    it("200 OKステータスを正しく返すこと", async () => {
      const response = await fetch("http://localhost:3000/api/status/200");
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ status: "OK" });
    });

    it("201 Createdステータスを正しく返すこと", async () => {
      const response = await fetch("http://localhost:3000/api/status/201");
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual({ status: "Created" });
    });

    it("400 Bad Requestステータスを正しく返すこと", async () => {
      const response = await fetch("http://localhost:3000/api/status/400");
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: "Bad Request" });
    });

    it("404 Not Foundステータスを正しく返すこと", async () => {
      const response = await fetch("http://localhost:3000/api/status/404");
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ error: "Not Found" });
    });

    it("500 Internal Server Errorステータスを正しく返すこと", async () => {
      const response = await fetch("http://localhost:3000/api/status/500");
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Internal Server Error" });
    });
  });
});
