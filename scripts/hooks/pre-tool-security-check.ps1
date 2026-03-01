#!/usr/bin/env pwsh
<#
.SYNOPSIS
  ツール実行前のセキュリティ・品質チェック

.DESCRIPTION
  エージェントがツール（bash、edit、create等）を実行する前に、
  セキュリティ・品質ポリシー違反をチェックし、必要に応じてブロックします。

  ブロック対象：
  - 危険なコマンド（rm -rf /, DROP TABLE等）
  - 本番環境への直接操作（NODE_ENV=production 時）
  - API キー・シークレット露出の危険

  許可対象：
  - テスト実行（pnpm test, npm test）
  - ビルド・デプロイ（ステージング）
  - ドキュメント作成

.NOTES
  入力: JSON (preToolUse フックから受け取る)
  出力: JSON (permissionDecision: "allow"|"deny")
#>

param()

# 入力JSONの読み取り
$inputJson = [Console]::In.ReadToEnd() | ConvertFrom-Json
$timestamp = $inputJson.timestamp
$toolName = $inputJson.toolName
$toolArgs = $inputJson.toolArgs | ConvertFrom-Json

# ログディレクトリ作成
$logDir = Join-Path $PSScriptRoot "../../logs"
if (!(Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir | Out-Null }

$logFile = Join-Path $logDir "pre-tool-security.log"

# ログと結果出力関数
function Write-Log {
  param([string]$Message, [string]$Level = "INFO")
  $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  $logEntry = "[$ts] [$Level] $Message"
  Add-Content -Path $logFile -Value $logEntry
  Write-Host $logEntry -ForegroundColor $(if ($Level -eq "WARN") { "Yellow" } elseif ($Level -eq "ERROR") { "Red" } else { "Green" })
}

function Deny-Tool {
  param([string]$Reason)
  Write-Log "❌ ツール実行を拒否: $Reason" "WARN"
  $output = @{
    permissionDecision = "deny"
    permissionDecisionReason = $Reason
  } | ConvertTo-Json -Compress
  Write-Host $output
  exit 0
}

function Allow-Tool {
  Write-Log "✅ ツール実行を許可: $toolName" "INFO"
  exit 0
}

Write-Log "チェック開始: ツール=$toolName" "INFO"

# 危険なコマンドパターン定義
$dangerousPatterns = @(
  "rm -rf /",
  "rm -rf C:",
  "rm -r \`?\`?/",
  "DROP TABLE",
  "DELETE FROM.*\*",
  "TRUNCATE TABLE",
  "sudo.*rm",
  "mkfs",
  "dd if=/dev/zero"
)

# API キー・シークレット パターン
$secretPatterns = @(
  "NEXT_PUBLIC_.*=.*[a-zA-Z0-9_]{32,}",
  "DATABASE_URL.*=.*@",
  "API_KEY.*=",
  "PRIVATE_KEY.*=",
  "SECRET.*="
)

# Bash コマンドチェック
if ($toolName -eq "bash") {
  $command = $toolArgs.command
  Write-Log "Bash コマンド: '$command'" "INFO"

  # 危険なコマンド検出
  foreach ($pattern in $dangerousPatterns) {
    if ($command -match $pattern) {
      Deny-Tool "危険なコマンドが検出されました: '$pattern'"
    }
  }

  # シークレット露出検出
  foreach ($pattern in $secretPatterns) {
    if ($command -match $pattern) {
      Deny-Tool "シークレット情報の露出リスク: '$pattern'"
    }
  }

  # 本番環境操作の制限
  if ($command -match "NODE_ENV.*production" -and ($command -match "db:" -or $command -match "migrate")) {
    Deny-Tool "本番環境への直接操作は禁止されています。ステージング環境で検証してください。"
  }
}

# Edit チェック
if ($toolName -eq "edit") {
  $filePath = $toolArgs.path
  Write-Log "ファイル編集: '$filePath'" "INFO"

  # 保護対象ファイルのチェック
  $protectedPatterns = @(
    "^\.env\.production",
    "^\.env\.local$",
    "^src/auth.ts$",
    "^drizzle.config.ts$"
  )

  foreach ($pattern in $protectedPatterns) {
    if ($filePath -match $pattern) {
      Write-Log "⚠️ 保護されたファイルへの編集: $filePath（レビューが必要です）" "WARN"
      # 注: ここでは拒否せずログのみ（設定によっては拒否に変更可）
    }
  }
}

# Create チェック
if ($toolName -eq "create") {
  $filePath = $toolArgs.path
  $content = $toolArgs.content
  Write-Log "ファイル作成: '$filePath'" "INFO"

  # シークレット露出検出
  foreach ($pattern in $secretPatterns) {
    if ($content -match $pattern) {
      Deny-Tool "作成するファイルにシークレット情報が含まれています: '$pattern'"
    }
  }
}

# テスト・ビルド関連は基本的に許可
if ($command -match "pnpm test|npm test|pnpm build|npm build") {
  Allow-Tool
}

# デフォルト: 許可
Write-Log "セキュリティチェック完了 - ツール実行を許可します" "INFO"
exit 0
