#!/usr/bin/env pwsh
<#
.SYNOPSIS
  ユーザープロンプト監査ログ

.DESCRIPTION
  エージェントに送信されたプロンプト内容を監査ログとして記録します。
  プロンプトのキーワード分析や危険な操作の事前検出に活用可能。

.NOTES
  入力: JSON (userPromptSubmitted フックから受け取る)
  出力: なし（ログ記録のみ）
#>

param()

# 入力JSONの読み取り
$inputJson = [Console]::In.ReadToEnd() | ConvertFrom-Json
$timestamp = $inputJson.timestamp
$prompt = $inputJson.prompt
$cwd = $inputJson.cwd

# ログディレクトリ作成
$logDir = Join-Path $PSScriptRoot "../../logs"
if (!(Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir | Out-Null }

# JSON Lines 形式でプロンプトをログ
$promptLogFile = Join-Path $logDir "prompts.jsonl"

# キーワード分類
$keywords = @()
if ($prompt -match "test|TDD|テスト") { $keywords += "testing" }
if ($prompt -match "auth|認証|パスワード") { $keywords += "authentication" }
if ($prompt -match "database|db|schema|スキーマ") { $keywords += "database" }
if ($prompt -match "security|セキュリティ|暗号|crypto") { $keywords += "security" }
if ($prompt -match "performance|最適化|optimize") { $keywords += "performance" }
if ($prompt -match "bug|fix|修正") { $keywords += "bugfix" }
if ($prompt -match "feature|機能|新") { $keywords += "feature" }
if ($prompt -match "refactor|リファクタ|clean|改善") { $keywords += "refactor" }

# 危険なキーワード検出
$dangerousKeywords = @()
if ($prompt -match "delete|削除|DROP|TRUNCATE") { $dangerousKeywords += "destructive_operation" }
if ($prompt -match "production|本番|deploy|デプロイ") { $dangerousKeywords += "production_operation" }
if ($prompt -match "password|パスワード|secret|シークレット|token|トークン") { $dangerousKeywords += "credentials_mentioned" }
if ($prompt -match "all users?|全ユーザー|batch|一括") { $dangerousKeywords += "bulk_operation" }

$promptEntry = @{
  timestamp = $timestamp
  event = "user_prompt"
  prompt = $prompt.Substring(0, [Math]::Min(500, $prompt.Length))  # 最初の500文字のみ
  keywords = $keywords
  dangerousKeywords = $dangerousKeywords
  cwd = $cwd
  datetime = Get-Date -Format "o"
} | ConvertTo-Json -Compress -Depth 2

Add-Content -Path $promptLogFile -Value $promptEntry

if ($dangerousKeywords.Count -gt 0) {
  Write-Host "⚠️ 危険なキーワードを検出: $($dangerousKeywords -join ', ')" -ForegroundColor Yellow
}

Write-Host "📋 プロンプトをログに記録 ($($keywords -join ', '))" -ForegroundColor Cyan
