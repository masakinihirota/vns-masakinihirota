# GitHub Copilot 指示書 for `vns-masakinihirota`

## 主要ツールと依存関係

- **技術スタック**: **TypeScript、Node.js、Next.js (App Router)、React、Shadcn/UI、Radix UI、Tailwind CSS、Zustand、Supabase、Drizzle ORM、Zod、Stripe**。
- **テスト**: **Vitest、React Testing Library、Storybook**。
- **ドキュメント生成**: **vitepress**。
- **その他**: Sentry, Framelink Figma, Postgres (LOCAL-supabase), git, Sequential Thinking, github, MarkItDown, Context7, Playwright, serena。
- その他の依存関係については、`vns-masakinihirota` の `package.json` を参照してください。

## 全体の指示書

1. **コード生成指示書**

   - ファイル名: `.copilot-codeGeneration-instructions.md`
   - コード生成時のルールや規約を定義します。

2. **命名規則指示書**

   - ファイル名: `.copilot-namingConventions-instructions.md`
   - 変数名や関数名、ファイル名の命名規則を定義します。

3. **タスク指示書**

   - ファイル名: `.copilot-task-instructions.md`
   - タスクの進行方法や管理ルールを定義します。

4. **デザイン指示書**

   - ファイル名: `.copilot-design-system-instructions.md`
   - UI コンポーネントのデザインルールを定義します。

5. **テスト指示書**

   - ファイル名: `.copilot-testing-instructions.md`
   - テストの実施方法や基準を定義します。

6. **コミット指示書**

   - ファイル名: `.copilot-commit-message-instructions.md`
   - コミットメッセージの書き方やルールを定義します。

7. **レビュー指示書**

   - ファイル名: `.copilot-review-instructions.md`
   - コードレビューのルールや手順を定義します。

8. **ドキュメント指示書**

   - ファイル名: `.copilot-document-instructions.md`
   - ドキュメントの書き方やルールを定義します。



### 2.2. 個別指示書

- **コンテキスト指示書**: `./個別指示書/.context7-instructions.md`
	最新の情報で作成されたコード情報を取得します。

- **Next.js App router 指示書**: `./個別指示書/.copilot-appRouter-instructions.md`
	Next.jsのApp routerの書き方やルールを定義します。

- **conform 指示書**: `./個別指示書/.copilot-conform-instructions.md`
	conformライブラリの書き方やルールを定義します。

- **設計指示書**: `./個別指示書/.copilot-design-system-instructions.md`
	デザインシステムの書き方やルールを定義します。

- **Drizzle ORM 指示書**: `.github/個別指示書/.copilot-drizzle-orm.md`
	Drizzle ORMの書き方やルールを定義します。

- **Supabase 指示書**: `.github/supabase指示書/*.md`
	Supabaseの書き方やルールを定義します。

- **キャラクター指示書**: `.copilot-character-instructions.md`

---

3 実装

実装は、
最初に、要件定義書から設計書を作成しています。

その設計書からタスクリストを作成しています。

そのタスクリストからタスク分解をして実装しやすい粒度のタスクを作成します。
そのタスクからプロンプトファイルを書き、
プロンプトファイルを用いてAI指示を出して実装をします。



要件定義書と設計書は
vns-masakinihirota-designリポジトリ内に置いてあります。
その設計書からタスクリストを作成します。

- タスクリスト

`.github\__task-list\tasks.md`

タスクリストのなかから実装するタスクを選び、
タスクが大きかったら、さらにサブタスクに分解をします。

タスク、サブタスクが用意できたら、それを元にプロンプトファイルを作成します。
プロンプトファイルを使用してAIに指示を出して実装をします。

- プロンプトファイルの場所

`.github\_prompt`内のプロンプトファイル

---

## 3. 指示書の読み込みルール

### 3.1. 優先順位

指示書を読み込む際の優先順位は以下の通りです：

1. **タスクファイル**（`.github\_prompt`内のプロンプトファイル）
2. **個別指示書**（`.github/`内の `*-instructions.md`ファイル）
3. **全体指示書**（プロジェクト全体のルールを定義したファイル）


# プロジェクト


## プロジェクト情報の管理

### Serena MCP 連携

- **情報収集パス**: `vns-masakinihirota\.serena`
- **設計書リポジトリ**: `vns-masakinihirota-design`
- **参照方法**: 常に最新の設計書情報を確認してから作業開始

## プロジェクト概要

このプロジェクトは、`masakinihirota` Web アプリケーションを開発するためのマルチリポジトリワークスペースです。以下の関心ごとを分離したリポジトリで構成されます。

- **`vns-masakinihirota`**: コアアプリケーションコード（実装およびテスト）、GitHub Copilot 用の指示書・プロンプト
- **`vns-masakinihirota-design`**: 人間が作る設計書・構想・要件定義
- **`vns-masakinihirota-doc`**: 完成した Web アプリのドキュメント

---

## 開発段階別の指示

### Phase 1: 要件定義支援

**目的**: `vns-masakinihirota-design` の構想・アイデアを構造化された要件定義書に変換

**DO's**:

- 機能要件を優先度付きで整理（Phase 1 MVP / Phase 2 拡張機能）
- ユーザーストーリーを「（ユーザー）として、（目的）のために、（機能）をする」形式で作成
- 技術制約の考慮（TypeScript、Next.js、Supabase、Drizzle ORM）
- 非機能要件（性能、セキュリティ、可用性）の洗い出し

**出力形式**:

- 日本語を使用します。
- 優先度順での機能リスト
- 実装可能性を考慮した粒度

### Phase 2: 設計書作成支援

**目的**: 要件定義を実装可能な設計書に変換

**DO's**:

- システム全体設計（コロケーションパターン適用）
- データベース設計（Supabase スキーマ、ER 図）
- API 設計（Server Actions、Next.js App Router）
- コンポーネント設計（UI 層/Container 層/Hooks 分離）

**制約事項**:

- 1 ファイル 500 行以内
- 型安全性の確保（Zod 使用）
- レスポンシブデザイン対応

### Phase 3: タスクリスト作成支援

**目的**: 設計書を実装可能なタスクに分解

**DO's**:

- 1 タスク 1-2 日で完了する粒度に分解
- 依存関係の明確化
- テスト工程を含むタスク設計
- 工数見積もりの支援

**優先順位**:

1. 認証・基盤機能
2. ユーザープロフィール機能
3. 作品登録・マッチング機能
4. グループ機能

**タスク形式**:

```
# タスク名
**説明**: [タスクの概要]
**関連設計書**: [該当セクション]
**前提条件**: [依存タスク]
**成果物**: [期待される出力]
**テスト要件**: [テスト内容]
```

---


### 段階別作業の原則

**作業開始前の確認**:

1. **Serena MCP**: `vns-masakinihirota\.serena` で現在のプロジェクト状況を確認
2. **設計書**: `vns-masakinihirota-design` で最新の要件・設計情報を確認
3. **現在の段階**: Phase 1（要件定義）/ Phase 2（設計）/ Phase 3（タスクリスト）/ Phase 4（実装）を明確化


### 遵守事項 (DO's)

**全段階共通**:

- **コンテキスト**: コンテキストが不明な場合は、積極的に質問してください。
- **段階集中**: **現在の開発段階に集中**し、段階を飛び越えた作業は避けてください。
- **情報更新**: 各段階完了時に、メモリーファイル `memory.md` を更新してください。

### 環境変数とセキュリティ

- 環境変数は `.env` ファイルおよび `.env.local` ファイルで管理し、Next.js の仕組みに従って安全に利用してください。
- 環境変数の実装は、開発者が責任を持って行ってください。




## 開発環境と主要ツール

    - VS Code のワークスペース機能を使用して複数のリポジトリを管理します。
    - 関連するすべてのリポジトリをワークスペースに追加し、`vns-masakinihirota.code-workspace`として保存します。

    - **ワークスペース設定例**:

```json
{
  "folders": [
    { "path": "vns-masakinihirota" },
    { "path": "vns-masakinihirota-design" },
    { "path": "vns-masakinihirota-doc" }
  ],
  "settings": {}
}

```

2.  **GitHub Copilot を使ったコード生成**:

    - `vns-masakinihirota` リポジトリを使用して、Copilot のプロンプトやガイダンスを定義します。
    - `#` 記号を使用して、特定のファイル、メソッド、またはクラスを参照することで、Copilot のコンテキスト認識を活用します。

3.  **設計とドキュメント**:

    - 設計関連のすべての資料は `vns-masakinihirota-design` に保存します。
    - ユーザー向けドキュメントや内部ガイドは `vns-masakinihirota-doc` に保存します。

4.  **段階的開発プロセス**:

    - **要件定義 → 設計書 → タスクリスト → 実装 → テスト → ドキュメント** の順序で進行します。
    - 各段階完了時に Serena MCP の情報を更新します。



## ドキュメント規約

- 機能を追加または変更する際は、必ず `vns-masakinihirota-doc` を更新します。
- `README.md` には、使い方や説明などを記述し、変更内容は常に反映させてください。
- コードとドキュメントは同時に記述することを推奨します。

---
