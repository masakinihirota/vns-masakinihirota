#!/usr/bin/env pwsh
<#
.SYNOPSIS
  ツール実行後の結果ログ記録

.DESCRIPTION
  エージェントがツール実行を完了した後、その結果を記録します。
  成功/失敗/ブロックされたアクション、実行時間などをログに記録。

.NOTES
  入力: JSON (postToolUse フックから受け取る)
  出力: なし（ログ記録のみ）
#>

param()

# 入力JSONの読み取り
$inputJson = [Console]::In.ReadToEnd() | ConvertFrom-Json
$timestamp = $inputJson.timestamp
$toolName = $inputJson.toolName
$toolResult = $inputJson.toolResult

# ログディレクトリ作成
$logDir = Join-Path $PSScriptRoot "../../logs"
if (!(Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir | Out-Null }

# JSON Lines 形式で結果ログを記録
$resultLogFile = Join-Path $logDir "tool-results.jsonl"

$resultEntry = @{
  timestamp = $timestamp
  event = "tool_result"
  toolName = $toolName
  resultType = $toolResult.resultType
  textResultForLlm = $toolResult.textResultForLlm
  datetime = Get-Date -Format "o"
} | ConvertTo-Json -Compress

Add-Content -Path $resultLogFile -Value $resultEntry

# 失敗時はアラート
if ($toolResult.resultType -eq "failure") {
  Write-Host "⚠️ ツール実行エラー: $toolName - $($toolResult.textResultForLlm)" -ForegroundColor Yellow
}

Write-Host "✅ ツール結果を記録: $toolName ($($toolResult.resultType))" -ForegroundColor Green
