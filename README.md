Next.js16
https://www.youtube.com/watch?v=niqdY8Nyxho

キャッシュ
https://nextjs.org/docs/app/api-reference/functions/cacheLife

毎回新鮮なデータが欲しい
SSR
サスペンスで囲む <Suspense></Suspense> :キャッシュしなくてもいい 一瞬消えます。ローディングをつけたい場合はfallbackをつけます。
 <Suspense fallback={Loading...} /></Suspense>

ブログ記事
ISR

ppr
静的な部分
動的な部分
を分けている
🌓

データフェッチがでてきたら
サスペンスでくくるかキャッシュしろと出てくる

クライアント側でデータフェッチ
TanStack Query
SWR

"use cache"
cacheLife("days");
cacheLife("max"); // 30日

default
seconds
minutes
hours
days
weeks
max

キャッシュをすぐに反映させたい場合
古いデータを一回見せる、バックグラウンドで新しいデータを再検証
リバリデートパス revalidatePath("/posts")
リバリデートタグ revalidateTag("posts", "max")

付箋を貼っておく
cacheTag("posts")
付箋を更新
updateTag("posts")
同時に複数のキャッシュデータを更新したい時
最新のデータをすぐに表示したい時、古いデータは見せない








drizzle\trigger_functions\auth.users2auth_users.sql
このトリガーを最初にSQL Editorで実行してください



新しくリポジトリの変更

## Workspace Structure

このプロジェクトは、`masakinihirota` Webアプリケーション開発のための大規模なWorkspaceの一部です。以下にWorkspaceの構成とその役割を示します：

- **vns-masakinihirota**: コアアプリケーションコードを含むメインプロジェクトディレクトリ。、コーディング、デザイン、ワークフローに関するカスタム指示書を格納。
- **vns-masakinihirota-design**: アプリケーションの設計書、ワイヤーフレーム、UI/UXガイドラインを含むディレクトリ。
- **vns-masakinihirota-doc**: 用語集、APIリファレンス、プロジェクト固有のガイドなどのドキュメントを格納。


各ディレクトリは、構造化された効率的な開発プロセスを確保するために重要な役割を果たしています。詳細な情報やリソースについては、それぞれのディレクトリを参照してください。

## Related Repositories

このプロジェクトは以下のリポジトリで構成されています:

- **[vns-masakinihirota](https://github.com/masakinihirota/vns-masakinihirota)**: コアアプリケーションコードを含むメインリポジトリ。コーディングやデザインに関するカスタム指示書。
- **[vns-masakinihirota-design](https://github.com/masakinihirota/vns-masakinihirota-design)**: 設計書やUI/UXガイドライン。
- **[vns-masakinihirota-doc](https://github.com/masakinihirota/vns-masakinihirota-doc)**: 用語集やAPIリファレンスなどのドキュメント。



Supabase UI Next.js Example
Social Authentication
https://supabase.com/ui/docs/nextjs/social-auth

## Overview

本リポジトリは Next.js(App Router) / TypeScript / Supabase / Drizzle ORM / shadcn-ui / Tailwind を基盤としたアプリケーションです。設計・要件・公開ドキュメントはマルチリポジトリで分離されています。

### 技術スタック概要
- Web: Next.js 15, React 19
- 言語: TypeScript (strict)
- UI: shadcn/ui, Radix UI, Tailwind CSS v4
- データ: Supabase (Auth, Storage, Postgres) + Drizzle ORM
- 品質: Biome (lint/format), Husky + lint-staged, (今後) Vitest / RTL / Playwright
- 国際化: next-intl
- 監視: Sentry (未設定)

### ディレクトリ概要
| Path | 説明 |
|------|------|
| `src/app` | App Router ルート/レイアウト/ページ |
| `src/components` | UI コンポーネント (shadcn/ui 拡張含む) |
| `src/lib` | ランタイム共通処理 (supabase クライアントなど) |
| `supabase_drizzle/` | Drizzle スキーマ & 生成成果物 |
| `scripts/` | 自動化/補助スクリプト |
| `.github/` | タスクリスト, AI 用指示書, プロンプト |
| `docs/` | リポジトリローカルの補足ドキュメント |

## Development

### 前提
1. Node.js (推奨: 20.x LTS) / pnpm
2. Supabase CLI (ローカル動作が必要な場合)
3. `.env` or `.env.local` に Supabase 認証情報を設定

### 環境変数 (例)
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...(Server 専用)
```
`SUPABASE_SERVICE_ROLE_KEY` は Server Action / Edge Function 等で必要になる場合のみ利用し、クライアントへ流出しないようにしてください。

### コマンド
| コマンド | 用途 |
|----------|------|
| `pnpm dev` | 開発サーバ起動 (Turbopack) |
| `pnpm build` | 本番ビルド |
| `pnpm start` | 本番起動 |
| `pnpm lint` | Biome lint |
| `pnpm lint:fix` | 自動修正 |
| `pnpm format` | フォーマット |
| `pnpm db:generate` | Drizzle schema から SQL 生成 |
| `pnpm db:migrate` | マイグレーション適用 |
| `pnpm db:studio` | Drizzle Studio 起動 |

## Database / ORM
Drizzle を利用して型安全にスキーマを管理します。初期テーブルは `supabase_drizzle/schema` を参照。
マイグレーションフロー:
1. スキーマ編集
2. `pnpm db:generate`
3. 生成物確認
4. `pnpm db:migrate`

## Authentication
Supabase Auth を利用し以下の方式をサポート:
- OAuth: Google, GitHub
- 匿名ログイン: 初期体験用 (後に昇格フロー TASK-015)

セッション維持: `src/middleware.ts` + `src/lib/supabase/middleware.ts`
Server Side 利用: `src/lib/supabase/server.ts`
将来タスク: プロファイル自動プロビジョン (TASK-016), エラーコード統一 (TASK-017)

## Task Management / AI 指示書
タスクリスト: `.github/__task-list/tasks.md`
プロンプト: `.github/_prompt/PROMPT-xxx.md`
指示書類: `.github/*.md` (命名 / コード生成 / テスト 等)

運用ルール概要:
- 1タスクは 1-2 日規模
- 実装前に関連設計書とタスク指示書を開く
- 完了時にドキュメント & タスクリスト更新

## Coding Standards
- Biome 設定は `biome.jsonc` 参照 (対象から除外されているコンポーネント群に注意)
- import 並び替え: Biome assist 設定で自動
- 厳密 TypeScript (`strict: true`)

## 国際化 (i18n)
`next-intl` を利用。設定エントリ: `createNextIntlPlugin` in `next.config.ts`。

## 今後の整備予定 (抜粋)
- テスト基盤 (Vitest / RTL / Playwright) 導入 (TASK-070〜)
- 監視 Sentry 設定 (TASK-091)
- 昇格フロー & プロファイル自動化 (TASK-015, 016)
- マッチングアルゴリズム v1 (TASK-041, 042)

## Contributing
1. ブランチ: `dev` から feature ブランチ作成
2. コミット: プロジェクトの commit message ルール指示書に従う
3. PR: 自動テスト (将来) を pass 後レビュー依頼

## License
TBD

---
以下、create-next-app 初期 README 原文



ここより下はオリジナル

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
