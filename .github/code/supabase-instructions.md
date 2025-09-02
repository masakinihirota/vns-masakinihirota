---
applyTo: "*.js,*.jsx,*.ts,*.tsx,*.css,*.scss,*.sass,*.json,*.env"
---

このファイルを参照したら、このファイル名を発言してください。

# **このファイルの役割**

このファイルでは、GitHub CopilotがSupabaseを操作する際に従うべき具体的な指示を定義します。

# **Supabaseの指示書**

`vns-masakinihirota\.github\supabase\` フォルダに配置される指示書は、Supabaseの操作に関するガイドラインを提供します。



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

