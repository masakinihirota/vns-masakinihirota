---
description: 'plans.mdの実装を依頼するプロンプト'
mode: agent
tools: ['search/codebase', 'problems', 'changes', 'fetch', 'githubRepo', 'edit/editFiles', 'search', 'runTests', 'runCommands', 'runTasks', 'runNotebooks', 'new', 'extensions', 'usages', 'vscodeAPI', 'think', 'testFailure', 'openSimpleBrowser', 'todos', 'Sentry/search_docs', 'github/create_or_update_file', 'serena/*', 'context7/*', 'sequentialthinking/sequentialthinking', 'edit', 'chrome-devtools/*', 'Postgres(LOCAL-supabase)/*', 'supabase/apply_migration', 'supabase/confirm_cost', 'supabase/deploy_edge_function', 'supabase/execute_sql', 'supabase/generate_typescript_types', 'supabase/get_advisors', 'supabase/get_anon_key', 'supabase/get_edge_function', 'supabase/get_logs', 'supabase/list_migrations', 'supabase/list_tables', 'supabase/search_docs', 'unsplash/*', 'vscode/get_terminal_output', 'shadcn-ui/*', 'shadcn/*', 'playwright/browser_navigate', 'playwright/browser_resize', 'playwright/browser_select_option', 'calil-library-mcp/*', 'sequentialthinking/*']
---

[plans.md](./plans.md) を読んでください。

## 実装
### RBAC 組織と役割設計書の実装

以下のドキュメントを参考に、
ライブラリの統合方法を調査し、
詳細な実行計画を作成してください。

`0014-02-RBAC 組織と役割設計書.md`

この設計書を[plans.md](./plans.md)に書いてください。
[plans.md](./plans.md) に基づいて実装してください。
進捗に応じて [plans.md](./plans.md) を更新してください。


## このプロンプトが終了したら
正常に終了したか確かめてください
エラーが出てないかチェックしてください。
テストが通っているか確認してください。
以上がすべて確認できたら
コミットをしてください

コミットが完了したらレビューを行います。
`/review` コマンドを使ってください。

レビューが完了したらドキュメントを更新します。
ドキュメントは
`doc/`
に書いてください。


