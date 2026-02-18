---
trigger: always_on
---

# Security & Architecture Rules

React Server Components (RSC)、Supabase、およびNext.jsアーキテクチャに関するセキュリティと設計ルールです。

## 1. React Server Components (RSC) Security

- **Server Actionsの制限**: `use server` を用いた暗黙的なAPI作成（RPC的利用）は原則控え、標準的な **REST API (Route Handlers)** を使用する。
  - 理由: "Flight" プロトコルのデシリアリスク回避、および監視・汎用性の確保。
- **入力検証**: サーバーはクライアント入力を一切信頼せず、必ず **JSON** 形式で受け取り、**Zod** 等でバリデーションを行う。
- **疎結合**: React (Node.js) はビューレイヤーとして扱い、重いバックエンドロジックを密結合させない。

## 2. Next.js Proxy Pattern (Middleware Replacement)

- **middleware.ts の禁止**: プロジェクトルートや `src` 直下への `middleware.ts` 配置を禁止する。
- **src/proxy.ts の採用**: リクエスト介入（ヘッダー操作、リダイレクト、簡易認証チェック）は `src/proxy.ts` に実装する。
  - Next.js 16以降の仕様およびプロジェクト方針に基づく。

## 3. Supabase Best Practices

- **RLS (Row Level Security)**: すべてのテーブルでRLSを有効化し、`auth.uid()` を用いてアクセス制御を徹底する。
- **SQLインジェクション対策**: 文字列結合によるSQL構築は禁止。必ず Supabase JS Client (`supabase.from(...).select(...)`) か、パラメータ化されたクエリを使用する。
- **クライアント管理**:
  - **Server**: `createServerClient` (SSR helper) + Cookie Auth
  - **Client**: `createBrowserClient`
- **パフォーマンス**: 必要なカラムのみを `.select('id, name')` のように明示的に指定する。

## 4. Development Environment (開発環境)

- **認証バイパス**: 開発効率向上のため、ローカルでは `src/app/(protected)/layout.tsx` 等での認証チェックを `NEXT_PUBLIC_DISABLE_AUTH=true` 等でスキップ可能にする。
- **コミット注意**: バイパスコードが本番環境で有効にならないよう、必ず環境変数で制御し、ハードコードしないこと。

## 5. Environment Variables & IPA Guidelines

- **環境変数**: 機密情報（APIキー等）は `.env` ファイルのみで管理し、リポジトリにはコミットしない。
- **IPA安全なウェブサイトの作り方**:
  - OSコマンドインジェクション対策（exec禁止）
  - パス名パラメータの検証（ディレクトリトラバーサル対策）
  - XSS対策（`dangerouslySetInnerHTML` 禁止）
  - CSRF対策（標準保護の有効化）
