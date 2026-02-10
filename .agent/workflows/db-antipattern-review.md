---
description: DBアンチパターンチェックを実行する
---

# DB Antipattern Review Workflow

このワークフローは、現在のコードベース（指定されたファイルまたはディレクトリ）に対して、`db-antipattern-review` スキルを使用したレビューを実行します。

## 手順

1.  **対象の特定**: ユーザーが指定したファイル、または最近変更されたDB関連ファイル（`schema.sql`, `migrations/`, `types/database.ts` 等）を特定します。
2.  **スキル参照**: `.agent/skills/db-antipattern-review/SKILL.md` を参照し、アンチパターン検出ルールを読み込みます。
3.  **レビュー実行**: 特定されたファイルに対してレビューを行い、アンチパターンが含まれていないかチェックします。特に「RLS無効」「オレオレ認証」「SQLインジェクション」は重点的にチェックします。
4.  **レポート作成**: 検出された問題と改善案をレポートとして出力します。

## 実行コマンド例

- `/db-antipattern-review` : 全体の簡易チェック
- `/db-antipattern-review migrations/` : マイグレーションファイルのチェック
