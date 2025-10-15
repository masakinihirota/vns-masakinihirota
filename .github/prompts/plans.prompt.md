---
mode: 'agent'
model: GPT-5-Codex (Preview)
tools: ['search/codebase', 'problems', 'changes', 'fetch', 'githubRepo', 'edit/editFiles', 'search', 'runTests', 'runCommands', 'runTasks', 'runNotebooks', 'new', 'extensions', 'usages', 'vscodeAPI', 'think', 'testFailure', 'openSimpleBrowser', 'todos', 'Sentry/search_docs', 'github/create_or_update_file', 'serena/*', 'context7/*', 'sequentialthinking/sequentialthinking', 'edit', 'chrome-devtools/*', 'Postgres(LOCAL-supabase)/*', 'supabase/apply_migration', 'supabase/confirm_cost', 'supabase/deploy_edge_function', 'supabase/execute_sql', 'supabase/generate_typescript_types', 'supabase/get_advisors', 'supabase/get_anon_key', 'supabase/get_edge_function', 'supabase/get_logs', 'supabase/list_migrations', 'supabase/list_tables', 'supabase/search_docs', 'unsplash/*', 'vscode/get_terminal_output', 'shadcn-ui/*', 'shadcn/*', 'playwright/browser_navigate', 'playwright/browser_resize', 'playwright/browser_select_option', 'calil-library-mcp/*', 'sequentialthinking/*']

description: 'plans.mdの実装を依頼するプロンプト'
---

アクセス権限設計書の実装計画を [plans.md](../codex/plans.md)に書いてください。

以下のドキュメントを参考に、
ライブラリの統合方法を調査し、
詳細な実行計画を作成してください。

`0020 個別機能 大 -01要件定義書 -02設計書 -03テスト計画書\0012-02-アクセス権限設計書.md`

[plans.md](../codex/plans.md) に基づいて実装してください。
進捗に応じて [plans.md](../codex/plans.md) を更新してください。




# 要件
新機能の実装はプロジェクトの既存アーキテクチャに従って行う。

# 指示
以下の手順で実装を進めてください：
実装はTDD(テスト駆動開発)で行います。

## 開発環境のヒント
- 各パッケージの package.json 内の name フィールドを確認し、正しい名前であることを確認してください（最上位のパッケージはスキップしてください）。
## テスト手順
- 全テストスイートが成功するまで、テストエラーや型エラーを修正してください。
- 変更したコードに対して、たとえ誰も要求していなくてもテストを追加または更新してください。
## PR作成時の指示
- コミット前には必ず `pnpm lint` と `pnpm run build` を実行してください。

