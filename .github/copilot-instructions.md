# GitHub Copilot 指示書 for `vns-masakinihirota`

serena index create

Serena MCP を使い、プロジェクトを常にチェックしてください。

この指示書は、`vns-masakinihirota` プロジェクトにおける GitHub Copilot の使用方法とルールを定義しています。プロジェクトの目的は、Web アプリケーションの開発を効率化し、チーム全体での一貫性を保つことです。

GitHub Copilot の返信の最後に、なにか Tips と関連するアドバイスがありましたら教えて下さい。

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

[serena 指示書](serena-MCP.md)

[翻訳指示書](translation-instructions.md)

[タスク指示書](task-instructions.md)

[タスクリスト指示書](task-instructions.md)
タスクリスト（`.github/__task-list/tasks.md`）を新規作成 / 更新 / 再構成する際は、必ずこの指示書を先に開いて内容を読み込み、方針（粒度・依存関係・命名・完了条件・テスト観点）を適用してください。未読状態でのタスク追加は禁止します。

[コード生成指示書](codeGeneration-instructions.md)

[命名規則指示書](namingConventions-instructions.md)

[キャラクター指示書](character-instructions.md)

[ドキュメント指示書](document-instructions.md)

[Next.js App router 指示書](appRouter-instructions.md)

[デザインシステム指示書](design-system-instructions.md)

[figma 指示書](figma-instructions.md)

[Drizzle ORM 指示書](drizzle-orm.md)

[conform 指示書](conform-instructions.md)

[Supabase 指示書](supabase-instructions.md)

[context7 指示書](.context7-instructions.md)

[テスト指示書](testing-instructions.md)

[コミット指示書](commit-message-instructions.md)

[レビュー指示書](review-instructions.md)

---

## 3. 実装

実装は、
最初に、要件定義書から設計書を作成しています。

その設計書からタスクリストを作成しています。

そのタスクリストからタスク分解をして実装しやすい粒度のタスクを作成します。
そのタスクからプロンプトファイルを書き、
プロンプトファイルを用いて AI 指示を出して実装をします。

要件定義書と設計書は
vns-masakinihirota-design リポジトリ内に置いてあります。
その設計書からタスクリストを作成します。

- タスクリスト

`.github/__task-list/tasks.md`

タスクリストのなかから実装するタスクを選び、
タスクが大きかったら、さらにサブタスクに分解をします。

タスク、サブタスクが用意できたら、それを元にプロンプトファイルを作成します。
プロンプトファイルを使用して AI に指示を出して実装をします。

- プロンプトファイルの場所

`.github/_prompt`内のプロンプトファイル

---

## 4. 指示書の読み込みルール

### 4.1. 優先順位

指示書を読み込む際の優先順位は以下の通りです：

1. **タスクファイル**（`.github/_prompt`内のプロンプトファイル）
2. **個別指示書**（`.github/`内の `*-instructions.md`ファイル）
3. **全体指示書**（プロジェクト全体のルールを定義したファイル）

# プロジェクト

## プロジェクト情報の管理

### Serena MCP 連携

- **情報収集パス**: `.serena`
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

1. **Serena MCP**: `vns-masakinihirota/.serena` で現在のプロジェクト状況を確認
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

タスク ID とプロンプトファイル名の対応ルールは以下の通りです：

- タスク ID は `TASK-<番号>` の形式で命名します。
- プロンプトファイル名は `PROMPT-<番号>.md` の形式で命名します。
- タスク ID とプロンプトファイル名の番号は一致させます。

例:

- タスク ID: `TASK-001`
- 対応するプロンプトファイル名: `PROMPT-001.md`

タスク分解・サブタスク化の基準（例: 1-2 日で完了する粒度）

### Serena MCP の分析・レポート生成手順

1. **データ収集**:

- `.serena` ディレクトリ内の最新データを確認します。
- 必要に応じて、`vns-masakinihirota-design` リポジトリから関連情報を取得します。

2. **分析ツールの準備**:

- Serena MCP の分析ツールを起動します。
- プロジェクト設定ファイルを読み込み、現在のプロジェクト状況を確認します。

3. **分析の実行**:

- 分析対象のプロジェクトを選択します。
- 分析は定期的に実行をします。
- タスク、サブタスクの実装前に常に最新の状態を保ってください。
- 必要な分析モジュールを選択します（例: タスク進捗、依存関係、リソース使用状況）。
- 分析対象のデータを指定し、分析を開始します。

4. **レポート生成**:

- 分析結果を基に、レポートを自動生成します。
- レポート形式は PDF または Markdown を選択可能です。

5. **レポートの確認と保存**:

- 生成されたレポートを確認し、必要に応じて修正を加えます。
- 修正版をプロジェクトディレクトリ内の適切な場所に保存します。

6. **共有**:

- レポートをチームメンバーと共有します。
- 必要に応じて、`vns-masakinihirota-doc` リポジトリにアップロードします。

7. **更新**:

- 分析結果を基に、タスクリストや設計書を更新します。
- Serena MCP のデータも最新状態に保ちます。
