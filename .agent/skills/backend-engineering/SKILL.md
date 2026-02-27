---
name: backend-engineering
description: Backend development skill covering Postgres best practices, Hono integration, and Next.js API routes.
---

# Backend Engineering Skill

このスキルは、バックエンド開発（データベース、API、エッジランタイム）におけるベストプラクティスと実装パターンを提供します。

## 1. Drizzle ORM & Postgres Best Practices

本プロジェクトでは **Drizzle ORM** をデータベース操作の標準として採用しています。

### Schema Definition

- **Type Safety**: カラム定義時には必ず適切な型を使用し、`notNull()` 制約を基本とする。
- **Relations**: `relations` ヘルパーを使用して、テーブル間のリレーションを明示的に定義する。

### Query Patterns

- **Query Builder**: 複雑なSQLを書く代わりに、Drizzleの `db.query.users.findMany(...)` や `db.select().from(...)` を使用する。
- **Performance**: `with: { ... }` を使用した効率的なリレーション取得を行い、N+1問題を回避する。
- **Partial Select**: 必要なカラムのみを選択し、帯域幅を節約する。

### Migrations

- **Generation**: `pnpm db:generate` (または `db:generate:postgres`) でマイグレーションファイルを生成する。
- **Application**: 開発環境では `pnpm db:migrate` で適用し、本番環境への適用フローを確認する。
- **Validation**: 生成されたSQLを目視確認し、予期せぬ破壊的変更（DROP TABLE等）が含まれていないかチェックする。

## 2. Postgres Specifics

### Security (RLS)

- すべてのテーブルで `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` を実行する（DrizzleマイグレーションまたはSQLエディタで管理）。

### Direct Usage

Drizzleでカバーできない操作（Storage, Auth管理など）および、RLSを完全に活用するクライアントサイド取得には クライアントを使用する。

## 3. Hono x Next.js Patterns

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

## 4. API Design

- **RESTful**: リソース指向のURL設計を行う（例: `GET /api/users`, `POST /api/users`）。
- **Status Codes**: 適切なHTTPステータスコードを返す（200, 201, 400, 401, 403, 404, 500）。
- **Error Handling**: クライアントには汎用的なエラーメッセージを返し、内部詳細はサーバーログにのみ記録する。

## 5. Agent-Facing API & Resilience

AIエージェントがAPIを利用する際の安全性と可用性を高めるための実装パターンです。

- **Idempotency**: 状態を変更するPOST/PUT/DELETEリクエストには、`Idempotency-Key` ヘッダーを利用する設計を標準とする。リクエスト処理状態を記録し、同一キーでの再送時には以前のレスポンスをそのまま返す。
- **Async/Job Queue**: 処理に時間がかかる操作は同期的に完了させず、ジョブIDとともに `202 Accepted` を返す。クライアント側が状態を確認できるようにポーリング用エンドポイントまたはWebhookを提供する。
- **Observability**: アプリケーションログには、実行元のエージェントやリクエストを特定・追跡するためのメタデータ（`traceId`, `toolName`, `agentId`）やパフォーマンス指標（処理時間、トークン消費量）を含める。
