---
name: code-review
description: Comprehensive code review skill including security, database, UI structure, and anti-pattern checks. Use this for all PR reviews.
---

# Code Review Skill (Comprehensive)

このスキルは、コード品質、セキュリティ、アーキテクチャ、データベース設計を包括的にレビューするための統合スキルです。

## 1. Review Modes (レビューモード)

状況に応じて以下のモードでレビューを行います。

- **Standard**: 通常のPRレビュー。機能要件、バグ、スタイルを確認。
- **Security**: セキュリティ重点レビュー (`security-review`, `rsc-security-audit`)。
- **Strict (Adversarial)**: 敵対的レビュー。シニアエンジニア視点で厳しく弱点を指摘する（アンチパターン、設計の甘さ、保守性の欠如など）。

## 2. Universal Checklist (共通チェックリスト)

- **Correctness**: 仕様通りに動作するか？エッジケースは考慮されているか？
- **Readability**: 変数名・関数名は適切か？可読性は高いか？ (`coding-standards`)
- **Type Safety**: `any` を使用していないか？型推論を有効活用しているか？
- **Terminology**: プロジェクト統一用語を守っているか？ (`terminology-standards`)

## 3. Domain-Specific Checks (領域別チェック)

### 🛡️ Security & RSC Audit

- **Secrets**: APIキーやパスワードがハードコードされていないか？ (`process.env` を使用)
- **Server Actions**: `use server` をRPCとして乱用していないか？ (Route Handlers推奨)
- **Input Validation**: サーバーサイドで **Zod** 等によるバリデーションを行っているか？
- **SQL Injection**: 文字列結合によるSQL構築をしていないか？
- **XSS**: `dangerouslySetInnerHTML` を使用していないか？

### 💾 Database & SQL

- **RLS**: テーブル作成時に RLS (`ENABLE ROW LEVEL SECURITY`) を有効化しているか？
- **Indexes**: 外部キーや検索列にインデックスが貼られているか？ (`Index Shotgun` アンチパターン回避)
- **N+1**: ループ内でクエリを発行していないか？
- **Data Types**: 適切なデータ型（`timestamptz`, `jsonb`）を使用しているか？

### 🏗️ UI Structure & Components

- **Collocation**: `src/components/<page>/<feature>/` の構成を守っているか？
- **Separation**: UI (`.tsx`) とロジック (`.logic.ts`) が分離されているか？
- **Barrel Export**: `index.ts` で適切なエクスポートが行われているか？

### 🧹 Tech Debt & Refactoring

- **Duplication**: 3回以上繰り返されるロジックは共通化されているか？
- **Dead Code**: 未使用の変数やインポート、デバッグログは削除されているか？
- **Complexity**: ネストが深すぎる箇所はガード節で平坦化されているか？

## 4. Adversarial Review Protocol (敵対的レビュー)

「Strict」モード、または重要な設計変更時には以下を自問自答します。

- **「なぜこの実装でなければならないのか？」**: よりシンプルで標準的な方法はないか？
- **「設計の怠慢はないか？」**: タイポ、ディレクトリの重複、役割不明なファイルの放置など。
- **「保守性への冒涜はないか？」**: 1000行超えの巨大ファイル、共通UIの無視、ハードコードされた文字列定数など。
- **「型安全への思考停止はないか？」**: 安易な `any` 使用、`eslint-disable` による踏み倒しなど。
- **「最悪のケース」**: DBがダウンしたら？ ネットワークが遅延したら？ 悪意ある入力が来たら？
- **「YAGNI」**: 今必要ない機能を将来のために作っていないか？

## 5. Feedback Format (フィードバック形式)

指摘事項は以下の形式で記述します。

```markdown
### 🔴 [Critical] SQL Injection Risk
- **Location**: `src/app/api/users/route.ts`
- **Problem**: Query constructed using string concatenation.
- **Fix**: Use parameterized queries or Supabase SDK.

### 🟡 [Major] N+1 Query
- **Location**: `src/components/UserList/UserList.logic.ts`
- **Problem**: Fetching profiles inside a loop.
- **Fix**: Use `.in()` filter to fetch all profiles in one query.
```
