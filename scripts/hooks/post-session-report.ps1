#!/usr/bin/env pwsh
<#
.SYNOPSIS
  セッション終了レポート生成

.DESCRIPTION
  エージェントセッション終了時に、セッション統計とレポートを生成します。
  実行したツール数、成功/失敗数、実行時間などを集計。

.NOTES
  入力: JSON (sessionEnd フックから受け取る)
  出力: なし（レポート生成のみ）
#>

param()

# 入力JSONの読み取り
$inputJson = [Console]::In.ReadToEnd() | ConvertFrom-Json
$timestamp = $inputJson.timestamp
$reason = $inputJson.reason

# ログディレクトリ
$logDir = Join-Path $PSScriptRoot "../../logs"
$reportDir = Join-Path $logDir "reports"
if (!(Test-Path $reportDir)) { New-Item -ItemType Directory -Path $reportDir | Out-Null }

# 統計ファイルパス
$auditLog = Join-Path $logDir "audit.jsonl"
$resultLog = Join-Path $logDir "tool-results.jsonl"
$promptLog = Join-Path $logDir "prompts.jsonl"

Write-Host "=== セッション終了レポート生成 ===" -ForegroundColor Cyan

# 統計の集計
$toolUseCount = 0
$successCount = 0
$failureCount = 0
$deniedCount = 0

if (Test-Path $resultLog) {
  $results = Get-Content $resultLog | ForEach-Object { $_ | ConvertFrom-Json }
  $toolUseCount = @($results).Count
  $successCount = @($results | Where-Object { $_.resultType -eq "success" }).Count
  $failureCount = @($results | Where-Object { $_.resultType -eq "failure" }).Count
  $deniedCount = @($results | Where-Object { $_.resultType -eq "denied" }).Count
}

# レポートファイル生成
$reportFile = Join-Path $reportDir "session_$(Get-Date -Format 'yyyyMMdd_HHmmss').md"

$report = @"
# セッション終了レポート

**終了理由**: $reason
**生成日時**: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
**タイムスタンプ**: $timestamp

## セッション統計

| 項目 | 数 |
|------|-----|
| ツール使用総数 | $toolUseCount |
| 成功 | $successCount |
| 失敗 | $failureCount |
| ブロック | $deniedCount |

## 次のステップ

$(
if ($failureCount -gt 0) {
  "- ⚠️ $failureCount 件のエラーが発生しました。詳細は `logs/tool-results.jsonl` を確認してください。"
} else {
  "- ✅ すべてのツール実行が成功しました。"
}
)

$(
if ($deniedCount -gt 0) {
  "- 🔒 $deniedCount 件のツール実行がセキュリティルールによってブロックされました。`logs/pre-tool-security.log` を確認してください。"
}
)

## ログファイル

- 監査ログ: `logs/audit.jsonl`
- ツール結果: `logs/tool-results.jsonl`
- プロンプト: `logs/prompts.jsonl`
- セッションスタート: `logs/session-start.log`
- セキュリティチェック: `logs/pre-tool-security.log`

---

*このレポートは GitHub Copilot エージェントフックによって自動生成されました。*
"@

$report | Set-Content -Path $reportFile

Write-Host "✅ レポートを生成: $reportFile" -ForegroundColor Green
Write-Host "📊 統計:"
Write-Host "  ツール使用: $toolUseCount"
Write-Host "  成功: $successCount / 失敗: $failureCount / ブロック: $deniedCount" -ForegroundColor Cyan
