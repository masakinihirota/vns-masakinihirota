# GitHub Copilot 指示書 for `vns-masakinihirota`

### 基本的な指示書

1. **コード生成指示書**

   - ファイル名: `.copilot-codeGeneration-instructions.md`
   - コード生成時のルールや規約を定義します。

2. **コミット指示書**

   - ファイル名: `.copilot-commit-message-instructions.md`
   - コミットメッセージの書き方やルールを定義します。

3. **デザイン指示書**

   - ファイル名: `.copilot-design-system-instructions.md`
   - UI コンポーネントのデザインルールを定義します。

4. **命名規則指示書**

   - ファイル名: `.copilot-namingConventions-instructions.md`
   - 変数名や関数名、ファイル名の命名規則を定義します。

5. **レビュー指示書**

   - ファイル名: `.copilot-review-instructions.md`
   - コードレビューのルールや手順を定義します。

6. **タスク指示書**

   - ファイル名: `.copilot-task-instructions.md`
   - タスクの進行方法や管理ルールを定義します。

7. **テスト指示書**

   - ファイル名: `.copilot-testing-instructions.md`
   - テストの実施方法や基準を定義します。

8. **その他の指示書**
   - **ドキュメント指示書**: `.copilot-document-instructions.md`
   - **Figma 指示書**: `.figma-instructions.md`

### 2.2. 個別指示書

- **conform 指示書**: `.copilot-conform-instructions.md`
- **Supabase 指示書**: `supabase/.supabase-instructions.md`
- **設計指示書**: `vns-masakinihirota-design/_design-instructions.md`
- **キャラクター指示書**: `.copilot-character-instructions.md`
- **コンテキスト指示書**: `.context7-instructions.md`

---

## 3. 参照ファイル・用語集

- 設計書: `vns-masakinihirota-design/`
- タスクリスト: `tasks.md`
- タスク詳細: `_tasks/`配下
- 用語集: `vns-masakinihirota-doc/用語.md`

---

## 3. 指示書の読み込みルール

### 3.1. 優先順位

指示書を読み込む際の優先順位は以下の通りです：

1. **タスクファイル**（`_tasks/doing/`内のプロンプトファイル）
2. **個別指示書**（`.github/`内の `*-instructions.md`ファイル）
3. **全体指示書**（プロジェクト全体のルールを定義したファイル）

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

## 開発環境と主要ツール

### 開発ワークフロー

1.  **ワークスペースのセットアップ**:

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

### 主要ツールと依存関係

- **技術スタック**: **TypeScript、Node.js、Next.js (App Router)、React、Shadcn/UI、Radix UI、Tailwind CSS、Zustand、Supabase、Drizzle ORM、Zod、Stripe**。
- **テスト**: **Vitest、React Testing Library、Storybook**。
- **ドキュメント生成**: **vitepress**。
- **その他**: Sentry, Framelink Figma, Postgres (LOCAL-supabase), git, Sequential Thinking, github, MarkItDown, Context7, Playwright, serena。
- その他の依存関係については、`vns-masakinihirota` の `package.json` を参照してください。

---

## プロジェクト固有の規約

### 1. コーディング規約とフォルダ構造

- **品質**: **性能よりもシンプルさを優先**し、可読性と保守性の高いコードを目指します。

- **スタイル**: **関数型および宣言型のプログラミングパターンを推奨**し、クラスの使用は極力避けてください。

- **命名**: 補助動詞（`isLoading`、`hasError`など）を用いた説明的な変数名を使用してください。純粋な関数には `function` キーワードを使用してください。

- **ファイルサイズ**: **1 ファイルあたりの行数は 500 行以内**にしてください。ファイルがこの制限に近づいたら、モジュールやヘルパーファイルに分割してリファクタリングしてください。

- **モジュール化**: 機能または責任ごとに、明確に分離されたモジュールにコードを整理してください。

- **型**: **`any`を使用しないでください**。厳密な型安全を設定してください。

- **セミコロン**: セミコロンは省略します（ただし、文の曖昧さを避けるために必要な場合は使用する）。

- **コメント**: JSDoc を使った明確なコンテキストを書いてください。コードを修正したらコメントも適切なものにしてください。不要なコメント、食い違いのあるコメントは削除してください。

- **フォルダ構造**: 基本的な Next.js App Router の構造に従い、コンポーネントの配置は**コロケーションパターン**を適用します。ルーティング(App router)とコンポーネントは見やすいように分離し、コンポーネントの集合を１ページ単位として小さなミニアプリを構築するイメージです。

  ```
  - `src/`
    - `app/`
      - `page.tsx` # ルートページ
      - `route1/`
        - `page.tsx` # ルート 1 のページ
        - `layout.tsx` # ルート 1 のレイアウト
        - `index.ts` # route1 ページで使用するコンポーネントをエクスポート
      - `route2/`
        - `page.tsx` # ルート 2 のページ
    - `components/`
      - `common/` # 共通コンポーネント
        - `Button/`
          - `Button.tsx`
          - `Button.test.tsx`
          - `Button.stories.tsx`
        - `Input/`
          - `Input.tsx`
          - `Input.test.tsx`
          - `Input.stories.tsx`
      - `route1/` # route1 ページ用のコンポーネント群
        - `ComponentA/` # コンポーネント A
          - `ComponentA.container.tsx` # Container 層
          - `ComponentA.ui.tsx` # UI 層
          - `useComponentA.ts` # Hooks (ビジネスロジック)
          - `ComponentA.fetch.ts` # データフェッチ
          - `ComponentA.test.ts` # テスト
          - `ComponentA.stories.tsx` # Storybook ストーリー
        - `ComponentB/` # コンポーネント B (上記に準ずる)
        - `index.ts` # route1 配下のコンポーネントをまとめてエクスポート
    - `lib/` # グローバルなユーティリティ、型定義など
    - `utils/` # グローバルなユーティリティ、型定義など
  ```

### 2. コンポーネントの責務と命名規則

各ファイルの役割を明確にし、以下のルールに従ってコードを生成してください。

- **UI 層 (`xxx.ui.tsx`)**:

  - **役割**: 純粋に見た目とインタラクションを担当。props を受け取って表示し、レイアウトを定義。
  - **やっていいこと**: props の表示、UI インタラクション、レイアウト。
  - **やってはダメなこと**: **`useState`、`useEffect`、API 呼び出し（データフェッチは Container/Hooks/Server Components に任せる）**。
  - **テスト**: Visual Regression Test (VRT) や Storybook で見た目のみのテストを行うことを念頭に置く。

- **Container 層 (`xxx.container.tsx`)**:

  - **役割**: データ取得とロジックの統合を担当。Hooks を呼び出し、UI コンポーネントに props を渡し、Composition によって子コンポーネントを注入。UI とロジックの橋渡し役。
  - **やっていいこと**: Hooks の呼び出し、UI への props 渡し、Composition。

- **Hooks (`useXxx.ts`)**:

  - **役割**: 再利用可能なビジネスロジックを担う。状態管理、API 呼び出し、計算処理などを行う。
  - **やっていいこと**: 状態管理、API 呼び出し、計算処理。
  - **やってはダメなこと**: JSX の return、UI 固有の処理。
  - **テスト**: UI の描画確認不要で、ビジネスロジックの単体テストを行う。

- **Composition**:

  - **役割**: 外部からコンポーネントを合成・注入することで、UI 層でのコンポーネントの深いネストを避ける。Container 層で Composition を行う。

- **データフェッチ (`xxx.fetch.ts` または Server Components)**:

  - **役割**: データ取得ロジックを分離。**Next.js の公式推奨に従い、データフェッチはサーバーコンポーネント (`page.tsx` や `layout.tsx`) で行うことを優先**し、結果を props としてコンポーネントに渡すことで再利用性とテスト容易性を高める。
  - Server Actions や tRPC もデータフェッチの方法として利用可能。

### 3. テスト規約

- **配置**: 基本的にテストは `vns-masakinihirota` リポジトリ内に配置します。コンポーネントのテストはコロケーションの考え方により１ページ単位で配置します（関連するコンポーネントと同じフォルダ内に配置）。
- **種類**: 関数はユニットテスト、コンポーネントは React Testing Library を用いたコンポーネントテスト、そして統合テストも考慮します。
- **フレームワーク**: **Vitest と React Testing Library**を使用してください。
- **記述形式**:
  - テストケースは**日本語**で記述してください。
  - テストは `describe` でグループ化し、`it` でテストケースを記述してください。
- **網羅性**:
  - 全ての新しい機能にユニットテストを記述してください。
  - 予想される使用に対するテスト、1 つのエッジケースのテスト、1 つの失敗ケースのテストを少なくとも含めてください。
  - DB や GitHub Copilot のようなサービスへの呼び出しは、常に**モック**を使用してください。
- **更新**: ロジックを変更した場合は、既存のユニットテストを更新する必要があるか確認し、必要に応じて更新してください。
- **テストの目的 (AI 駆動開発の場合)**: GitHub Copilot によるコード生成を「変更」と捉え、テストの主目的は**レグレッションテスト**とします。既存機能が意図せず損なわれていないか、生成されたコードが設計書通りに動作するかを確認してください。

### 4. ドキュメント規約

- 機能を追加または変更する際は、必ず `vns-masakinihirota-doc` を更新します。
- `README.md` には、使い方や説明などを記述し、変更内容は常に反映させてください。
- コードとドキュメントは同時に記述することを推奨します。

---

## GitHub Copilot の振る舞いとルール

GitHub Copilot は、上記の技術スタックと設計原則に精通したエキスパートとして振る舞ってください。

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

**Phase 1（要件定義段階）**:

- 設計書の構想を機能要件・非機能要件に構造化
- ユーザーストーリーの作成
- 技術制約の考慮
- 優先度付けの支援

**Phase 2（設計段階）**:

- 要件定義書を基にしたシステム設計
- データベース・API・コンポーネント設計
- 技術的制約の反映
- 実装可能性の検証

**Phase 3（タスクリスト段階）**:

- 設計書のタスク分解
- 依存関係の明確化
- 工数見積もりの支援
- テスト計画の組み込み

**Phase 4（実装段階）**:

- タスクリストに基づく実装
- コーディング規約の遵守
- テストの同時実装
- 技術的負債の回避

### 避けるべきこと (DON'Ts)

**全段階共通**:

- **ライブラリ**: 存在しないライブラリや関数は使用せず、既知の、検証されたライブラリのみを使用してください。
- **ファイルパス**: コードやテストで参照する前に、ファイルパスやモジュール名が存在することを確認してください。
- **段階飛び越し**: 現在の段階を完了せずに次の段階の作業を行わないでください。

**Phase 1（要件定義段階）では避けること**:

- 具体的な実装方法の詳細化
- 技術的詳細への過度な深入り
- 設計書なしでの要件定義

**Phase 2（設計段階）では避けること**:

- 要件定義書なしでの設計
- 実装コードの詳細記述
- 技術選定の変更（既定スタック以外の提案）

**Phase 3（タスクリスト段階）では避けること**:

- 設計書なしでのタスク分解
- 実装の詳細化
- 依存関係の曖昧な記述

**Phase 4（実装段階）では避けること**:

- **既存コードの変更**: 明示的に指示されていない限り、または `task-list.prompt.md` のタスクに含まれていない限り、既存のコードを削除または上書きしないでください。
- **過信しない**: GitHub Copilot はコーディングエージェント、アシストツールであり、完全な自動化ツールではありません。複雑なロジックや高度な設計判断は、分解して問題を小さくするか、人間の手で行う必要があります。
- **失敗コードの破棄**: 失敗したコードは破棄しましょう。サンクコストにとらわれず、プロジェクトに沿わないコードを残さないでください。
- **技術的負債**: コードの重複、複雑すぎるコード、テストがないコード、ドキュメントがないコード、パフォーマンスが悪いコード、セキュリティ上の問題があるコードを**技術的負債**と定義します。リファクタリング、テストの追加、ドキュメントの作成、パフォーマンス改善、セキュリティ修正を積極的に行い、**技術的負債を徹底的に無くしてください**。
- **リファクタリングの怠り**: AI はコードをコピーする傾向があります。重複を減らすように積極的にリファクタリングを提案し、人間がレビューすることを促してください。

### 環境変数とセキュリティ

- 環境変数は `.env` ファイルおよび `.env.local` ファイルで管理し、Next.js の仕組みに従って安全に利用してください。
- 環境変数の実装は、開発者が責任を持って行ってください。

## Serena MCP の運用統合（標準フロー）

Serena MCP はプロジェクト全体のメタ情報と開発ツール群を提供します（設定: [.serena/project.yml](U:\2025src___masakinihirota\vns-masakinihirota.serena\project.yml)）。以下の運用フローを各 Phase で徹底します。

- 初回セットアップ（リポジトリクローン後/環境更新時のみ）

  - activate_project（プロジェクト有効化）
  - onboarding または check_onboarding_performed（初期タスク検出）
  - get_current_config（利用可能ツール確認）

- タスク開始時チェック（毎タスク）

  - list_dir と read_file で `.serena/` と設計書の最新状態を確認
  - think_about_collected_information（現在の前提/抜け漏れ検出）
  - prepare_for_new_conversation（必要に応じて会話リセット指示）
  - task 定義を要件のどの項目に紐づけるか明示（設計書パスと章立てを添える）

- タスク実行中（実装・設計・テスト）

  - find_symbol / find_referencing_symbols（影響範囲の静的調査）
  - search_for_pattern（横断検索で既存実装の再利用）
  - summarize_changes（差分の要約とレビューポイント抽出）
  - think_about_task_adherence（現在の作業がタスク範囲内かのセルフチェック）

- タスク終了時（毎タスク）
  - write_memory（今回の決定事項/前提/未決事項をメモリに反映）
  - think_about_whether_you_are_done（完了宣言前の最終自己点検）
  - 必要に応じて restart_language_server（IDE 同期不整合がある場合）

## Serena MCP ツールの代表用途

詳細は [.serena/project.yml](U:\2025src___masakinihirota\vns-masakinihirota.serena\project.yml) を参照。主に以下を使用します。

- activate_project / get_current_config / onboarding / check_onboarding_performed
- list_dir / read_file / search_for_pattern
- find_symbol / find_referencing_symbols / find_referencing_code_snippets
- summarize_changes / prepare_for_new_conversation
- think_about_collected_information / think_about_task_adherence / think_about_whether_you_are_done
- write_memory / delete_memory
- replace_lines / insert_at_line（自動編集はレビュー前提、破壊的変更禁止）

## Serena MCP チャット用テンプレート

- 開始時
  - 「このタスクの前提を整理。設計書パスと該当章は X。抜け漏れを think_about_collected_information で指摘して」
  - 「影響範囲を find_symbol と find_referencing_symbols で洗い出して」
- 実装中
  - 「差分を summarize_changes。レビューフォーカス（型安全/責務分離/500 行以内/any 禁止）で」
  - 「今の作業はタスク範囲に収まっているか think_about_task_adherence」
- 終了時
  - 「write_memory で決定事項と未決事項を記録。次タスクへの TODO を箇条書きで」
  - 「完了チェックを think_about_whether_you_are_done」

## メモリ運用ルール

- 記録対象: 決定事項、採用/不採用案の理由、既知の制約、保留事項、次アクション
- 粒度: 1 タスクで要点を 3-7 項目、URL/ファイルパス/章番号を必ず添付
- 二重化: Serena の write_memory に加え、プロジェクトの「memory.md（運用場所はチーム規約に従う）」も更新

## 既存ルールとの統合

- 段階集中: 本指示書の「Phase 1〜4」の各フェーズ開始・終了で Serena を必ず実行
- 破壊的変更禁止: replace_lines 等の自動編集は PR レビュー前提。範囲は当該タスクに限定
- ドキュメント更新: タスク完了時に設計書/ドキュメントの該当ファイルも更新（例: vns-masakinihirota-design, vns-masakinihirota-doc）

## トラブルシュート

- 設定不整合: get_current_config → restart_language_server
- 情報不足: think_about_collected_information → 足りないリファレンスを list_dir/read_file で補完
- 会話の混線: prepare_for_new_conversation → 直近の作業コンテキストのみ再提示

## コーディング・運用ルール

- **不要コードの削除**: 失敗・不要なコードは残さず削除
- **コミット/プッシュ時の自動チェック**: husky で`pnpm check`（コミット時）、`pnpm run build`（プッシュ時）を実行。build 失敗時は push 中止
- **セキュリティ・品質重視**: API キーや秘密情報は環境変数で管理。エラー時は意味のあるメッセージと段階的なデバッグ手順を記載
