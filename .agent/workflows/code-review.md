---
description: Review 指示書
---

# Code Review Workflow

このワークフローは `code-review` スキルを使用して、コードベースの包括的なレビューを行います。

## 手順

1.  **コンテキスト読み込み**:
    - `.agent/skills/code-review/SKILL.md` を読み込み、レビューの観点（セキュリティ、パフォーマンス、構造、命名など）を確認します。

2.  **レビュー対象の特定**:
    - ユーザーの指示、または変更されたファイル（`git diff` や `git status` で確認）を対象とします。

3.  **レビュー実行**:
    - 以下の観点でコードをチェックします。
        - **機能性**: バグはないか？ 仕様通りか？
        - **セキュリティ**: 入力バリデーション、認証・認可、SQLインジェクション対策などは十分か？ ([Security Review](./skills/code-review/SKILL.md#2-security-review) 参照)
        - **パフォーマンス**: 無駄な再レンダリングやN+1問題はないか？ ([Performance Review](./skills/code-review/SKILL.md#3-performance-review) 参照)
        - **可読性・保守性**: 命名規則、ディレクトリ構造、設計原則（DRY, SOLIDなど）に従っているか？

4.  **レポート作成**:
    - 検出された問題を優先度（Critical, Major, Minor）と共にリストアップします。
    - 具体的な修正案やコード例を提示します。

## コマンド例

- `/code-review`: 全体または指定範囲のレビュー
