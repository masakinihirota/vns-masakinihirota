---
name: backend-engineering
description: Backend development skill covering Postgres best practices, Hono integration, and Next.js API routes.
---

# Backend Engineering Skill

このスキルは、バックエンド開発（データベース、API、エッジランタイム）におけるベストプラクティスと実装パターンを提供します。

## 1. Postgres & Supabase Best Practices

### Query Performance
- **Missing Indexes**: フィルタ（`WHERE`）、結合（`JOIN`）、ソート（`ORDER BY`）に使用する列にはインデックスを作成する。
- **Selectivity**: `SELECT *` は避け、必要なカラムのみを指定する（例: `.select('id, name')`）。

### Schema Design
- **Keys**: 主キー（PK）と外部キー（FK）を必ず定義する。FKにはインデックスを貼る。
- **JSONB**: 柔軟なスキーマが必要な場合は `JSONB` を使用する（EAVアンチパターン回避）。
- **Normalization**: 適切な正規化を行うが、パフォーマンスのために意図的に非正規化する場合はドキュメントに残す。

### Security (RLS)
- すべてのテーブルで `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` を実行する。
- `auth.uid()` を使用したポリシーを定義し、行レベルでのアクセス制御を徹底する。

### Migration Validation (マイグレーション検証)
マイグレーションファイル作成時は以下の黄金律を遵守してください。

1.  **必ず `db reset` で検証する**: 新規作成後は `npx supabase db reset` を実行し、既存のマイグレーションと矛盾がないか確認する。
2.  **無効な文を含めない**: PL/pgSQL内で単独の変数名（例: `v_item;`）などは構文エラーになる。
3.  **認証チェックの徹底**: `SECURITY DEFINER` 関数を作成する場合は、必ず冒頭で `IF auth.uid() != ...` 等の認証チェックを行う。
4.  **デバッグコードの削除**: `RAISE NOTICE` 等のデバッグ出力はコミット前に削除する。

## 2. Hono x Next.js Patterns

Next.js App Router 上で Hono を使用する場合の標準パターンです。

### Route Handler Setup
`src/app/api/[[...route]]/route.ts`:

```typescript
import { Hono } from "hono";
import { handle } from "hono/vercel";

export const runtime = "edge"; // Edge Runtime推奨

const app = new Hono().basePath("/api");

app.get("/hello", (c) => {
  return c.json({ message: "Hello" });
});

export const GET = handle(app);
export const POST = handle(app);
// ... others
```

### Type Handling
- **Implicit Inference**: `Context` の型は可能な限り推論させる（明示的な `import type { Context }` はビルドエラーの要因になりやすいため）。
- **Edge Cases**: ビルド時に型エラーが発生する場合は、局所的に `any` を使用して回避し、TODOコメントを残す（技術的負債として管理）。

## 3. API Design
- **RESTful**: リソース指向のURL設計を行う（例: `GET /api/users`, `POST /api/users`）。
- **Status Codes**: 適切なHTTPステータスコードを返す（200, 201, 400, 401, 403, 404, 500）。
- **Error Handling**: クライアントには汎用的なエラーメッセージを返し、内部詳細はサーバーログにのみ記録する。
