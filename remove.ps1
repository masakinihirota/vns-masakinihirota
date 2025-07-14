<#
.SYNOPSIS
    Git Worktreeと対応するブランチを削除するスクリプト。

.DESCRIPTION
    このスクリプトは以下のタスクを自動化します。
    1. 指定されたWorktreeフォルダを削除します。
    2. Worktreeに対応するGitブランチを削除します。

.PARAMETER WorktreeName
    削除するWorktreeの名前。例: "feature-branch"

.EXAMPLE
    .\remove-nextjs-worktree.ps1 "feature-branch"

.NOTES
    - Gitがシステムパスに追加されている必要があります。
    - Worktreeフォルダが存在しない場合はエラーを表示します。
    - ブランチが削除できない場合はエラーを表示します。
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$WorktreeName
)

$ErrorActionPreference = "Stop"

# メインリポジトリのパス
$MainRepoPath = "U:\2025src\___masakinihirota\vns-masakinihirota"
$WorktreePath = Join-Path (Split-Path $MainRepoPath -Parent) $WorktreeName
$BranchName = $WorktreeName

Write-Host "--- Git Worktreeとブランチ削除スクリプトを開始します ---" -ForegroundColor Green
Write-Host "メインリポジトリパス: $MainRepoPath"
Write-Host "削除するWorktreeパス: $WorktreePath"
Write-Host "削除するブランチ名: $BranchName"

# Gitブランチのリストを取得
Write-Host "`n--- 利用可能なブランチのリスト ---" -ForegroundColor Yellow
Set-Location $MainRepoPath
$branches = git branch --list | ForEach-Object { $_.Trim() }
if ($branches.Count -eq 0) {
    Write-Error "エラー: 利用可能なブランチがありません。"
    exit 1
}

# ブランチの選択
Write-Host "以下のブランチから削除するブランチを選択してください:"
$branches | ForEach-Object { Write-Host $_ }
$BranchName = Read-Host "削除するブランチ名を入力してください"

# Worktreeパスを更新
$WorktreePath = Join-Path (Split-Path $MainRepoPath -Parent) $BranchName

# Worktreeフォルダの存在確認
if (-not (Test-Path $WorktreePath -PathType Container)) {
    Write-Error "エラー: Worktreeパス '$WorktreePath' が存在しません。"
    exit 1
}

# 確認プロンプト
Write-Host "`n--- 確認プロンプト ---" -ForegroundColor Yellow
$confirmation = Read-Host "Worktreeとブランチ '$BranchName' を削除しますか？ (Y/N)"
if ($confirmation -ne "Y") {
    Write-Host "操作がキャンセルされました。" -ForegroundColor Red
    exit 0
}

# Worktreeの削除
Write-Host "`n--- Worktreeを削除中... ---" -ForegroundColor Cyan
try {
    Set-Location $MainRepoPath
    git worktree remove $WorktreePath
    Write-Host "Worktree '$WorktreePath' が正常に削除されました。" -ForegroundColor Green
} catch {
    Write-Error "エラー: Worktreeの削除中に問題が発生しました。 $($_.Exception.Message)"
    exit 1
}

# ブランチの削除
Write-Host "`n--- Gitブランチを削除中... ---" -ForegroundColor Cyan
try {
    # 現在チェックアウトされているブランチを確認
    $currentBranch = git rev-parse --abbrev-ref HEAD
    if ($currentBranch -eq $BranchName) {
        Write-Error "エラー: 現在チェックアウトされているブランチ '$BranchName' を削除することはできません。"
        exit 1
    }
    git branch -D $BranchName
    Write-Host "ブランチ '$BranchName' が正常に削除されました。" -ForegroundColor Green
} catch {
    Write-Error "エラー: ブランチの削除中に問題が発生しました。 $($_.Exception.Message)"
    exit 1
}

Write-Host "`n--- Worktreeとブランチの削除が完了しました！ ---" -ForegroundColor Green

# ヘルプセクション
if ($WorktreeName -eq "?") {
    Write-Host "`n--- スクリプトの使い方 ---" -ForegroundColor Cyan
    Write-Host "このスクリプトはGit Worktreeと対応するブランチを削除します。" -ForegroundColor Yellow
    Write-Host "使用例:" -ForegroundColor Green
    Write-Host "  .\remove-next.js-worktree.ps1 <WorktreeName>" -ForegroundColor Green
    Write-Host "  例: .\remove-next.js-worktree.ps1 feature-branch" -ForegroundColor Green
    Write-Host "`nWorktreeNameには削除するブランチ名を指定してください。" -ForegroundColor Yellow
    exit 0
}
