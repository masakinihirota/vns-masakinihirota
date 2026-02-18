---
description: 設計ドキュメント（Source vs Agent Rules vs AI-Design）の同期を実行します
---

# /sync-design ワークフロー

## 概要

人間が作成した `anti-design` とエージェントの行動指針 `.agent/rules` をチェックし、`ai-design` フォルダのドキュメントを最新化します。

## 手順

### 1. 更新状況の確認

`anti-design` と `.agent/rules` の各ファイルをリストアップし、最終更新日時を確認します。
// turbo

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8;
Get-ChildItem -Path "u:\2026src\vns-masakinihirota-design.worktrees\anti-design", "u:\2026src\vns-masakinihirota.worktrees\anti\.agent\rules" -Recurse | Select-Object FullName, LastWriteTime | Sort-Object LastWriteTime -Descending
```

### 2. 同期スキルの適用

変更があったファイルに関連する `ai-design` ドキュメントを特定し、`ai-design-sync` スキルを適用して更新します。

- `.agent/rules` 変更時 -> 設計・運用ガイドラインを再同期
- `anti-design` 変更時 -> 要件定義・技術設計を再同期

### 3. 整合性チェックと報告

// turbo

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8;
ls -R "u:\2026src\vns-masakinihirota-ai-design"
```

更新された内容を `walkthrough.md` に追記し、`notify_user` でユーザーに変更点を報告します。

## 使用例

ユーザーから「設計書の同期をお願い」と言われた場合や、定期的なメンテナンス時に使用します。
