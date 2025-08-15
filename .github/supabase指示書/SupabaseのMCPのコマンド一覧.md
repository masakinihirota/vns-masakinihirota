supabase-community/supabase-mcp: SupabaseをAIアシスタントに接続します
https://github.com/supabase-community/supabase-mcp#tools

## プロジェクト管理

**注意:** サーバーのスコープがプロジェクトに設定されている場合、これらのツールは使用できません。

* `list_projects`: ユーザーのすべての Supabase プロジェクトを一覧表示します。
* `get_project`: プロジェクトの詳細を取得します。
* `create_project`: 新しい Supabase プロジェクトを作成します。
* `pause_project`: プロジェクトを一時停止します。
* `restore_project`: プロジェクトを復元します。
* `list_organizations`: ユーザーが所属するすべての組織を一覧表示します。
* `get_organization`: 組織の詳細を取得します。

## データベース操作

* `list_tables`: 指定されたスキーマ内のすべてのテーブルを一覧表示します。
* `list_extensions`: データベース内のすべての拡張機能を一覧表示します。
* `list_migrations`: データベース内のすべての移行を一覧表示します。
* `apply_migration`: データベースにSQLマイグレーションを適用します。このツールに渡されたSQLはデータベース内で追跡されるため、LLMはDDL操作（スキーマ変更）にこれを使用する必要があります。
* `execute_sql`: データベース内で生のSQLを実行します。LLMは、スキーマを変更しない通常のクエリにこれを使用する必要があります。
* `get_logs`: Supabaseプロジェクトのログをサービスタイプ（Postgres、エッジ関数、認証、ストレージ、リアルタイム）別に取得します。LLMはこれを使用して、サービスパフォーマンスのデバッグと監視に役立てることができます。

## エッジ機能管理

* `list_edge_functions`: Supabase プロジェクト内のすべての Edge 関数を一覧表示します。
* `deploy_edge_function`: Supabase プロジェクトに新しい Edge Function をデプロイします。LLM はこれを使用して、新しい関数をデプロイしたり、既存の関数を更新したりできます。

## プロジェクト構成

* `get_project_url`: プロジェクトの API URL を取得します。
* `get_anon_key`: プロジェクトの匿名 API キーを取得します。

## ブランチング（実験的、有料プランが必要）

* `create_branch`: 本番ブランチからの移行を含む開発ブランチを作成します。
* `list_branches`: すべての開発ブランチを一覧表示します。
* `delete_branch`: 開発ブランチを削除します。
* `merge_branch`: 開発ブランチから本番環境への移行とエッジ機能をマージします。
* `reset_branch`: 開発ブランチの移行を以前のバージョンにリセットします。
* `rebase_branch`: 移行のドリフトを処理するために開発ブランチを本番環境にリベースします。

## 開発ツール

* `generate_typescript_types`: データベーススキーマに基づいて TypeScript 型を生成します。LLM はこれをファイルに保存し、コード内で使用できます。

## 費用確認

* `get_cost`: 組織の新しいプロジェクトまたはブランチのコストを取得します。
* `confirm_cost`: ユーザーが新しいプロジェクトまたはブランチのコストを理解していることを確認します。これは、新しいプロジェクトまたはブランチを作成するために必要です。









