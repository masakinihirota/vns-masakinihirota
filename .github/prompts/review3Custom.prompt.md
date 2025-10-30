---
description: Review 指示書 カスタム
mode: agent
tools: ['search/codebase', 'problems', 'changes', 'fetch', 'githubRepo', 'edit/editFiles', 'search', 'runTests', 'runCommands', 'runTasks', 'runNotebooks', 'new', 'extensions', 'usages', 'vscodeAPI', 'think', 'testFailure', 'openSimpleBrowser', 'todos', 'Sentry/search_docs', 'github/create_or_update_file', 'serena/*', 'context7/*', 'sequentialthinking/sequentialthinking', 'edit', 'chrome-devtools/*', 'Postgres(LOCAL-supabase)/*', 'supabase/apply_migration', 'supabase/confirm_cost', 'supabase/deploy_edge_function', 'supabase/execute_sql', 'supabase/generate_typescript_types', 'supabase/get_advisors', 'supabase/get_anon_key', 'supabase/get_edge_function', 'supabase/get_logs', 'supabase/list_migrations', 'supabase/list_tables', 'supabase/search_docs', 'unsplash/*', 'vscode/get_terminal_output', 'shadcn-ui/*', 'shadcn/*', 'playwright/browser_navigate', 'playwright/browser_resize', 'playwright/browser_select_option', 'calil-library-mcp/*', 'sequentialthinking/*']
---

[カスタム]
との差分を対象にレビューしてください。

概要: 自由な文章（プロンプト）で、AIにレビューの観点を細かく指示する方法です。

利用シーン: ただ「レビューして」と頼むだけでなく、「今回は特にパフォーマンスの観点で問題がないか重点的にチェックして」とか、「セキュリティ上の脆弱性がないか調べて」といったように、特定の視点を与えたいときに使います。これにより、自分の目的に合わせた、より質の高いレビュー結果を得ることができます。この機能は比較的新しく追加されたもので、Codexのレビュー能力をさらに引き出すための強力なオプションです。
[/カスタム]


変更箇所ごとに潜在的なバグ、仕様逸脱、動作退行、パフォーマンス劣化、セキュリティ・可用性への影響を優先度順に指摘してください（例: 致命的 > 重大 > 注意 > 軽微）。
各指摘は、影響範囲・再現手順・期待される挙動・修正の方向性を簡潔にまとめ、該当ファイルと行番号を必ず明示してください。
想定と違う動作が懸念される箇所は、理由や前提（例: 入力値、非同期処理、例外処理）を添えて質問または確認事項として列挙してください。
重大な変更にテストが追加されていない場合は、欠落テストの種類や想定ケースを指摘し、必要に応じて具体例を示してください。
問題が見つからなかった場合でも、その旨と残るリスクや追加検証が望ましい箇所を記録してください。

