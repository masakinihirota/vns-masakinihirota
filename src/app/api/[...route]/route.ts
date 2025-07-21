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

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
