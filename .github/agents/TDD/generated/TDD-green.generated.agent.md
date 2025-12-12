---
name: TDD-green-generated
description: (generated) TDD Green フェーズ - Red テストを最小限の実装でパスさせる。
target: vscode
tools: ["edit", "runTests", "search"]
handoffs:
  - label: Run Refactor (TDD Refactor)
    agent: TDD-refactor-generated
    prompt: "Refactor the implementation while keeping tests green; improve readability and maintainability without changing behavior."
    send: false
---

# TDD-green-generated (自動生成版)

用途:

- Red フェーズで作成された失敗テストを最小限のコードでパスさせる（Green）。
- 実装は最小に留め、将来のリファクタ用に PR ノートを残す。
