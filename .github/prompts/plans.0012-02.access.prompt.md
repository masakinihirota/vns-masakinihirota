---
description: "plans.mdの実装を依頼するプロンプト"
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
---

実装前に[plans.md](./plans.md) を読んで把握してください。

## 実装

### アクセス制御システムの実装

以下のドキュメントを参考にライブラリの統合方法を調査し、詳細な実行計画を作成してください。

`0012-02-アクセス権限設計書.md`

この設計書を読んで[plans.md](./plans.md)に書いてください。
[plans.md](./plans.md) でまだチェックされてないProgressから開発をしてください。
[plans.md](./plans.md) に基づいて実装してください。
「次のステップ」を絶対にユーザーに聞かないでください。
わからないところはtoolsを使い自分で調査するようにしてください。
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
