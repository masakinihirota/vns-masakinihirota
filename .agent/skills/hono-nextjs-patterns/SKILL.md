---
name: hono-nextjs-patterns
description: HonoとNext.js App Routerの統合、Edge Runtimeの処理、および型定義のトラブルシューティングに関する標準パターン。
---

# Hono x Next.js App Router 実装パターン

このスキルは、Next.js App Router内でHonoを使用するための標準的なプラクティスを文書化したもので、特にEdge Runtimeの互換性とTypeScript設定に焦点を当てています。

## 1. 基本セットアップ (Route Handler)

Next.js App Routerでリクエストを処理するために `hono/vercel` アダプターを使用します。

**`src/app/api/[[...route]]/route.ts`**:

```typescript
import { Hono } from "hono";
import { handle } from "hono/vercel";

// HonoのパフォーマンスのためにEdge Runtimeを強制する
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

## 2. 型チェックと `Context` の問題

厳格なTypeScript環境（`isolatedModules` が有効な場合が多い）では、推論された型を直接使用したり `Context` をインポートしたりすると、`Cannot find name 'Context'` のようなビルドエラーや、型生成中のビルド失敗が発生することがあります。

### 解決策 A: 暗黙的な型付け（推奨）

可能な限りHonoにコンテキストの型を推論させます。

```typescript
app.get("/hello", (c) => { // c は推論される
  return c.json({ ok: true });
});
```

### 解決策 B: 明示的な型インポート（推論が失敗する場合）

型注釈が必要な場合は、必ず `import type` を使用してください。

```typescript
import type { Context } from "hono";

app.get("/hello", (c: Context) => {
  return c.json({ ok: true });
});
```

### 解決策 C: 最後の手段 (`any`)

Honoの型解決に関連する奇妙なビルドエラー（例えば `next build` の型生成中など）が続く場合は、リリースをブロックしないために局所的に `any` を使用し、技術的負債として文書化してください。

```typescript
// TODO: Contextの型推論を修正する
app.get("/hello", (c: any) => {
  return c.json({ ok: true });
});
```

## 3. ディレクトリ構造

APIエンドポイントは最小限に留めます。ロジックは機能固有のモジュールやライブラリに委譲してください。

```
src/app/api/[[...route]]/route.ts  <-- エントリーポイント、Honoセットアップ
src/server/routers/               <-- アプリが成長した場合はルーターを分割
src/lib/types.ts                  <-- 共有Zodスキーマ
```

## 4. よくある落とし穴 (Common Pitfalls)

- **コード内のMarkdown**: `route.ts` を編集する際は注意してください。Markdown構文がTypeScriptファイルに漏れないようにしてください。
- **Runtime変数**: Node.js APIを必要とする場合を除き、Honoの軽量機能を使用している場合は常に `export const runtime = 'edge';` をエクスポートしてください（Node.jsが必要な場合はこれを削除し、必要に応じて `nodejs` compatを使用してください）。
