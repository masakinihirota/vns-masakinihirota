---
description: masakinihirotaアイデアメモ分割 個別アイデアの取り出し
tools: ['runCommands', 'runTasks', 'edit', 'new', 'search', 'chrome-devtools/*', 'Postgres(LOCAL-supabase)/*', 'supabase/apply_migration', 'supabase/confirm_cost', 'supabase/deploy_edge_function', 'supabase/execute_sql', 'supabase/generate_typescript_types', 'supabase/get_advisors', 'supabase/get_anon_key', 'supabase/get_edge_function', 'supabase/get_logs', 'supabase/list_migrations', 'supabase/list_tables', 'supabase/search_docs', 'unsplash/*', 'vscode/get_terminal_output', 'shadcn-ui/*', 'shadcn/*', 'serena/*', 'playwright/browser_navigate', 'playwright/browser_resize', 'playwright/browser_select_option', 'calil-library-mcp/*', 'sequentialthinking/*', 'context7/*', 'extensions', 'usages', 'vscodeAPI', 'think', 'problems', 'changes', 'testFailure', 'openSimpleBrowser', 'fetch', 'githubRepo', 'todos', 'runTests']
---

## ゴール
masakinihirotaのアイデアmemo.md に書かれた各アイデアを構造化し、`memo/アイデアのまとめ/*.md` へ書く個別ファイルごとに取り出します。

- 複数のファイル名が渡された場合は、各ファイル名ごとに個別に処理してください。
- 1つのファイルには、そのファイル名に関連するアイデアだけを独立してまとめてください。
- 他のファイル名に関連するアイデアや、全体的なまとめ・重複・不要情報は含めないでください。

### アイデアメモの解析
- masakinihirotaのアイデアmemo.md を読み込みます。
- 他のファイルからは読み込みません。
- 渡されたファイル名ごとに関連するアイデアを抽出します。

## 処理を全ファイルに対して最後まで行う
`memo\アイデアのまとめ`以下のすべてのファイルに対して行ってください。
フォルダ以下の全てのファイルに対して行ってください。

## 出力形式
- 出力先、渡された各ファイルに必ず保存してください。
- ファイルの内容はマークダウン形式で保存してください。
- 各ファイルは独立した内容とし、他ファイルの内容を混ぜないでください。

