# GitHub Copilot フック実装ガイド

このディレクトリには、GitHub Copilot エージェント用の フック設定ファイルと実行スクリプトが含まれています。

## 📋 概要

フック（hooks）を使用することで、GitHub Copilot エージェントのセッション開始・終了、ツール実行の前後など、ワークフロー内の重要なポイントでカスタム検証やロギングを自動実行できます。

### フック設定ファイル

- **[vns-copilot-main.json](./vns-copilot-main.json)**
  - メインのフック設定ファイル
  - すべてのフック定義を包含
  - GitHub Copilot が自動的に読み込みます

### 実装済みのフック

| フック種別 | スクリプト | 実行タイミング | 機能 |
|-----------|-----------|------------|------|
| **sessionStart** | `pre-session-check.ps1` | セッション開始時 | プロジェクト状態検証 |
| **preToolUse** | `pre-tool-security-check.ps1` | ツール実行前 | セキュリティ・品質チェック |
| | `pre-tool-audit-log.ps1` | ツール実行前 | ツール使用監査ログ |
| **postToolUse** | `post-tool-result-log.ps1` | ツール実行後 | 実行結果ログ |
| **userPromptSubmitted** | `log-user-prompt.ps1` | プロンプト送信後 | プロンプト監査ログ |
| **sessionEnd** | `post-session-report.ps1` | セッション終了時 | セッションレポート生成 |
| **errorOccurred** | `error-occurred-log.ps1` | エラー発生時 | エラーログ記録 |

---

## 🚀 セットアップ手順

### 1. ファイルの確認

フック設定ファイルとスクリプトが以下の場所に配置されていることを確認します：

```
.github/hooks/
└── vns-copilot-main.json

scripts/hooks/
├── pre-session-check.ps1
├── pre-tool-security-check.ps1
├── pre-tool-audit-log.ps1
├── post-tool-result-log.ps1
├── log-user-prompt.ps1
├── post-session-report.ps1
└── error-occurred-log.ps1
```

### 2. PowerShell スクリプト実行権限の設定

Windows PowerShell でスクリプト実行を許可します：

```powershell
# 現在のユーザー向けのポリシー設定（推奨）
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# または、特定のスクリプトのみを許可
Unblock-File -Path scripts/hooks/*.ps1
```

### 3. ログディレクトリの作成（初回）

スクリプトが自動的に作成しますが、手動で作成することもできます：

```powershell
New-Item -ItemType Directory -Path logs -Force
New-Item -ItemType Directory -Path logs/reports -Force
```

### 4. GitHub にコミット

フック設定ファイルとスクリプトを Git に追加してコミットします：

```bash
git add .github/hooks/vns-copilot-main.json scripts/hooks/*.ps1
git commit -m "feat: GitHub Copilot hooks 設定の初期化"
git push origin main
```

> **重要**: フック設定ファイルは、GitHub のデフォルトブランチに存在する必要があります。

---

## 📝 スクリプト詳細

### 1. pre-session-check.ps1 - セッション開始時の検証

**実行タイミング**: エージェントセッション開始時
**出力**: `logs/session-start.log`

**チェック項目**:
- ✅ Next.js 16 対応（proxy.ts の存在確認）
- ✅ Better Auth スキーマ命名規則（camelCase/snake_case 混在検出）
- ✅ 環境変数の必須項目
- ✅ プロジェクト構造の整合性

**ログ例**:
```
[2026-03-01 10:15:22] [INFO] === セッション開始 (Source: new) ===
[2026-03-01 10:15:22] [INFO] チェック: Next.js 16対応...
[2026-03-01 10:15:22] [INFO] ✅ proxy.ts が見つかりました（Next.js 16対応正）
```

---

### 2. pre-tool-security-check.ps1 - セキュリティ・品質チェック

**実行タイミング**: ツール実行前（bash, edit, create など）
**出力**: `logs/pre-tool-security.log`
**判定**: 許可 / **拒否** (ブロック対象の場合)

**ブロック対象**:
- ❌ 危険なコマンド: `rm -rf /`, `DROP TABLE`, `DELETE FROM *` など
- ❌ 本番環境への直接操作（`NODE_ENV=production` 時の DB 操作）
- ❌ シークレット情報の露出（API キー、パスワードなど）

**許可対象**:
- ✅ テスト実行（`pnpm test`, `npm test`）
- ✅ ビルド・デプロイ（ステージングのみ）
- ✅ ドキュメント作成

**ブロック例**:
```json
{
  "permissionDecision": "deny",
  "permissionDecisionReason": "危険なコマンドが検出されました: 'rm -rf /'"
}
```

---

### 3. pre-tool-audit-log.ps1 - ツール使用監査ログ

**実行タイミング**: ツール実行前
**出力**: `logs/audit.jsonl` (JSON Lines 形式)

**記録内容**:
- タイムスタンプ
- ツール名
- ツール引数
- 作業ディレクトリ

```json
{"timestamp":1704614600000,"event":"tool_use","toolName":"bash","toolArgs":"{\"command\":\"pnpm test\"}","cwd":".","datetime":"2026-03-01T10:15:22Z"}
```

---

### 4. post-tool-result-log.ps1 - ツール実行結果ログ

**実行タイミング**: ツール実行後
**出力**: `logs/tool-results.jsonl` (JSON Lines 形式)

**記録内容**:
- ツール実行結果（成功/失敗/ブロック）
- LLM 向けの結果テキスト
- 実行時刻

```json
{"timestamp":1704614700000,"event":"tool_result","toolName":"bash","resultType":"success","textResultForLlm":"All tests passed (15/15)","datetime":"2026-03-01T10:15:30Z"}
```

---

### 5. log-user-prompt.ps1 - プロンプト監査ログ

**実行タイミング**: ユーザープロンプト送信後
**出力**: `logs/prompts.jsonl` (JSON Lines 形式)

**機能**:
- プロンプト内容の記録（最初の500文字）
- キーワード自動分類（testing, authentication, database など）
- 危険なキーワード検出（delete, production, credentials など）

```json
{
  "timestamp":1704614500000,
  "event":"user_prompt",
  "prompt":"Create unit tests for the authentication module",
  "keywords":["testing","authentication"],
  "dangerousKeywords":[],
  "cwd":".",
  "datetime":"2026-03-01T10:15:10Z"
}
```

**検出キーワード**:
- **Testing**: test, TDD, テスト
- **Authentication**: auth, 認証, パスワード
- **Database**: database, db, schema, スキーマ
- **Security**: security, セキュリティ, crypto
- **Dangerous**: delete, 削除, DROP, production, 本番, credentials

---

### 6. post-session-report.ps1 - セッション終了レポート

**実行タイミング**: エージェントセッション終了時
**出力**: `logs/reports/session_yyyyMMdd_HHmmss.md` (Markdown 形式)

**レポート内容**:
- セッション統計（ツール使用数、成功/失敗数）
- エラーサマリー
- 次のステップ
- ログファイルへのリンク

**レポート例**:
```markdown
# セッション終了レポート

終了理由: complete
生成日時: 2026-03-01 10:30:45

## セッション統計

| 項目 | 数 |
|------|-----|
| ツール使用総数 | 12 |
| 成功 | 11 |
| 失敗 | 1 |
| ブロック | 0 |

## 次のステップ

- ⚠️ 1 件のエラーが発生しました。詳細は `logs/tool-results.jsonl` を確認してください。
```

---

### 7. error-occurred-log.ps1 - エラーログ記録

**実行タイミング**: エージェント実行中にエラー発生時
**出力**: `logs/errors.jsonl` (JSON Lines 形式)

**記録内容**:
- エラー名（例: TimeoutError, NetworkError）
- エラーメッセージ
- スタックトレース（最初の500文字）

```json
{
  "timestamp":1704614800000,
  "event":"error_occurred",
  "errorName":"TimeoutError",
  "errorMessage":"Network timeout",
  "errorStack":"TimeoutError: Network timeout...",
  "cwd":".",
  "datetime":"2026-03-01T10:15:40Z"
}
```

---

## 📊 ログファイルの構成

フック実行後、以下のログファイルが生成されます：

```
logs/
├── session-start.log              # セッション開始ログ（テキスト形式）
├── pre-tool-security.log          # セキュリティチェック結果（テキスト形式）
├── audit.jsonl                    # ツール使用監査ログ（JSON Lines）
├── tool-results.jsonl             # ツール実行結果（JSON Lines）
├── prompts.jsonl                  # プロンプトログ（JSON Lines）
├── errors.jsonl                   # エラーログ（JSON Lines）
└── reports/
    ├── session_20260301_101522.md
    ├── session_20260301_102030.md
    └── ...
```

### ログファイルの読み方

**JSON Lines 形式の確認**:
```powershell
# ファイルの内容を見やすく表示
Get-Content logs/audit.jsonl | ConvertFrom-Json | Format-Table -AutoSize

# 特定の条件で絞り込み
Get-Content logs/tool-results.jsonl |
  ConvertFrom-Json |
  Where-Object { $_.resultType -eq "failure" }
```

**Markdown レポートの確認**:
```powershell
# レポート一覧表示
Get-ChildItem logs/reports/*.md | Sort-Object LastWriteTime -Descending | Select-Object -First 5

# 最新レポートを開く
Invoke-Item (Get-ChildItem logs/reports/*.md | Sort-Object LastWriteTime -Descending | Select-Object -First 1).FullName
```

---

## 🔧 トラブルシューティング

### スクリプト実行エラー

**エラー**: `実行ポリシーのため、スクリプトを実行できません`

**解決策**:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### フックが実行されない

**確認項目**:
1. フック設定ファイルが `.github/hooks/` ディレクトリにあるか
2. ファイル名が `.json` 拡張子か
3. JSON 形式が有効か（`jq` で検証）
4. デフォルトブランチに存在するか（`git push` 確認）

**JSON 検証**:
```bash
# PowerShell で JSON 検証
Get-Content .github/hooks/vns-copilot-main.json | ConvertFrom-Json | Out-Null
# エラーが出なければ OK
```

### タイムアウト

**症状**: スクリプト実行時に 30 秒でタイムアウト

**解決策**: `vns-copilot-main.json` の `timeoutSec` を増やす

```json
{
  "type": "command",
  "powershell": "./scripts/hooks/script.ps1",
  "timeoutSec": 60  // 30 秒から 60 秒に変更
}
```

### ログが記録されない

**確認項目**:
1. `logs` ディレクトリの存在確認
2. ディレクトリへの書き込み権限確認
3. PowerShell スクリプト実行権限確認

```powershell
# ディレクトリ作成
New-Item -ItemType Directory -Path logs -Force

# 権限確認
Get-Acl logs | Format-List
```

---

## 💡 ベストプラクティス

### 1. ログの定期的なクリーンアップ

ログファイルが肥大化するため、定期的のクリーンアップを推奨：

```powershell
# 30日以上前のログを削除
Get-ChildItem logs/*.jsonl | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-30) } | Remove-Item

# 古いレポートを削除
Get-ChildItem logs/reports/*.md | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-90) } | Remove-Item
```

### 2. ファイルサイズ監視

JSON Lines ファイルは行ごとに追記されるため、定期的なサイズ監視を推奨：

```powershell
Get-ChildItem logs/*.jsonl | ForEach-Object {
  Write-Host "$($_.Name): $([math]::Round($_.Length / 1MB, 2)) MB"
}
```

### 3. 監査ログの分析

ツール使用パターンを分析することで、開発効率を向上可能：

```powershell
Get-Content logs/audit.jsonl |
  ConvertFrom-Json |
  Group-Object toolName |
  Select-Object Name, Count |
  Sort-Object Count -Descending
```

---

## 📚 関連ドキュメント

- [GitHub Copilot フック公式ドキュメント](../hooks.md)
- [フック調査レポート](../../schedule_todo_list/2026-03-01_HOOKS_INVESTIGATION_REPORT.md)
- [コーディング標準](.agent/rules/coding-standards.md)
- [セキュリティ・アーキテクチャ](.agent/rules/security-architecture.md)

---

## 🤝 フィードバック

フック設定やスクリプトの改善提案は、プロジェクト Issues や PR でお願いします。

---

**最終更新**: 2026年3月1日
