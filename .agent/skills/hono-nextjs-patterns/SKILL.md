---
name: hono-nextjs-patterns
description: Standard patterns for integrating Hono with Next.js App Router, handling Edge Runtime, and troubleshooting type definitions.
---

# Hono x Next.js App Router Implementation Patterns

This skill documents standard practices for using Hono within Next.js App Router, specifically focusing on Edge Runtime compatibility and TypeScript configuration.

## 1. Basic Setup (Route Handler)

Use `hono/vercel` adapter to handle requests in Next.js App Router.

**`src/app/api/[[...route]]/route.ts`**:

```typescript
import { Hono } from "hono";
import { handle } from "hono/vercel";

// Force Edge Runtime for Hono performance
export const runtime = "edge";

const app = new Hono().basePath("/api");

app.get("/hello", (c) => {
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
```

## 2. Type Checking & `Context` Issues

In strict TypeScript environments (often with `isolatedModules` enabled), directly using inferred types or importing `Context` can sometimes cause build errors like `Cannot find name 'Context'` or build failures during type generation.

### Solution A: Implicit Typing (Recommended)

Let Hono infer the context type whenever possible.

```typescript
app.get("/hello", (c) => { // c is inferred
  return c.json({ ok: true });
});
```

### Solution B: Explicit Type Import (If inference fails)

If you must annotate, ensure you use `import type`.

```typescript
import type { Context } from "hono";

app.get("/hello", (c: Context) => {
  return c.json({ ok: true });
});
```

### Solution C: The Escape Hatch (`any`)

If weird build errors persist (e.g., during `next build` type generation) specifically related to Hono types not resolving, use `any` locally to unblock the release, but document it as technical debt.

```typescript
// TODO: Fix Context type inference
app.get("/hello", (c: any) => {
  return c.json({ ok: true });
});
```

## 3. Directory Structure

Keep the API entry point minimal. Delegate logic to feature-specific modules or libraries.

```
src/app/api/[[...route]]/route.ts  <-- Entry point, Hono setup
src/server/routers/               <-- Split routers if app grows
src/lib/types.ts                  <-- Shared Zod schemas
```

## 4. Common Pitfalls

- **Markdown in Code**: Be careful when editing `route.ts`. Ensure no Markdown syntax leaks into the TypeScript file.
- **Runtime Variable**: Always export `export const runtime = 'edge';` if you are using Hono's lightweight features, unless you specifically need Node.js APIs (in which case, remove it and use `nodejs` compat if needed).
