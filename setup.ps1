<#
.SYNOPSIS
    Next.jsプロジェクトのGit Worktreeをセットアップし、依存関係をインストールし、開発サーバーを起動します。

.DESCRIPTION
    このスクリプトは以下のタスクを自動化します。
    1. 新しいGit Worktreeを作成します。
    2. メインリポジトリから.envファイルを新しいWorktreeにコピーします。
    3. 新しいWorktreeでnpm依存関係をインストールします。
    4. Next.js開発サーバーを起動します。
    5. オプションで、新しいWorktreeをVS Codeで開くことを提案します。

.PARAMETER WorktreeName
    作成する新しいWorktreeのディレクトリ名。例: "feature-branch"
    この名前は新しいブランチ名としても使用されます。

.EXAMPLE
    .\setup-nextjs-worktree.ps1 "new-feature-worktree"

.NOTES
    - Gitがシステムパスに追加されている必要があります。
    - Node.jsとnpmがインストールされている必要があります。
    - `.env`ファイルは、メインリポジトリのルートに存在すると仮定しています。
    - スクリプトは新しいブランチを作成し、そのブランチにチェックアウトします。
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$WorktreeName
)

$ErrorActionPreference = "Stop" # エラーが発生した場合にスクリプトを停止する

Write-Host "--- Next.js Git Worktree セットアップスクリプトを開始します ---" -ForegroundColor Green

# 1. パスの設定と検証
$MainRepoPath = "U:\2025src\___masakinihirota\vns-masakinihirota"
$WorktreePath = Join-Path (Split-Path $MainRepoPath -Parent) $WorktreeName
$BranchName = $WorktreeName # Worktree名と同じブランチ名を使用

Write-Host "メインリポジトリパス: $MainRepoPath"
Write-Host "新しいWorktreeパス: $WorktreePath"
Write-Host "新しいブランチ名: $BranchName"

if (-not (Test-Path $MainRepoPath -PathType Container)) {
    Write-Error "エラー: メインリポジトリパス '$MainRepoPath' が見つかりません。"
    exit 1
}

if (Test-Path $WorktreePath -PathType Container) {
    Write-Error "エラー: Worktreeパス '$WorktreePath' は既に存在します。別の名前を指定してください。"
    exit 1
}

# 2. Git Worktreeの作成
Write-Host "`n--- Git Worktreeを作成中... ---" -ForegroundColor Cyan
try {
    Set-Location $MainRepoPath
    # 新しいブランチを作成しつつワークツリーを追加
    git worktree add $WorktreePath -b $BranchName
    Write-Host "Worktree '$WorktreeName' とブランチ '$BranchName' が正常に作成されました。" -ForegroundColor Green
} catch {
    Write-Error "エラー: Git Worktreeの作成中に問題が発生しました。 $($_.Exception.Message)"
    exit 1
}

# ワークツリーディレクトリが存在するか再確認
if (-not (Test-Path $WorktreePath -PathType Container)) {
    Write-Error "エラー: Worktreeディレクトリ '$WorktreePath' が作成されていません。"
    exit 1
}

# 3. 環境ファイルのコピー（.gitignoreは除外）
Write-Host "`n--- 環境ファイルをコピー中... ---" -ForegroundColor Cyan

$envFiles = @(".env", ".env.local", ".env.vercel")

foreach ($file in $envFiles) {
    $sourceFile = Join-Path $MainRepoPath $file
    $destFile = Join-Path $WorktreePath $file

    if (Test-Path $sourceFile) {
        try {
            Copy-Item $sourceFile $destFile -Force -ErrorAction Stop
            Write-Host "$file ファイルを '$destFile' にコピーしました。" -ForegroundColor Green
        } catch {
            Write-Warning "警告: $file ファイルのコピー中にエラーが発生しました。 $($_.Exception.Message)"
        }
    } else {
        Write-Warning "警告: メインリポジトリに $file ファイルが見つかりませんでした。スキップします。"
    }
}

# 4. 依存関係のインストール
Write-Host "`n--- 依存関係をインストール中 (pnpm install)... ---" -ForegroundColor Cyan
try {
    Set-Location $WorktreePath
    pnpm install
    Write-Host "依存関係が正常にインストールされました。" -ForegroundColor Green
} catch {
    Write-Error "エラー: pnpm install の実行中に問題が発生しました。 $($_.Exception.Message)"
    exit 1
}

# 5. Next.js開発サーバーの起動
Write-Host "`n--- Next.js開発サーバーを起動中 (pnpm run dev)... ---" -ForegroundColor Cyan
Write-Host "新しいターミナルで開発サーバーが起動します。このターミナルは閉じないでください。" -ForegroundColor Yellow
try {
    # 新しいターミナルで実行するためにstart-processを使用
    Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", "Set-Location '$WorktreePath'; pnpm run dev"
    Write-Host "開発サーバーの起動コマンドが発行されました。" -ForegroundColor Green
} catch {
    Write-Error "エラー: Next.js開発サーバーの起動中に問題が発生しました。 $($_.Exception.Message)"
    exit 1
}

# 6. VS Codeで開くことを提案＆自動で立ち上げ
Write-Host "`n--- セットアップが完了しました！ ---" -ForegroundColor Green
Write-Host "新しいWorktreeをVS Codeで開き、ターミナルで自動的に 'pnpm run dev' を実行します。" -ForegroundColor Yellow

try {
    # VSCodeを新しいウィンドウで開き、ターミナルでpnpm run devを自動実行
    Start-Process code -ArgumentList "`"$WorktreePath`"", "--new-window", "--command", "workbench.action.terminal.new", "--command", "workbench.action.terminal.sendSequence", "--args", "{`"text`":`"pnpm run dev`"}"
    Write-Host "VSCodeが新しいWorktreeで起動し、ターミナルで 'pnpm run dev' を自動実行します。" -ForegroundColor Green
} catch {
    Write-Warning "VSCodeの自動起動またはターミナルコマンド送信に失敗しました。手動で 'code $WorktreePath' を実行し、ターミナルで 'pnpm run dev' を実行してください。"
}

Write-Host "`nスクリプトが終了しました。" -ForegroundColor Green
Write-Host "`nスクリプトが終了しました。" -ForegroundColor Green
Write-Host "`nスクリプトが終了しました。" -ForegroundColor Green
Write-Host "`nスクリプトが終了しました。" -ForegroundColor Green
