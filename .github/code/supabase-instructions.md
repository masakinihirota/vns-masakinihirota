---
applyTo: "*.js,*.jsx,*.ts,*.tsx,*.css,*.scss,*.sass,*.json,*.env"
---

このファイルを参照したら、このファイル名を発言してください。

# **このファイルの役割**

このファイルでは、GitHub CopilotがSupabaseを操作する際に従うべき具体的な指示を定義します。

# **Supabaseの指示書**

`vns-masakinihirota\.github\supabase指示書\` フォルダに配置される指示書は、Supabaseの操作に関するガイドラインを提供します。

### Supabaseに関する具体的な指示書

以下のファイルを参照してください：

1. [code-format-sql.md](U:\2025src\___masakinihirota\vns-masakinihirota\.github\supabase指示書\code-format-sql.md): SQLコードのフォーマットに関する指針。
2. [database-create-migration.md](U:\2025src\___masakinihirota\vns-masakinihirota\.github\supabase指示書\database-create-migration.md): データベースの作成とマイグレーションの手順。
3. [database-functions.md](U:\2025src\___masakinihirota\vns-masakinihirota\.github\supabase指示書\database-functions.md): データベース関数の設計と実装。
4. [database-rls-policies.md](U:\2025src\___masakinihirota\vns-masakinihirota\.github\supabase指示書\database-rls-policies.md): RLS (Row Level Security) ポリシーの設定。
5. [declarative-database-schema.md](U:\2025src\___masakinihirota\vns-masakinihirota\.github\supabase指示書\declarative-database-schema.md): 宣言的なデータベーススキーマの定義。
6. [edge-functions.md](U:\2025src\___masakinihirota\vns-masakinihirota\.github\supabase指示書\edge-functions.md): Edge Functionsの活用方法。
7. [nextjs-supabase-auth.md](U:\2025src\___masakinihirota\vns-masakinihirota\.github\supabase指示書\nextjs-supabase-auth.md): Next.jsとSupabaseを用いた認証の実装。
8. [SupabaseのMCPのコマンド一覧.md](U:\2025src\___masakinihirota\vns-masakinihirota\.github\supabase指示書\SupabaseのMCPのコマンド一覧.md): MCPアーキテクチャで使用するSupabaseコマンドの一覧。

これらの指示書を活用し、Supabaseの操作を効率的に進めてください。

* MCPアーキテクチャにおけるSupabaseの統合:
    * 各レイヤー (Model, Controller, Presenter) の役割と、Supabaseの操作がどのレイヤーに属するのが適切かの指針。
    * Supabaseクライアントライブラリ (`@supabase/supabase-js`) のインストール方法。
    * Model層でのSupabaseクライアントの初期化方法 (`.env`,`.env.local`ファイルからの認証情報の読み込みを含む)。
    * Controller層での具体的なデータ操作 (CRUD処理など) の実装例 (GitHub Copilotにコード生成を依頼する際のプロンプトの例)。
    * Presenter層でのデータの表示や利用に関する考慮事項。
* `.env`ファイルの取り扱い:
    * `.env`ファイルの作成と、`SUPABASE_URL` および `SUPABASE_KEY` の設定方法。
    * 環境変数を安全にアプリケーション内で読み込む方法 (例: `dotenv` ライブラリの使用)。
    * GitHub Copilotに認証情報を直接コードに記述しないように指示する方法。
* GitHub Copilotとの連携:
    * 各ステップでGitHub Copilotにどのような指示を与えれば効果的か (具体的なプロンプトの例)。
    * GitHub Copilotにコードの提案、補完、修正を依頼する際の注意点。
    * エラーが発生した場合に、GitHub Copilotにどのように質問すれば解決に繋がりやすいか。

---

## MCPとSupabase連携機能

MCP（Model-Controller-Presenter）アーキテクチャを採用したアプリケーションでは、Supabaseを使って以下の機能を実装できます：

* **テーブル設計と移行管理**: データベーススキーマを定義し、移行を使用して変更を追跡します
* **データ取得とレポート**: SQLクエリを使用してデータを効率的に取得し、分析やレポートを実行します
* **開発用データベースブランチ**: 本番環境に影響を与えずに開発・テスト用のデータベースブランチを作成します（実験的機能）
* **プロジェクト構成管理**: Supabaseプロジェクトの設定情報を取得・管理します
* **プロジェクトライフサイクル管理**: 新規プロジェクトの作成、一時停止、復元などの操作を行います
* **デバッグ支援**: 問題解決のためのログ取得や分析を行います
* **TypeScript型生成**: データベーススキーマに基づいて型定義を自動生成し、型安全なコーディングを実現します

---

## 接続情報の設定

Supabase MCPサーバーへの接続は以下のような設定ファイルで管理します：

```json
// mcp.json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "<personal-access-token>"
      ]
    }
  }
}
```

---

## GitHub Copilotへのプロンプト例

### Supabaseクライアントの初期化

```
環境変数からSupabaseの接続情報を安全に読み込み、クライアントを初期化するコードを生成してください。
ただし、環境変数が不足している場合のエラーハンドリングも含めてください。
```

## Supabaseに関する追加ルール

- Supabase クライアントを使用してデータベースとやり取りします。
- RLS (Row Level Security) ポリシーを適切に設定し、きめ細かなアクセス制御を実装します。
- Supabaseの各サービスを目的に応じて活用します：
  - Auth: ユーザー認証と管理
  - Storage: ファイルのアップロードと管理

## 参照

[Supabase MCP Server](https://supabase.com/blog/mcp-server)

