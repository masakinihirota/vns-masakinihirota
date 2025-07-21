import { Hono } from "hono";
import { handle } from "hono/vercel";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.get("/hello", (c) => {
  return c.json({
    message: "Hello from Hono!",
  });
});

// ユーザー情報取得エンドポイント（動的ルーティングのテスト用）
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

// 投稿取得エンドポイント（スラッグベースの動的ルーティング）
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

// 認証が必要なエンドポイント（テスト用）
app.get("/protected", (c) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader) {
    return c.json({ error: "Authorization header is required" }, 401);
  }

  if (!authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Invalid authorization format" }, 401);
  }

  const token = authHeader.substring(7);

  // 無効なトークンの場合
  if (token === "invalid-token") {
    return c.json({ error: "Invalid token" }, 401);
  }

  // 期限切れトークンの場合
  if (token === "expired-token") {
    return c.json({ error: "Token expired" }, 401);
  }

  // 権限不足の場合
  if (token === "insufficient-permissions") {
    return c.json({ error: "Insufficient permissions" }, 403);
  }

  // 有効なトークンの場合
  if (token === "valid-token") {
    return c.json({
      message: "Access granted",
      user: {
        id: "user123",
        email: "user@example.com",
        role: "user",
      },
    });
  }

  // 管理者権限が必要な場合
  if (token === "admin-token") {
    return c.json({
      message: "Admin access granted",
      user: {
        id: "admin123",
        email: "admin@example.com",
        role: "admin",
      },
    });
  }

  return c.json({ error: "Invalid token" }, 401);
});

// 管理者権限が必要なエンドポイント（テスト用）
app.get("/admin/users", (c) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Authorization required" }, 401);
  }

  const token = authHeader.substring(7);

  if (token !== "admin-token") {
    return c.json({ error: "Admin access required" }, 403);
  }

  return c.json({
    users: [
      { id: 1, name: "User 1", email: "user1@example.com" },
      { id: 2, name: "User 2", email: "user2@example.com" },
    ],
  });
});

// JWT トークンの検証エンドポイント（テスト用）
app.post("/auth/verify", async (c) => {
  const body = await c.req.json();
  const { token } = body;

  if (!token) {
    return c.json({ error: "Token is required" }, 400);
  }

  // 簡単なJWTトークンの形式チェック（テスト用）
  const jwtPattern = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;

  if (!jwtPattern.test(token)) {
    return c.json({ error: "Invalid JWT format" }, 400);
  }

  // テスト用の有効なJWTトークン
  if (
    token ===
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  ) {
    return c.json({
      valid: true,
      payload: {
        sub: "1234567890",
        name: "John Doe",
        iat: 1516239022,
      },
    });
  }

  return c.json({ error: "Invalid token" }, 401);
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
