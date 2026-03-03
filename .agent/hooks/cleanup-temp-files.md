---
description: タスク完了時・コミット前に、AIが生成した一時ファイル（ログ・テスト出力・バックアップ等）をルートディレクトリから自動削除する
---

# AI一時ファイル クリーンアップ Hook

タスク完了時またはコミット前に、以下の手順を実行してください。

## トリガー条件

- タスクが完了し、ユーザーに報告する直前
- `/commit` ワークフロー実行時（品質チェックの前）

## 1. 対象ファイルの検出

プロジェクトルートディレクトリで以下のパターンに一致するファイルを検索してください：

| パターン | 例 |
|---|---|
| `*.log` | `build.log`, `lint_output.log`, `axe_crash.log` |
| `*_output*.txt` | `build_output.txt`, `test_output.txt` |
| `test-output.txt` | テスト出力 |
| `test_report.json` | テストレポート |
| `analyze_tests.js` | AI生成の一時スクリプト |
| `*.backup` | `vitest.api.config.ts.backup` |

**除外対象**: `node_modules/`, `.next/`, `src/`, `docs/`, `scripts/` 配下のファイルは対象外。ルートディレクトリ直下のみを対象とする。

## 2. 削除の実行

検出されたファイルを削除してください。

```powershell
# PowerShell での実行例
Get-ChildItem -Path . -MaxDepth 1 -File | Where-Object { $_.Name -match '\.(log|backup)$' -or $_.Name -match '_output.*\.(txt|log)$' -or $_.Name -match '^(test-output\.txt|test_report\.json|analyze_tests\.js)$' } | Remove-Item -Force
```

## 3. 報告

- 削除したファイルがある場合: 「🧹 AI一時ファイルを N 件削除しました: [ファイル名リスト]」と報告
- 削除対象がない場合: 報告不要（静かに完了）

## 注意事項

- `page.tsx` のようなソースコードがルートに迷い込んでいる場合は、削除せず **ユーザーに確認** すること
- 判断に迷うファイルは削除せず報告する
