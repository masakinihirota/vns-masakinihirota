#!/usr/bin/env pwsh
<#
.SYNOPSIS
  ツール実行の監査ログ記録

.DESCRIPTION
  エージェントのすべてのツール使用を JSON Lines 形式で記録します。
  本スクリプトは preToolUse で実行されます。

.NOTES
  入力: JSON (preToolUse フックから受け取る)
  出力: なし（ログ記録のみ）
#>

param()

# 入力JSONの読み取り
$inputJson = [Console]::In.ReadToEnd() | ConvertFrom-Json
$timestamp = $inputJson.timestamp
$cwd = $inputJson.cwd
$toolName = $inputJson.toolName
$toolArgs = $inputJson.toolArgs

# ログディレクトリ作成
$logDir = Join-Path $PSScriptRoot "../../logs"
if (!(Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir | Out-Null }

# JSON Lines 形式で監査ログを記録
$auditLogFile = Join-Path $logDir "audit.jsonl"

$auditEntry = @{
  timestamp = $timestamp
  event = "tool_use"
  toolName = $toolName
  toolArgs = $toolArgs
  cwd = $cwd
  datetime = Get-Date -Format "o"  # ISO 8601形式
} | ConvertTo-Json -Compress

Add-Content -Path $auditLogFile -Value $auditEntry

Write-Host "監査ログ記録: $toolName" -ForegroundColor Gray
