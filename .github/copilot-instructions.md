---
applyTo: "**"
---

# 生成AIへの 指示書 for `vns-masakinihirota` プロジェクト

文書は必ず日本語を使用してください。

長くなってもOK。時間をいくらかけても良いので、品質を優先して作成してください。

必ず logger.* を使用してください、console.log は使用しないでください。

## プロジェクトの概要

このプロジェクトは、`masakinihirota` Web アプリケーションを開発するためのマルチリポジトリワークスペースです。
以下の関心ごとを分離したリポジトリで構成されます。

- **`vns-masakinihirota`**: コアアプリケーションコード（実装およびテスト）、GitHub Copilot 用の指示書・プロンプト、ドキュメント
- **`vns-masakinihirota-design`**: 人間が作る設計書・構想・要件定義

# テスト駆動開発

コンポーネントのテストはコロケーションの考え方を導入する

- 各コンポーネントに対して、その近くにテストコードを配置します。
- これにより、コードとテストの関連性が明確になり、保守性が向上します。

システムに関するテストは専用のテストディレクトリにまとめる

- システム全体の振る舞いを検証するテストは、専用のテストディレクトリ（例: `tests/`）に配置します。
- これにより、システム全体のテストが一元管理され、実行しやすくなります。

# Next.js 16 重要な変更点

**Proxy (旧 Middleware)**:
- ✅ ファイル名: `src/proxy.ts` (正)
- ✅ 関数名: `export async function proxy()` (正)
- ❌ `middleware.ts` や `middleware()` は非推奨（Next.js 16～）

**Async Request APIs**:
- ✅ `await params`, `await searchParams` (必須)
- ✅ `await cookies()`, `await headers()`, `await draftMode()` (必須)
- ❌ 同期的アクセスはエラー

**Caching APIs**:
- ✅ `revalidateTag(tag, "max")` - 第2引数必須
- ✅ `updateTag(tag)` - Server Actions専用、即座に反映
- ✅ `refresh()` - Server Actions専用、キャッシュ外データ更新

**next/image**:
- minimumCacheTTL: 60秒 → 4時間
- ローカル画像のクエリ文字列: `images.localPatterns`必須

**Parallel Routes**:
- すべてのスロットに `default.js` 必須

詳細は `.agent/rules/coding-standards.md` の「Next.js 16 Specific Rules」を参照

# Better Auth / Drizzle 運用の必須ルール

- `auth.ts` が参照する Better Auth スキーマと、`drizzle.config.ts` の `schema` 参照先で、
	`user` / `session` / `account` / `verification` テーブルの列名を必ず一致させること。
- 特に `snake_case` と `camelCase` の混在を禁止。混在すると OAuth で `column does not exist` の 500 が発生します。
- デプロイ前に `pnpm db:auth:check` を実行し、失敗した場合は `pnpm db:auth:fix-compat` で修復してから再デプロイすること。

# その他

GitHub Copilot の返信の最後に、なにか Tips と関連するアドバイスがありましたら教えて下さい。
