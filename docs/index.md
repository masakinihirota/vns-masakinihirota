# vns-masakinihirota ドキュメント

## 概要
vns-masakinihirota は、Next.js 15 と Supabase、Drizzle ORM を中心に据えたモダンな Web アプリケーションです。多言語対応・ダークモード・OAuth 連携を備え、アプリケーションコード、設計書、公開向けドキュメントをマルチリポジトリで分離しています。本ドキュメントはローカルリポジトリ内の状況を整理し、開発者が参照すべき情報をまとめます。

## 関連リポジトリ
- `vns-masakinihirota`: 本リポジトリ。アプリケーション実装および AI 支援用プロンプトを管理。
- `vns-masakinihirota-design`: 要件定義・設計書・UI/UX ガイドラインを管理。
- `vns-masakinihirota-doc`: 公開ドキュメントや用語集、ユーザー/開発者向けガイドを管理。

## サブシステム構成（抜粋）
| ディレクトリ | 役割 |
|--------------|------|
| `src/app` | App Router ルート、レイアウト、ページを格納。
| `src/components` | 共通 UI コンポーネント群。shadcn/ui 派生も含む。
| `src/lib` | Supabase クライアントなどランタイム共通処理。
| `supabase_drizzle` | Drizzle スキーマ・マイグレーション成果物。
| `supabase` | Supabase CLI 設定や SQL 管理ファイル。
| `scripts` | 自動化・補助スクリプト。
| `.github` | タスクリスト、AI 用プロンプト、運用ルール。
| `docs` | 本ドキュメントを含むローカル向け資料。

## 技術スタック
- フロントエンド: Next.js 15 (App Router), React 19, TypeScript (strict)
- UI: shadcn/ui, Radix UI, Tailwind CSS v4
- バックエンド: Supabase (Auth, Storage, Postgres)
- ORM: Drizzle ORM
- 品質管理: Biome (lint/format), Husky + lint-staged
- 国際化: next-intl
- テスト: Vitest / React Testing Library / Playwright（導入準備中）
- 監視: Sentry（未設定）

## サポート機能
- OAuth 認証（Google/GitHub）と匿名ログイン
- 多言語対応（日本語/英語/ドイツ語）
- ダークモード切り替え
- レスポンシブ UI コンポーネント
- Hono を用いた API エンドポイント

## 開発フロー
1. タスク着手前に `.github` 配下のタスクリストと該当ドキュメントを確認。
2. 設計情報が必要な場合は `vns-masakinihirota-design` を参照。
3. 実装と同時に `docs` 配下の記録を更新し、ドキュメントとコードを同期。
4. Biome による lint/format を必ず実行し、Supabase/Drizzle 関連変更時は `pnpm db:generate` → `pnpm db:migrate` を行う。
5. 可能な限りテストを作成し、Vitest/Playwright による自動テストを準備。
6. 作業完了後に Serena メモへ進捗を記録し、必要に応じて公開ドキュメントリポジトリへ連携。

## セットアップ手順
1. Node.js 20 系と pnpm をインストール。
2. Supabase CLI を導入し、必要ならローカルインスタンスを起動。
3. `.env.local` に Supabase 認証情報を設定。

```env
NEXT_PUBLIC_SUPABASE_URL="https://..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="public-anon-key"
SUPABASE_SERVICE_ROLE_KEY="server-only-key"
```

主要コマンド:

| コマンド | 説明 |
|----------|------|
| `pnpm dev` | 開発サーバー起動（Turbopack）。 |
| `pnpm build` | 本番ビルド。 |
| `pnpm start` | 本番ビルドの実行。 |
| `pnpm lint` / `pnpm lint:fix` | Biome による lint / 自動修正。 |
| `pnpm format` | コード整形。 |
| `pnpm db:generate` | Drizzle スキーマから SQL 生成。 |
| `pnpm db:migrate` | Supabase へのマイグレーション適用。 |
| `pnpm db:studio` | Drizzle Studio の起動。 |

## データベースとマイグレーション
- Drizzle ORM により Supabase Postgres のスキーマを型安全に管理。
- スキーマ変更後は `pnpm db:generate` で差分 SQL を確認し、`pnpm db:migrate` で適用。
- 初期テーブルは `supabase_drizzle/schema` を参照。`supabase` 配下にトリガーやカスタム SQL が配置されているため、実行順序に注意。

## 認証とセッション
- Supabase Auth を利用し、OAuth・匿名ログインを提供。
- サーバー側は `src/lib/supabase/server.ts`、ミドルウェアは `src/middleware.ts` に集約。
- 匿名ユーザーのプロファイル昇格・エラーコード統一などのタスクが今後の予定として管理されています。

## 国際化 (i18n)
- `next-intl` を採用し、`next.config.ts` でプラグイン設定。
- 各ページ/コンポーネントで翻訳キーを整理し、言語追加時は辞書ファイルを更新。

## 運用ルール（抜粋）
- 1 タスクは 1〜2 日規模で完結させる。
- PR 作成前に lint/format/テストを実施し、結果を記録。
- ブランチ戦略は `dev` ベースの feature ブランチ運用。コミットメッセージは専用ガイドに従う。
- ドキュメント更新はコード変更と同時に行い、docs リポジトリとの整合性を保つ。

## 今後の整備予定
- Vitest / React Testing Library / Playwright によるテスト基盤整備。
- Sentry など監視ツールの導入。
- 匿名ログインからのプロファイル昇格フロー整備。
- マッチングアルゴリズム v1 実装。

## 参考リンク
- Supabase UI Next.js ソーシャル認証例: <https://supabase.com/ui/docs/nextjs/social-auth>
- Next.js 公式ドキュメント: <https://nextjs.org/docs>
- shadcn/ui: <https://ui.shadcn.com>
