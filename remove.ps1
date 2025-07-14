# git worktree list の実行
Write-Host "現在のworktree一覧:"
git worktree list
$branch = Read-Host "削除するブランチを入力してください（空白の場合は中止）"
if ([string]::IsNullOrWhiteSpace($branch)) {
    Write-Host "中止します。"
    exit
}
git worktree remove $branch
