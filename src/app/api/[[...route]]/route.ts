import { Hono } from "hono";
import { handle } from "hono/vercel";

export const runtime = "edge";

const app = new Hono().basePath("/api");

// Allow `any` for Hono context in this route handler
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.get("/hello", (c: any) => {
  return c.json({
    message: "Hello from Hono!",
  });
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
export const OPTIONS = handle(app);
