---
applyTo: "**"
---

# GitHub Copilot 指示書 for `vns-masakinihirota`

serena index create

Serena MCP を使い、プロジェクトを常にチェックしてください。

この指示書は、`vns-masakinihirota` プロジェクトにおける GitHub Copilot の使用方法とルールを定義しています。プロジェクトの目的は、Web アプリケーションの開発を効率化し、チーム全体での一貫性を保つことです。

GitHub Copilot の返信の最後に、なにか Tips と関連するアドバイスがありましたら教えて下さい。

## 開発ガイドライン
思考は英語で行います。
会話は日本語で行います。
コミット時のコメントは日本語で書いてください。

serenaのメモリから、現状を抜き出し把握すること
プラン作成→製造→単体テスト→修正を繰り返して、カバレッジ100%達成で次のタスクへ
プラン作成時に詳細なタスク分けを行うこと
タスクが終わるたびにserenaに進捗状況を更新を行うこと

エージェントモードで、許可が必要だったら音を鳴らしてください。
タスクが終わったら、音を鳴らしてください。

## プロジェクト概要

このプロジェクトは、`masakinihirota` Web アプリケーションを開発するためのマルチリポジトリワークスペースです。以下の関心ごとを分離したリポジトリで構成されます。

- **`vns-masakinihirota`**: コアアプリケーションコード（実装およびテスト）、GitHub Copilot 用の指示書・プロンプト
- **`vns-masakinihirota-design`**: 人間が作る設計書・構想・要件定義
- **`vns-masakinihirota-doc`**: 完成した Web アプリのドキュメント

`./.github` コードやドキュメントへの指示書を含みます。



## 主要ツールと依存関係

- **技術スタック**: **TypeScript、Node.js、Next.js (App Router)、React、Shadcn/UI、Radix UI、Tailwind CSS、Zustand、Supabase、Drizzle ORM、Zod、Stripe**。
- **テスト**: **Vitest、React Testing Library、Storybook**。
- **ドキュメント生成**: **vitepress**。
- **その他**: Sentry, Figma, Framer, Postgres (LOCAL-supabase), git, Sequential Thinking, github, MarkItDown, Context7, Playwright, serena。
- その他の依存関係については、`vns-masakinihirota` の `package.json` を参照してください。

### 設計・要件の確認と最新情報の取得

実装前に必ず vns-masakinihirota-design の設計書・要件定義書を確認し、設計変更があれば速やかに反映してください。

### ドキュメント更新の習慣化

コード変更時は vns-masakinihirota-doc の該当ドキュメントも同時に更新してください。
README.md やテスト計画書も常に最新状態を保ちましょう。

## 1. 指示書
指示書は、GitHub Copilot がプロジェクトのタスクを管理し、開発者が効率的に作業を進めるためのガイドラインです。以下の指示書を参照してください。

### code関連

- [コード生成 指示書](./instructions/code/codeGeneration.instructions.md)

- [コンポーネントのテンプレート](./instructions/code/codeTemplate.instructions.md)

- [context7 指示書](./instructions/code/context7.instructions.md)

- [デザインシステム 指示書](./instructions/code/design-system.instructions.md)

- [Drizzle ORM 指示書](./instructions/code/drizzle-orm.instructions.md)

- [命名規則 指示書](./instructions/code/namingConventions.instructions.md)

- [Supabase 指示書](./instructions/code/supabase.instructions.md)

### next.js 関連

- [Next.js App router 指示書](./instructions/code_next.js/appRouter.instructions.md)

- [Next.js コンポーネント 指示書](./instructions/code_next.js/component.instructions.md)

- [conform 指示書](./instructions/code_next.js/conform.instructions.md)

- [next.js 15 cache 指示書](./instructions/code_next.js/next.js15-cache.instructions.md)

- [next.js 15 props 指示書](./instructions/code_next.js/next.js15-props.instructions.md)

- [翻訳 指示書](./instructions/code_next.js/translation.instructions.md)

### テスト関連

- [TDD 指示書](./instructions/code_test/TDD.instructions.md)

- [テストコード 指示書](./instructions/code_test/testing.instructions.md)

### ドキュメント関連

- [ドキュメント 指示書](./instructions/document/document.instructions.md)

### その他の指示書

- [キャラクター 指示書](./instructions/etc/character.instructions.md)

- [データベースアンチパターン 指示書](./instructions/etc/database-anti-patterns.instructions.md)

- [figma 指示書](./instructions/etc/figma.instructions.md)

- [serena 指示書](./instructions/etc/serena-MCP.instructions.md)

### github 関連

- [コミット 指示書](./instructions/github/commit-message.instructions.md)

- [プルリクエスト 指示書](./instructions/github/pullRequest.instructions.md)

- [レビュー 指示書](./instructions/github/review.instructions.md)

---

## タスク関連

タスクリストにタスクをまとめて、タスクは個別の作業指示をお願いします。

- [タスクリスト 指示書](./__task-list/tasks.md)

