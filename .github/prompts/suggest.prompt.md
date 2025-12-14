---
description: agents.mdに追記すべき新しいルールやパターンの提案を行うためのプロンプト。
agent: agent
tools:
  [
    "edit",
    "runNotebooks",
    "search",
    "new",
    "runCommands",
    "runTasks",
    "chrome-devtools/*",
    "context7/*",
    "next-devtools/*",
    "Postgres(LOCAL-supabase)/*",
    "sequentialthinking/*",
    "serena/*",
    "supabase/deploy_edge_function",
    "supabase/execute_sql",
    "supabase/generate_typescript_types",
    "supabase/get_edge_function",
    "supabase/list_tables",
    "supabase/search_docs",
    "unsplash/*",
    "usages",
    "vscodeAPI",
    "problems",
    "changes",
    "testFailure",
    "openSimpleBrowser",
    "fetch",
    "githubRepo",
    "extensions",
    "todos",
    "runSubagent",
    "runTests",
  ]
model: Grok Code Fast 1 (copilot)
---

<user>
**あなたの役割**: 会話履歴を分析し、agents.mdに追記すべき新しいルールやパターンを提案すること。

**重要**: 会話の要約や説明ではなく、「agents.mdに追記する内容の提案」を出力してください。
</user>
