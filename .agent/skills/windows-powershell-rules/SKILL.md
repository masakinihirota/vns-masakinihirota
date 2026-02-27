---
name: windows-powershell-rules
description: Windows PowerShell環境におけるコマンド実行のルールと制約。Unix系コマンド（grep, ls, catなど）の失敗を防ぎ、互換性を保つためのガイドライン。
---

# Windows PowerShell環境でのコマンド実行ルール

このプロジェクトは **Windows環境 (PowerShell)** で開発されています。
AIエージェントがターミナルでコマンドを実行する際は、以下のルールを厳守してください。

## 1. Unix系コマンドの禁止（厳守）

PowerShell環境において、Unix系コマンド（`del`, `rm`, `ls`, `grep`, `cat`, `sed`, `awk` 等）の使用は**原則禁止**です。これらはエイリアスとして存在する場合でも、引数の互換性がなく、エラーとリトライの原因になります。

**AIエージェントへの強い指示**:
- 実行前に、そのコマンドがWindows/PowerShellネイティブであることを確認してください。
- `del` や `rm` を試してから `Remove-Item` に切り替えるような「無駄な試行」をしないでください。
- 最初から `Remove-Item`, `Get-ChildItem`, `Select-String` などのネイティブコマンドを選択してください。

## 2. 適切な代替手段の利用

コマンド実行ツール (`run_command`) ではなく、**AIエージェントに提供されている専用のツール関数を最優先で使用してください**。

### ✅ 推奨されるアプローチ
- **ファイル検索 / 文字列検索**: コマンドラインツールの `grep` の代わりに、エージェント組み込みの `grep_search` ツールを使用する。
- **ファイル一覧の取得**: `ls` の代わりに、エージェント組み込みの `list_dir` ツールを使用する。
- **ふぁいるの内容確認**: `cat` の代わりに、エージェント組み込みの `view_file` ツールを使用する。

## 3. どうしてもPowerShellで実行する必要がある場合

ツール関数では対応できない特定の操作をPowerShellで実行する場合は、PowerShellネイティブのコマンドレットを使用してください。

| Unix / Linuxコマンド | PowerShellの代替（推奨） |
| :--- | :--- |
| `grep` | `Select-String -Pattern "検索文字列"` |
| `ls` または `find` | `Get-ChildItem -Recurse` |
| `cat` | `Get-Content` |
| `rm` | `Remove-Item` |

**例:** `pnpm tsc --noEmit` の結果をフィルタリングしたい場合
- ❌ 誤り: `pnpm tsc --noEmit | grep "route.ts"`
- ✅ 正しい: `pnpm tsc --noEmit | Select-String "route.ts"`
（※ただし、最も安全なのは一時ファイルにリダイレクト `> output.txt` して、`grep_search` ツールで中身を調べる方法です。）

## 4. 文字化け・エンコーディング対策（再掲）

Windows環境で日本語を含むコマンド結果を受け取る場合、以下のエンコーディング指定を冒頭に付与してください。
`[Console]::OutputEncoding = [System.Text.Encoding]::UTF8;`
