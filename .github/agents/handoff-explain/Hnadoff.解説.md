# ハンドオフ機能（HandOff） — カスタムエージェントによる開発ワークフローの自動化

📌 目的: このドキュメントは、VS Code のカスタムエージェント（例: `.agent.md`）に使える「ハンドオフ」機能の解説、設定方法、具体的な活用例、運用上のコツをまとめたものです。

---

## 概要 — 「ハンドオフ」とは 💡

- 「ハンドオフ」は、あるカスタムエージェントの実行が完了したあと **ボタン操作** により、**関連コンテキスト（入力、生成物、メタ情報）** と **プロンプト** を別のエージェントへ渡して作業を引き継ぐ機能です。
- これにより、計画→実装→レビューといった複数フェーズにまたがるワークフローを、AIにより役割ベースで分担・連結できます。

## 仕組み（短く）🔧

- UI上は「ハンドオフボタン」が表示され、押すとコンテキストが指定されたターゲットエージェントへ移ります。
- YAMLフロントマターで `handoffs` を定義し、`label`, `agent`, `prompt`, `send` の値を設定します。
- `send: false` にするとユーザーが送信内容を確認してから移行できます。`send: true` は自動送信です。

---

## YAML 設定: 基本項目

| 項目              | 説明                               | 例                                       |
| :---------------- | :--------------------------------- | :--------------------------------------- |
| `handoffs.label`  | ハンドオフボタンのラベル           | `Start Implementation`                   |
| `handoffs.agent`  | 移行先エージェント識別子           | `implementation`                         |
| `handoffs.prompt` | 移行先に渡す指示テキスト（自由文） | `Now implement the plan outlined above.` |
| `handoffs.send`   | 自動送信フラグ（true/false）       | `false`                                  |

---

## 活用例（短いサマリ）🧭

- 計画（Planner）→ 実装（Implementation）: 要件・設計をそのまま実装に渡す。
- 実装（Implementation）→ レビュー（Code Reviewer）: コード編集完了後にレビューへ移す。
- 失敗テスト（Failing Tester）→ 実装（Implementation）: TDDの流れで最初に失敗テストを作り、実装で合格させる。

---

## 具体的なシナリオ例（YAML + 解説）📑

### 例: Planner → Implementation

```yaml
---
description: Initial brainstorming and idea definition.
tools: ["search", "fetch", "githubRepo", "usages"]
handoffs:
  - label: Start Implementation
    agent: implementation
    prompt: Now implement the plan outlined above.
    send: false
---
```

- 説明: Planner が作成した要件／設計／実装手順（Markdown などの構造化情報）を `implementation` に渡して実装を行わせます。

### 例: Implementation → Code Reviewer

```yaml
---
description: Implement code changes based on an approved plan.
tools: ["edit", "search"]
handoffs:
  - label: Request Code Review
    agent: code_reviewer
    prompt: Review the implementation changes just completed for quality and security issues.
    send: false
---
```

- 説明: 実装エージェントの変更をレビュー担当へ引き継ぐためのハンドオフです。レビュー用のエージェントは読み取り専用ツールで動作するのが推奨されます。

### 例: Failing Tester → Implementation（TDD）

```yaml
---
description: Generate failing tests that need implementation to pass.
tools: ["search", "fetch"]
handoffs:
  - label: Implement to Pass Tests
    agent: implementation
    prompt: Implement the required code changes to make the tests outlined above pass.
    send: false
---
```

- 説明: TDD で「最初に失敗するテストを作成」→ 実装でそのテストを合格させる流れに最適です。

---

## フルワークフロー: アイデア→計画→実装→レビュー（TDD採用）🔁

1. アイデア生成 → Planner
   - `idea_agent` が初期のアイデアを生成。
   - ハンドオフで `planner` へ渡し、要件定義や高レベル設計を作成。
2. Planner → Failing Tester
   - 計画承認後、TDD 用の失敗テストを生成する `failing_tester` へ移行。
3. Failing Tester → Implementation
   - 生成した失敗テストを渡し、実装 (`implementation`) にてテストを合格させる。
4. Implementation → Code Reviewer
   - 実装完了・テスト合格後にレビュー担当 (`code_reviewer`) に渡して最終チェックを実施。

---

## .agent.md のテンプレート（サンプル）🧩

1. `idea_agent.agent.md`

```markdown
---
description: 新しい機能やプロジェクトの初期アイデアと目標を定義します。
name: IdeaGenerator
target: vscode
tools: ["search"]
handoffs:
  - label: 詳細な計画と設計を開始
    agent: planner
    prompt: このアイデアと目標に基づき、要件定義、高レベル設計、および実装ステップを含む詳細な計画を生成してください。
    send: false
---
```

2. `planner.agent.md`

```yaml
---
description: 要件定義、高レベル設計、および実装計画を生成します。
name: Planner
target: vscode
tools: [ 'search', 'fetch' ]
handoffs:
  - label: TDD: 失敗するテストケースを作成
    agent: failing_tester
    prompt: 承認された設計と要件に基づき、実装対象の機能に対応する、現在は失敗するテストコードのリストを作成してください。
    send: false
---
```

3. `failing_tester.agent.md`

```yaml
---
description: テスト駆動開発（TDD）のための失敗するテストコードを作成します。
name: FailingTester
target: vscode
tools: ["search", "fetch"]
handoffs:
  - label: 実装を開始し、テストを合格させる
    agent: implementation
    prompt: 直前に提示された失敗テストをすべて合格させるために必要なコード変更を実装し、ファイルに適用してください。
    send: false
---
```

4. `implementation.agent.md`

```yaml
---
description: コード変更を実装し、テストを合格させます。
name: Implementer
target: vscode
tools: ["edit", "search"]
handoffs:
  - label: 最終コードレビューに提出
    agent: code_reviewer
    prompt: 完了した実装（テスト合格済み）のコード変更全体について、品質、セキュリティ、および設計との整合性をレビューしてください。
    send: false
---
```

5. `code_reviewer.agent.md`

```yaml
---
description: 実装されたコードのセキュリティ脆弱性、品質、および設計との整合性をレビューします。
name: CodeReviewer
target: vscode
tools: ["search", "fetch"]
---
```

---

## 運用のコツ / ベストプラクティス ✅

- まずは `send: false` を使って、各ハンドオフの内容が期待どおりに渡るかを確認してから `send: true` を検討する。
- エージェントの `tools`（許可された操作）を役割ごとに限定する（Planner: 読取のみ、Implementation: 編集許可など）。
- `prompt` は具体的に。対象ファイル群、テスト名、期待結果、制約（コードスタイルや依存関係）を明記すると安定する。
- ハンドオフで渡すコンテキストは冗長になりがちなので、重要な要素（要件、失敗テスト、変更ファイル、テスト結果）に焦点を当てる。
- 小さな単位でハンドオフする（TDD のように小さな検証単位で進めるとレビューが容易）。

---

## 参考プロンプト（抜粋）✍️

- `Now implement the plan outlined above.` — 計画に基づいて実装を開始させる基本プロンプト
- `Review the implementation changes just completed for quality and security issues.` — 実装結果をレビューさせる基本プロンプト
- `Implement the required code changes to make the tests outlined above pass.` — 失敗テストを合格させる実装指示

---

## 付録: よくある問いと回答（FAQ）❓

- Q: エージェント間で大きなオブジェクト（大量のCIログやバイナリ）を渡せますか？
  - A: 直接のファイル転送は限定されます。必要なら要点（エラーの要約、失敗テストのファイルパス、行番号）を渡すのが実務的です。
- Q: 複数タスクを自動で連続実行できますか？
  - A: `send: true` とエージェントの自動プロンプトを組み合わせることで可能ですが、まずは検査・確認を挟む方式（`send: false`）で充分にテストしてください。

---

このドキュメントはプロジェクトのハンドオフ運用例です。必要に応じて、各 `agent` ファイルに固有の制約やプロンプトテンプレートを追加して運用を成熟させてください。

Tips: 最初は1つのワークフロー（例：Planner→Implementation）だけ導入して安定化させてから、他のフローを追加していくのがおすすめです。
