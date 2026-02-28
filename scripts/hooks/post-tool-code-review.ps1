#!/usr/bin/env pwsh
<#
.SYNOPSIS
  コード品質自動レビュースクリプト（ツール実行後）

.DESCRIPTION
  エージェント がコードを edit/create した直後に、以下の品質メトリクスを自動チェック：

  1. TypeScript の型安全性（any 使用禁止、unknown 型チェック）
  2. ESLint ルール違反（コーディング標準）
  3. コード複雑度（サイクロマティック複雑度）
  4. セキュリティ問題（dangerouslySetInnerHTML, SQL インジェクション等）
  5. カバレッジ要件（テストが必要か判定）
  6. ファイルサイズ（500行以上なら分割推奨）
  7. ドキュメント不足（JSDoc、型定義）

  レビュー結果を JSON で出力し、postToolUse フックが記録します。

.NOTES
  入力: JSON (postToolUse フックから受け取る)
  出力: JSON (レビュー結果 → logs/code-reviews.jsonl に記録)
#>

param()

# 入力JSONの読み取り
$inputJson = [Console]::In.ReadToEnd() | ConvertFrom-Json
$timestamp = $inputJson.timestamp
$toolName = $inputJson.toolName
$toolResult = $inputJson.toolResult
$toolArgs = $inputJson.toolArgs | ConvertFrom-Json

# 失敗したツール実行はスキップ
if ($toolResult.resultType -ne "success") {
  exit 0
}

# ツールが create/edit でない場合はスキップ
if ($toolName -notmatch "^(create|edit)$") {
  exit 0
}

# ログディレクトリ作成
$logDir = Join-Path $PSScriptRoot "../../logs"
if (!(Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir | Out-Null }

$reviewLogFile = Join-Path $logDir "code-reviews.jsonl"

# ===========================
# レビュー実施ロジック
# ===========================

$filePath = $toolArgs.path
$fileContent = if ($toolArgs.content) { $toolArgs.content } else { "" }

Write-Host "📋 コード品質レビュー開始: $filePath" -ForegroundColor Cyan

# レビュー結果初期化
$reviewIssues = @()

# 1. TypeScript 型安全性チェック
if ($filePath -match "\.(ts|tsx)$") {
  Write-Host "  ✓ TypeScript ファイル - 型チェック実施中..." -ForegroundColor Gray

  # any 型の検出
  if ($fileContent -match ":\s*any\b" -and $fileContent -notmatch "// eslint-disable-next-line.*no-explicit-any") {
    $reviewIssues += @{
      severity = "error"
      category = "type-safety"
      issue = "`any` 型の使用を検出"
      description = "型安全性が低下します。`unknown` + 型ガード、または Zod バリデーションを使用してください。"
      lines = @()
    }
  }

  # unknown 型への型チェック確認
  if ($fileContent -match ":\s*unknown\b") {
    if ($fileContent -notmatch "typeof|Zod\.parse|instanceof") {
      $reviewIssues += @{
        severity = "warn"
        category = "type-safety"
        issue = "`unknown` 型に型チェックがない可能性"
        description = "型ガード（typeof）または Zod バリデーションを追加してください。"
        lines = @()
      }
    }
  }
}

# 2. セキュリティチェック
Write-Host "  ✓ セキュリティチェック中..." -ForegroundColor Gray

# dangerouslySetInnerHTML チェック
if ($fileContent -match "dangerouslySetInnerHTML") {
  $reviewIssues += @{
    severity = "error"
    category = "security"
    issue = "`dangerouslySetInnerHTML` の使用を検出"
    description = "XSS 脆弱性のリスク。可能な限り避け、必要な場合は DOMPurify で無害化してください。"
    lines = @()
  }
}

# SQL インジェクション（文字列結合）チェック
if ($fileContent -match '`SELECT.*\$\{|`INSERT.*\$\{|`UPDATE.*\$\{|`DELETE.*\$\{') {
  $reviewIssues += @{
    severity = "error"
    category = "security"
    issue = "SQL 文字列結合を検出"
    description = "SQL インジェクン脆弱性のリスク。Drizzle ORM や パラメータクエリを使用してください。"
    lines = @()
  }
}

# シークレット露出チェック
if ($fileContent -match 'NEXT_PUBLIC_.*=.*[a-zA-Z0-9_]{32,}|API_KEY.*=|SECRET.*=|DATABASE_URL.*=') {
  $reviewIssues += @{
    severity = "error"
    category = "security"
    issue = "シークレット情報がコードに含まれている可能性"
    description = "環境変数を使用してください（.env.local に記載）。本番環境にコミットしないこと。"
    lines = @()
  }
}

# 3. コード複雑度チェック
Write-Host "  ✓ 複雑度分析中..." -ForegroundColor Gray

# ネストの深さをカウント
$maxNestDepth = 0
$currentDepth = 0
foreach ($char in $fileContent.ToCharArray()) {
  if ($char -in '{', '[', '(') {
    $currentDepth++
    $maxNestDepth = [Math]::Max($maxNestDepth, $currentDepth)
  }
  elseif ($char -in '}', ']', ')') {
    $currentDepth--
  }
}

if ($maxNestDepth -gt 5) {
  $reviewIssues += @{
    severity = "warn"
    category = "complexity"
    issue = "ネストが深い（深さ: $maxNestDepth）"
    description = "ネストを6以下に減らすためにリファクタリングを推奨。関数分割やヘルパー関数化を検討。"
    lines = @()
  }
}

# 関数内の行数チェック
$functionMatches = [regex]::Matches($fileContent, 'function\s+\w+|const\s+\w+\s*=\s*(?:=>|\(.*?\)\s*=>)')
if ($functionMatches.Count -gt 0) {
  if ($fileContent.Split("`n").Count -gt 200) {
    $reviewIssues += @{
      severity = "warn"
      category = "complexity"
      issue = "ファイルサイズが大きい"
      description = "ファイルを分割することで保守性が向上します（目安: 1ファイル500行以下）。"
      lines = @()
    }
  }
}

# 4. ドキュメント・JSDoc チェック
Write-Host "  ✓ ドキュメンテーション確認中..." -ForegroundColor Gray

if ($filePath -match "\.(ts|tsx)$") {
  # JSDoc がないエクスポート関数をチェック
  $exportFunctions = [regex]::Matches($fileContent, 'export\s+(async\s+)?function\s+(\w+)|export\s+const\s+(\w+)\s*=')
  $jsdocPatterns = $fileContent -split "`n" | Where-Object { $_ -match '/\*\*' }

  if ($exportFunctions.Count -gt 0 -and $jsdocPatterns.Count -eq 0) {
    $reviewIssues += @{
      severity = "warn"
      category = "documentation"
      issue = "JSDoc コメントがない"
      description = "エクスポートされた関数・コンポーネントには TSDoc コメント（/** ... */）を追加してください。IDE サポート向上。"
      lines = @()
    }
  }
}

# 5. Next.js 16 対応チェック
if ($filePath -match "page\.tsx|layout\.tsx") {
  Write-Host "  ✓ Next.js 16 対応確認中..." -ForegroundColor Gray

  # params の await チェック
  if ($fileContent -match "params\." -and $fileContent -notmatch "await params") {
    $reviewIssues += @{
      severity = "error"
      category = "nextjs-16"
      issue = "params が await されていない（Next.js 16 では必須）"
      description = "Next.js 16 では params と searchParams は非同期。`await params` または `const { id } = await params` を使用。"
      lines = @()
    }
  }

  # middleware.ts の使用チェック
  if ($filePath -match "middleware\.ts$") {
    $reviewIssues += @{
      severity = "error"
      category = "nextjs-16"
      issue = "middleware.ts が検出（Next.js 16 では非推奨）"
      description = "proxy.ts を使用してください。ファイル名を proxy.ts に変更し、関数を export async function proxy(request) に。"
      lines = @()
    }
  }
}

# 6. テストの必要性判定
Write-Host "  ✓ テスト要件判定中..." -ForegroundColor Gray

if ($filePath -match "\.logic\.(ts|tsx)$" -or $filePath -match "utils/" -or $filePath -match "lib/") {
  # ロジックファイルなのにテストがない場合
  $hasTest = Test-Path (($filePath -replace '\.(ts|tsx)$', '.test.$1'))
  if (!$hasTest) {
    $reviewIssues += @{
      severity = "warn"
      category = "testing"
      issue = "テストファイルが見つからない"
      description = "ロジック・ユーティリティには対応する.test.ts を作成してください（TDD 原則）。"
      lines = @()
    }
  }
}

# 7. コーディング規約チェック（基本）
Write-Host "  ✓ コーディング規約確認中..." -ForegroundColor Gray

# console.log チェック
if ($fileContent -match "console\.(log|debug|info)\(" -and $fileContent -notmatch "// TODO|// FIXME") {
  $reviewIssues += @{
    severity = "warn"
    category = "code-style"
    issue = "console.log が含まれている"
    description = "本番環境でのログ出力を避けてください。必要な場合は logger ライブラリを使用。"
    lines = @()
  }
}

# var キーワード チェック
if ($fileContent -match "\bvar\s+") {
  $reviewIssues += @{
    severity = "warn"
    category = "code-style"
    issue = "`var` キーワードの使用"
    description = "`const` または `let` を使用してください（スコープ予測が容易）。"
    lines = @()
  }
}

# ===========================
# レビュー結果を JSON で出力
# ===========================

$reviewResult = @{
  timestamp = $timestamp
  event = "code_review"
  filePath = $filePath
  totalIssues = $reviewIssues.Count
  errors = @($reviewIssues | Where-Object { $_.severity -eq "error" }).Count
  warnings = @($reviewIssues | Where-Object { $_.severity -eq "warn" }).Count
  issues = $reviewIssues
  datetime = Get-Date -Format "o"
} | ConvertTo-Json -Compress -Depth 3

# ログに追記
Add-Content -Path $reviewLogFile -Value $reviewResult

# ===========================
# レビュー結果をコンソール出力
# ===========================

if ($reviewIssues.Count -eq 0) {
  Write-Host "✅ コード品質レビュー完了 - 指摘なし！" -ForegroundColor Green
} else {
  Write-Host "⚠️ コード品質レビュー完了 - $($reviewIssues.Count) 件の指摘あり" -ForegroundColor Yellow
  Write-Host ""
  Write-Host "【指摘事項】" -ForegroundColor Yellow

  # 重大度別に表示
  $errors = $reviewIssues | Where-Object { $_.severity -eq "error" }
  $warnings = $reviewIssues | Where-Object { $_.severity -eq "warn" }

  if ($errors) {
    Write-Host "❌ エラー:" -ForegroundColor Red
    foreach ($error in $errors) {
      Write-Host "  • $($error.issue)" -ForegroundColor Red
      Write-Host "    $($error.description)" -ForegroundColor Gray
    }
    Write-Host ""
  }

  if ($warnings) {
    Write-Host "⚠️ 警告:" -ForegroundColor Yellow
    foreach ($warning in $warnings) {
      Write-Host "  • $($warning.issue)" -ForegroundColor Yellow
      Write-Host "    $($warning.description)" -ForegroundColor Gray
    }
  }

  Write-Host ""
  Write-Host "💡 Tip: 「このコードをレビューして修正案を提示して」と聞くと、修正案 A/B/C から選べます。" -ForegroundColor Cyan
}

# フック用に出力（決定権がないため、記録のみ）
exit 0
