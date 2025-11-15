---
description: Review DBスキーマ
agent: agent
tools: ['edit', 'runNotebooks', 'search', 'new', 'runCommands', 'runTasks', 'chrome-devtools/*', 'context7/*', 'next-devtools/*', 'Postgres(LOCAL-supabase)/*', 'Sentry/search_docs', 'sequentialthinking/*', 'serena/*', 'shadcn/*', 'shadcn-ui/*', 'supabase/deploy_edge_function', 'supabase/execute_sql', 'supabase/generate_typescript_types', 'supabase/get_edge_function', 'supabase/list_tables', 'supabase/search_docs', 'unsplash/*', 'vscode/*', 'usages', 'vscodeAPI', 'problems', 'changes', 'testFailure', 'openSimpleBrowser', 'fetch', 'githubRepo', 'extensions', 'todos', 'runSubagent', 'runTests']
---

DBスキーマをレビューしてください。
現在Supabaseのスキーマと照合し、以下の観点で確認を行ってください。
Drizzle ORMのスキーマ定義とSupabaseの実際のDBスキーマが一致しているか
各テーブルおよびカラムの命名規則がプロジェクトのルールに従っているか
各カラムの型および制約（NOT NULL、DEFAULT値、外部キーなど）が適切に設定されているか
インデックスやユニーク制約が必要に応じて設定されているか
各テーブルおよびカラムに対するコメントが適切に記述されているか
不要なスキーマや冗長な定義がないか



変更箇所ごとに潜在的なバグ、仕様逸脱、動作退行、パフォーマンス劣化、セキュリティ・可用性への影響を優先度順に指摘してください（例: 致命的 > 重大 > 注意 > 軽微）。
各指摘は、影響範囲・再現手順・期待される挙動・修正の方向性を簡潔にまとめ、該当ファイルと行番号を必ず明示してください。
想定と違う動作が懸念される箇所は、理由や前提（例: 入力値、非同期処理、例外処理）を添えて質問または確認事項として列挙してください。
重大な変更にテストが追加されていない場合は、欠落テストの種類や想定ケースを指摘し、必要に応じて具体例を示してください。
問題が見つからなかった場合でも、その旨と残るリスクや追加検証が望ましい箇所を記録してください。

