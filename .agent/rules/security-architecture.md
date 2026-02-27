---
trigger: always_on
---

# Security & Architecture Rules

React Server Components (RSC)、Postgres、およびNext.jsアーキテクチャに関するセキュリティと設計ルールです。

## 1. React Server Components (RSC) Security

- **Server Actionsの制限**: `use server` を用いた暗黙的なAPI作成（RPC的利用）は原則控え、標準的な **REST API (Route Handlers)** を使用する。
  - 理由: "Flight" プロトコルのデシリアリスク回避、および監視・汎用性の確保。
- **入力検証**: サーバーはクライアント入力を一切信頼せず、必ず **JSON** 形式で受け取り、**Zod** 等でバリデーションを行う。
- **疎結合**: React (Node.js) はビューレイヤーとして扱い、重いバックエンドロジックを密結合させない。

## 2. Next.js Proxy Pattern (Middleware Replacement)

- **middleware.ts の原則禁止**: プロジェクトルートや `src` 直下への `middleware.ts` 配置は、Next.js 16 以降の仕様およびプロジェクト方針に基づき、原則として禁止する。
- **src/proxy.ts の採用**: リクエスト介入（ヘッダー操作、リダイレクト、簡易認証チェック）は、必ず `src/proxy.ts` 内の `export function proxy(...)` で実装する。
- **Edge Runtime 互換性の遵守**: `proxy.ts` は Edge Runtime で動作するため、データベース・アダプター (`drizzle` 等) を直接インポートしてはならない。セッション確認などが必要な場合は、`fetch` を用いて内部 API (`/api/auth/get-session` 等) を叩く方式を採用すること。

## 3. Postgres

- **RLS (Row Level Security)**: すべてのテーブルでRLSを有効化し、アクセス制御を徹底する。
- **SQLインジェクション対策**: 文字列結合によるSQL構築は禁止。
- **クライアント管理**:
  - **Server**: `createServerClient` (SSR helper) + Cookie Auth
  - **Client**: `createBrowserClient`
- **パフォーマンス**: 必要なカラムのみを `.select('id, name')` のように明示的に指定する。

## 4. Development Environment (開発環境)

- **認証バイパス**: 開発効率向上のため、ローカルでは `src/app/(protected)/layout.tsx` 等での認証チェックを `NEXT_PUBLIC_USE_REAL_AUTH=false` 等でスキップ可能にする。
- **コミット注意**: バイパスコードが本番環境で有効にならないよう、必ず環境変数で制御し、ハードコードしないこと。
- **コミット注意**: バイパスコードが本番環境で有効にならないよう、必ず環境変数で制御し、ハードコードしないこと。

## 5. Environment Variables & IPA Guidelines

- **環境変数**: 機密情報（APIキー等）は `.env` ファイルのみで管理し、リポジトリにはコミットしない。
- **IPA安全なウェブサイトの作り方**:
  - OSコマンドインジェクション対策（exec禁止）
  - パス名パラメータの検証（ディレクトリトラバーサル対策）
  - XSS対策（`dangerouslySetInnerHTML` 禁止）
  - CSRF対策（標準保護の有効化）

## 6. Agent-Facing Architecture (AIエージェント向け設計)

AIエージェントが自律的にAPIを操作する想定を組み込み、安全・確実なアーキテクチャを構築します。

- **Idempotency (冪等性)**: エージェントのリトライによる二重処理（決済、予約など状態変更を伴う操作）を防ぐため、対象APIエンドポイントでは冪等性を担保する。
- **Observability (可観測性) & Audit Logs**: エージェントのアクション（入力内容、ツール呼び出し、トークン使用量など）を追跡可能な監査ログとして記録し、システム操作のブラックボックス化を防ぐ。
- **Async Workflows (非同期処理)**: 長時間を要するAI推論や重い処理は同期的に待たせず非同期化し、エージェントのタイムアウトや不要なリトライによる負荷を防ぐ。

## 7. better-auth Integration (React/Next.js)

`better-auth` を React/Next.js 環境（特に Turbopack）で使用する際は、以下の構成を厳守してください。

- **React フックの提供元**: `useSession` などの React フックを使用する場合、クライアントのインポート元は必ず `better-auth/react` とすること。(`better-auth/client` はバニラ JS 用であり、フックを正しく提供しません)
- **プラグインのインポート**: クライアントサイドのプラグイン（`anonymousClient` 等）は、引き続き `better-auth/client/plugins` からインポートすること。(`better-auth/react/plugins` は存在しません)
- **型安全な利用**: フックを呼び出す際、`(useSession as any)()` のような不正なキャストは避け、正規の `useSession()` 呼び出しを行うこと。

**正しい実装例 (`src/lib/auth-client.ts`):**
```typescript
import { createAuthClient } from "better-auth/react";
import { anonymousClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [anonymousClient()],
});

export const { useSession, signIn, signUp, signOut } = authClient;
```

## 8. Related Rules

詳細な実装ガイドは以下を参照してください:

- **[Strict Review Standards](./strict-review-standards.md)**:
  - 環境変数検証 (OAuth, 本番環境)
  - Database Schema Design Rules (RLS, インデックス, N+1 対策)
  - Error Handling & Logging (セキュリティイベント記録)
  - Testing & TDD Requirements

- **[Coding Standards](./coding-standards.md)**: 基本的なコーディング標準

- **[Test Workflow](..skills/test-workflow/SKILL.md)**: テスト駆動開発ガイド


