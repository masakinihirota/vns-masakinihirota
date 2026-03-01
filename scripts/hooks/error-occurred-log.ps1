#!/usr/bin/env pwsh
<#
.SYNOPSIS
  エラーイベントログ記録

.DESCRIPTION
  エージェント実行中にエラーが発生した際、その詳細を記録します。

.NOTES
  入力: JSON (errorOccurred フックから受け取る)
  出力: なし（ログ記録のみ）
#>

param()

# 入力JSONの読み取り
$inputJson = [Console]::In.ReadToEnd() | ConvertFrom-Json
$timestamp = $inputJson.timestamp
$error = $inputJson.error
$cwd = $inputJson.cwd

# ログディレクトリ作成
$logDir = Join-Path $PSScriptRoot "../../logs"
if (!(Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir | Out-Null }

# JSON Lines 形式でエラーをログ
$errorLogFile = Join-Path $logDir "errors.jsonl"

$errorEntry = @{
  timestamp = $timestamp
  event = "error_occurred"
  errorName = $error.name
  errorMessage = $error.message
  errorStack = if ($error.stack) { $error.stack.Substring(0, [Math]::Min(500, $error.stack.Length)) } else { $null }
  cwd = $cwd
  datetime = Get-Date -Format "o"
} | ConvertTo-Json -Compress -Depth 2

Add-Content -Path $errorLogFile -Value $errorEntry

Write-Host "❌ エラーが記録されました: $($error.name)" -ForegroundColor Red
Write-Host "   $($error.message)" -ForegroundColor Yellow
