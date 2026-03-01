#!/usr/bin/env pwsh
<#
.SYNOPSIS
  セッション開始時プロジェクト状態検証スクリプト

.DESCRIPTION
  エージェントセッション開始時に、プロジェクト状態を検証します。
  以下の項目をチェック：
  - Next.js 16対応（proxy.tsの存在、middleware.tsの非存在）
  - Better Auth スキーマ命名規則一貫性
  - 環境変数の必須項目
  - プロジェクト構造の整合性

.NOTES
  入力: JSON (sessionStart フックから受け取る)
  出力: なし（ログ記録のみ）
#>

param()

# 入力JSONの読み取り
$inputJson = [Console]::In.ReadToEnd() | ConvertFrom-Json
$timestamp = $inputJson.timestamp
$cwd = $inputJson.cwd
$source = $inputJson.source

# ログディレクトリ作成
$logDir = Join-Path $PSScriptRoot "../../logs"
if (!(Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir | Out-Null }

$logFile = Join-Path $logDir "session-start.log"

# ログ関数
function Write-Log {
  param([string]$Message, [string]$Level = "INFO")
  $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  $logEntry = "[$timestamp] [$Level] $Message"
  Add-Content -Path $logFile -Value $logEntry
  Write-Host $logEntry
}

Write-Log "=== セッション開始 (Source: $source) ===" "INFO"

# 1. Next.js 16対応チェック
Write-Log "チェック: Next.js 16対応..." "INFO"

$proxyExists = Test-Path (Join-Path $cwd "src/proxy.ts")
$middlewareExists = Test-Path (Join-Path $cwd "src/middleware.ts")
$middlewareRootExists = Test-Path (Join-Path $cwd "middleware.ts")

if ($proxyExists) {
  Write-Log "✅ proxy.ts が見つかりました（Next.js 16対応正）" "INFO"
} else {
  Write-Log "⚠️ proxy.ts が見つかりません（Next.js 16標準ファイルが必要）" "WARN"
}

if ($middlewareExists -or $middlewareRootExists) {
  Write-Log "⚠️ middleware.ts が見つかりました（Next.js 16では非推奨）" "WARN"
}

# 2. Better Auth スキーマ命名規則チェック
Write-Log "チェック: Better Auth スキーマ命名規則..." "INFO"

$authConfigPath = Join-Path $cwd "src/auth.ts"
if (Test-Path $authConfigPath) {
  $authContent = Get-Content $authConfigPath -Raw
  $hasCamelCase = $authContent -match 'userId|isEmail|createdAt'
  $hasSnakeCase = $authContent -match 'user_id|is_email|created_at'

  if ($hasCamelCase -and $hasSnakeCase) {
    Write-Log "⚠️ camelCase と snake_case が混在しています（OAuth エラーの原因になる可能性あり）" "WARN"
  } else {
    Write-Log "✅ スキーマ命名規則が統一されています" "INFO"
  }
} else {
  Write-Log "⚠️ src/auth.ts が見つかりません" "WARN"
}

# 3. 環境変数の確認
Write-Log "チェック: 環境変数..." "INFO"

$envFile = Join-Path $cwd ".env.local"
$envExampleFile = Join-Path $cwd ".env.example"

if (Test-Path $envFile) {
  Write-Log "✅ .env.local が存在します" "INFO"
} else {
  Write-Log "⚠️ .env.local が見つかりません（ローカル実行が失敗する可能性あり）" "WARN"
}

# 4. パッケージマネージャーの確認
Write-Log "チェック: パッケージマネージャー..." "INFO"

$pnpmLockExists = Test-Path (Join-Path $cwd "pnpm-lock.yaml")
if ($pnpmLockExists) {
  Write-Log "✅ pnpm が使用されています" "INFO"
} else {
  Write-Log "⚠️ pnpm-lock.yaml が見つかりません（npm/yarn の使用？）" "WARN"
}

# 5. ESLint セットアップの確認
Write-Log "チェック: ESLint セットアップ..." "INFO"

$eslintConfig = Test-Path (Join-Path $cwd "eslint.config.mjs")
if ($eslintConfig) {
  Write-Log "✅ ESLint が設定されています" "INFO"
} else {
  Write-Log "⚠️ ESLint 設定ファイルが見つかりません" "WARN"
}

Write-Log "=== セッション開始チェック完了 ===" "INFO"
Write-Log "詳細なログ: $logFile" "INFO"
