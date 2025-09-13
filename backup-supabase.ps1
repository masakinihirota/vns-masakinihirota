# backup-supabase.ps1
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = "supabase/backup"
$historyDir = "$backupDir/history"
$filename = "$timestamp-backupAll_local.backup"

if (!(Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
}

if (!(Test-Path $historyDir)) {
    New-Item -ItemType Directory -Path $historyDir | Out-Null
}

# 古いバックアップファイルを圧縮してhistoryフォルダに移動
$archiveName = "$historyDir/$timestamp-backup_archive.zip"
Compress-Archive -Path (Get-ChildItem -Path $backupDir -Filter "*.backup").FullName -DestinationPath $archiveName
Remove-Item -Path (Get-ChildItem -Path $backupDir -Filter "*.backup").FullName

try {
    # ローカルのバックアップ

    # ロールのバックアップ
    supabase db dump --local -f "$backupDir/$timestamp-roles_local.backup" --role-only

    # スキーマのバックアップ
    supabase db dump --local -f "$backupDir/$timestamp-schema_local.backup"

    # データのバックアップ
    supabase db dump --local -f "$backupDir/$timestamp-data_local.backup" --use-copy --data-only

    if ($LASTEXITCODE -eq 0) {
        Write-Host "バックアップ完了: $backupDir/$filename"
    } else {
        Write-Host "バックアップに失敗しました (exit code: $LASTEXITCODE)"
    }
} catch {
    Write-Host "エラーが発生しました: $_"
}
