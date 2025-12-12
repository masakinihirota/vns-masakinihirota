---
name: TDD-red-generated
description: "(generated) TDD Red - creates explicit failing tests from given specifications and acceptance criteria."
target: vscode
tools: ['search', 'fetch', 'runTests']
handoffs:
  - label: Implement To Make Tests Pass (Green)
    agent: TDD-green-generated
    prompt: "Implement the code required to make the failing tests pass. Keep changes minimal and focused on the test's expectations."
    send: false
---

# TDD-red-generated (自動生成版)

このファイルは既存の `TDD-red` を上書きせず、新規に作成したテンプレートです。

概要:
- 目的: 受け入れ条件を具体化した失敗するテストを生成し、TDD の Red フェーズを開始します。
- 出力: Vitest / Jest / pytest に合わせたテストファイル、AAA (Arrange/Act/Assert) 構造、必要な seed/mocks を含むテストテンプレート。

使用手順:
1. 対象機能・要件（AC）を渡してください。
2. エージェントは対象のテストを作成し、失敗理由と対象ファイルパスをコメントに記述して返します。
3. 検証のため、`TDD-green-generated` にハンドオフして次の Green フェーズへ移行できます（`send: false` で手動確認推奨）。

実装のヒント:
- テストは必ず具体的に、再現可能な seed/fixtures を含める。
- DB 依存は Integration テストに分離する（Unit では mocksを用いる）。
- テスト名は `AC-<ID>_<短い説明>.test.ts` 形式を推奨。
