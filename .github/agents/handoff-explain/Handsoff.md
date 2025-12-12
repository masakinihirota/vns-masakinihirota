
# 「ハンドオフ」機能 — 開発ワークフローを自動化する3つの活用例

カスタムエージェントを活用して、専門的な役割を持つAI間でコンテキストを引き継ぎながら作業を行う手法を整理しました。情報はすべて残し、重複を統合して見やすく再構成しています。

---

## 目次
1. 「ハンドオフ」とは？
2. ハンドオフの仕組み
3. 活用例（計画→実装、実装→レビュー、失敗テスト→合格）
4. ハンドオフの設定方法（YAMLフロントマター）
5. 具体的なシナリオごとの設定例（YAML + Prompt）
6. アイデア→完了までのワークフロー全体設定例

---

## 1. 「ハンドオフ」とは？ — 専門家AI間のスムーズなバトンリレー

カスタムエージェントは、特定の開発ロールやタスクに合わせてAIを構成し、**セキュリティレビュアー**や**プランナー**、**ソリューションアーキテクト**といった専門的な役割を持つエージェントを作成できます。

「ハンドオフ」は、関連するコンテキスト（背景情報）を維持したまま、ボタン操作で次のエージェントへ切り替えることで、マルチステップワークフローを実行する機能です。開発者は各ステップをレビュー・承認しながらタスクを進められます。

## 2. ハンドオフの仕組み

- チャットの応答が完了すると画面に**ハンドオフボタン**が表示されます。
- ボタン押下で、**関連コンテキスト**と**プロンプト**が移行先エージェントへ引き渡されます。
- `send`オプションにより、ボタン押下時にプロンプトを自動送信するか（`true`）、開発者の確認を挟むか（`false`）を選べます。

---

## 3. 活用例（3つ）

### 活用例 1: 計画 (Planning) → 実装 (Implementation)

- 計画エージェントが要件、設計、実装手順を生成。
- 計画承認後、ハンドオフボタンにより**実装エージェント**へコンテキストを引き継ぐ。
- 計画エージェントは読み取り専用ツールでリサーチのみ行い、実装は別エージェントに任せる運用が安全です。

### 活用例 2: 実装 (Implementation) → レビュー (Review)

- 実装エージェントがコード編集を完了。
- 「コードレビューに回す」ボタンで**レビュアーエージェント**に切り替え、セキュリティや品質面のチェックを行う。

### 活用例 3: 失敗するテストの作成 → 合格するテストの作成

- 失敗するテストを事前に生成（TDDアプローチ）。
- テスト承認後、**実装エージェント**へハンドオフしてテストを通すための実装を行う。

---

## 4. ハンドオフの設定方法（YAMLフロントマター）

主要設定項目:

| 設定項目 | 説明 | 例 |
| :--- | :--- | :--- |
| `handoffs.label` | ハンドオフボタンに表示するテキスト | `Start Implementation` |
| `handoffs.agent` | 移行先のエージェント識別子 | `implementation` |
| `handoffs.prompt` | 移行先に送る指示テキスト | `Now implement the plan outlined above.` |
| `handoffs.send` | 自動送信のフラグ（デフォルト: `false`） | `false` |

---

## 5. 具体的なシナリオごとの設定例（YAML + Prompt）

### 計画（Planner）→ 実装（Implementation）の例

```yaml
---
description: Initial brainstorming and idea definition.
tools: [ 'search', 'fetch', 'githubRepo', 'usages' ]
handoffs:
handoffs:
  - label: Start Implementation
    agent: implementation
    prompt: Now implement the plan outlined above.
    send: false
---
```

- プロンプト: `Now implement the plan outlined above.`
- 説明: 計画で作成した要件／設計／実装手順を実装エージェントへ渡します。

### 実装（Implementation）→ レビュー（Code Reviewer）の例

```yaml
---
description: Implement code changes based on an approved plan.
tools: [ 'edit', 'search' ]
handoffs:
  - label: Request Code Review
    agent: code_reviewer
    prompt: Review the implementation changes just completed for quality and security issues.
    send: false
---
```

- プロンプト: `Review the implementation changes just completed for quality and security issues.`

### 失敗テスト（Failing Tester）→ 実装（Implementation）の例

```yaml
---
description: Generate failing tests that need implementation to pass.
tools: [ 'search', 'fetch' ]
handoffs:
  - label: Implement to Pass Tests
    agent: implementation
    prompt: Implement the required code changes to make the tests outlined above pass.
    send: false
---
```

- プロンプト: `Implement the required code changes to make the tests outlined above pass.`

---

## 6. アイデア→完了までのワークフロー全体（ステップと例）

### ワークフロー（概要）

| ステップ | フェーズ | Source | Target |
| :--- | :--- | :--- | :--- |
| 1 | アイデア→計画 | `idea_agent` | `planner` |
| 2 | 計画→失敗テスト | `planner` | `failing_tester` |
| 3 | 失敗テスト→実装 | `failing_tester` | `implementation` |
| 4 | 実装→レビュー | `implementation` | `code_reviewer` |

### Step 1: `idea_agent` → `planner` の例

```yaml
---
description: Initial brainstorming and idea definition.
handoffs:
  - label: 詳細な計画と設計を開始
    agent: planner
    prompt: このアイデアと目標に基づき、要件定義、高レベル設計、および実装ステップを含む詳細な計画を生成してください。
    send: false
---
```

### Step 2: `planner` → `failing_tester` の例

```yaml
---
description: Generate implementation plans, requirements, and design overview.
tools: [ 'search', 'fetch' ]
handoffs:
  - label: TDD用の失敗テストを作成
    agent: failing_tester
    prompt: 承認された要件と設計に基づき、実装対象の機能に対応する、現在は失敗するテストケースを最初に作成してください。
    send: false
---
```

### Step 3: `failing_tester` → `implementation` の例

```yaml
---
description: Generate failing tests based on the implementation plan.
handoffs:
  - label: 実装を開始し、テストを合格させる
    agent: implementation
    prompt: 直前に提示された失敗テストをすべて合格させるために必要なコード変更を実装し、ファイルに適用してください。
    send: false
---
```

### Step 4: `implementation` → `code_reviewer` の例

```yaml
---
description: Implement code changes and ensure tests pass.
tools: [ 'edit', 'search' ]
handoffs:
  - label: 最終コードレビューに提出
    agent: code_reviewer
    prompt: 完了した実装（テスト合格済み）のコード変更全体について、品質、セキュリティ、および設計との整合性をレビューしてください。
    send: false
---
```

---

## 運用のコツ

- 役割（エージェント）を明確に定義しておくと出力が安定します。
- `send: false` にしておくと、途中で内容を確認できるため安心です。
- プロンプトは具体的に、必要なコンテキスト（ファイル名、要件、テスト対象）を含めてください。

---

この稿を基に、プロジェクトに合わせてハンドオフのワークフローを微調整してください。まずは一つの流れ（例：計画→実装）から運用を始め、段階的に複数ステップを繋げていくのをおすすめします。

このシナリオを実施する際のポイント（まとめ）:
- Plannerには読み取り専用のリサーチツール（`search`, `fetch`, `githubRepo`, `usages`）を許可し、実装用エージェントに編集ツール（`edit`, `search`, `fetch`）を付与するなど、役割に応じたツール権限を付けてください。
- 各ハンドオフの`prompt`は具体的に書くことで、移行先エージェントの動作が安定します。
- 最初は`send: false`で運用し、信頼できるプロンプトが確立したら`send: true`の自動送信を検討してください。


### 記述例（YAMLフロントマター）



### 主要プロンプトの例

- `Now implement the plan outlined above.` — 計画の結果をそのまま実装に反映させるためのプロンプト

上記プロンプトは、Plannerが生成した要件・設計をそのまま実装エージェントに渡すための基本形です。必要に応じて、ファイル名や追加の制約（例: 対象モジュール、コードスタイル、テストフレームワーク）を追記してください。




















---

## 具体的な使い方 2２つ目の具体例（実装 (Implementation) → レビュー (Review)）**に焦点を当てて、ハンドオフのYAML設定とプロンプトの具体例をご説明します。

---

## 具体的な使い方 2: 実装 (Implementation) から レビュー (Review) へのハンドオフ

このシナリオは、あるエージェント（例えば、「実装エージェント」）がコードの変更を完了した後、次のステップとして**品質やセキュリティの問題を確認する**ための専門家（「コードレビューエージェント」）にスムーズにバトンを渡す例です。

### 1. ワークフローの流れ

1.  **実装の完了:** 実装エージェントがタスクを完了し、チャット応答を終えます。
2.  **ハンドオフの提示:** 画面に「コードレビューに回す」といったボタンが表示されます。
3.  **レビューエージェントへの移行:** ユーザーがボタンを押すと、実装の結果（変更されたコードのコンテキスト）が引き継がれ、**セキュリティの脆弱性を特定したり、改善点を提案したりする**ことに特化した指示を持つ**コードレビューエージェント**に切り替わります。

### 2. ハンドオフのYAMLフロントマター記述例

このハンドオフは、実装エージェントのファイル（例: `implementation.agent.md`）のYAMLフロントマターに記述されます。

| 設定項目 | 記述例 | 役割とソースの裏付け |
| :--- | :--- | :--- |
| **`description`** | `Implement code changes based on an approved plan.` | このエージェント（実装エージェント）の説明です。 |
| **`tools`** | `[ 'edit' , 'search' , 'fetch' ]` | 実装エージェントは「完全な編集能力」を必要とします。 |
| **`handoffs.label`** | `- label : Request Code Review` | ハンドオフボタンに表示されるテキストです。この例では「コードレビューをリクエスト」という意味です。 |
| **`handoffs.agent`** | `agent : code_reviewer` | 移行先のターゲットエージェントの識別子を指定します。ここでは「code\_reviewer（コードレビュアー）」エージェントを指定しています。 |
| **`handoffs.prompt`** | `prompt : Review the implementation changes just completed for quality and security issues.` | **次のエージェント（コードレビューエージェント）に自動的に送る指示テキスト（プロンプト）**です。 |
| **`handoffs.send`** | `send : false` | 既定値は`false`です。ユーザーはプロンプトを確認してから送信できます。|

### 記述例（YAMLフロントマター）

description : Implement code changes based on an approved plan.
tools : [ 'edit' , 'search' ]
handoffs :
 - label : Request Code Review
   agent : code_reviewer
   prompt : Review the implementation changes just completed for quality and security issues.
   send : false
```


### 抽出されたプロンプト

この活用例 2 のハンドオフで次のエージェントに送られるプロンプトは以下のようになります。

> **`prompt : Review the implementation changes just completed for quality and security issues.`**

#### このプロンプトの解説

このプロンプトは、ターゲットである**コードレビューエージェント**に対して、「直前に完了した実装による変更」をコンテキストとして捉え、**品質（Quality）とセキュリティ（Security）の問題点がないかを確認する**という専門的なタスクを明確に指示しています。

コードレビューエージェントは、通常、「セキュリティの脆弱性を特定し、改善点を提案する」といった**専門的な指示**を持って構成されています。このプロンプトと連携することで、レビューエージェントはすぐにその専門能力を発揮し、必要なチェックを開始します。
















## 具体的な使い方 3: 失敗するテストの作成 → 合格するテストの作成へのハンドオフ

このシナリオは、大規模な実装を一度にレビューするのではなく、検証しやすい小さなステップで作業を進めるための高度なワークフローです。まず、AIに意図的に失敗するテストコードを作成させ、そのテストが通るように次のエージェントに必要なコード変更の実装を指示します。

### 1. ワークフローの流れ

1.  **テスト作成エージェントの完了:**
    *   まず、**テスト作成エージェント**が、これから実装する機能がまだ存在しないために「失敗する」テストコードを生成します。
2.  **ハンドオフの提示:**
    *   このテストコードの内容を開発者が確認し、承認した後、「実装に進む」といったハンドオフボタンが表示されます。
3.  **実装エージェントへの移行:**
    *   ユーザーがボタンを選択すると、**生成された失敗テスト**をコンテキストとして引き継ぎ、次の「実装エージェント」に切り替わります。
    *   実装エージェントは、このテストを合格させるために必要なコード変更を行うタスクを引き継ぎます。

この手法は、テスト駆動開発（TDD）のアプローチをAIワークフローに取り込むことに似ており、実装の確実性を高めます。

### 2. ハンドオフのYAMLフロントマター記述例

このハンドオフは、失敗するテストを作成するエージェント（例: `failing_tester.agent.md`）のYAMLフロントマターに記述されます。

| 設定項目 | 記述例 | 役割とソースの裏付け |
| :--- | :--- | :--- |
| **`description`** | `Generate tests that currently fail for a feature that needs implementation.` | このエージェント（失敗テスト作成者）の説明です。 |
| **`handoffs.label`** | `- label : Implement to Pass Tests` | ハンドオフボタンに表示されるテキストです。 |
| **`handoffs.agent`** | `agent : implementation` | 移行先のターゲットエージェントの識別子を指定します（この場合、コード編集能力を持つ実装エージェント）。 |
| **`handoffs.prompt`** | `prompt : Implement the required code changes to make the tests outlined above pass.` | **次のエージェント（実装エージェント）に送る指示テキスト（プロンプト）**です。 |
| **`handoffs.send`** | `send : false` | ユーザーがボタンを選択した後、プロンプトを自動で送信するかどうかを設定します (既定値は `false` です)。|

### 記述例（YAMLフロントマター）

```yaml
---
description : Generate failing tests that need implementation to pass.
tools : [ 'search' , 'fetch' ]
handoffs :
 - label : Implement to Pass Tests
   agent : implementation
   prompt : Implement the required code changes to make the tests outlined above pass.
   send : false
---
```

### 抽出されたプロンプト

この活用例 3 のハンドオフで次のエージェントに送られるプロンプトは以下のようになります。

> **`prompt : Implement the required code changes to make the tests outlined above pass.`**

#### このプロンプトの解説

このプロンプトは、次の**実装エージェント**に対し、「直前のコンテキスト（つまり、**失敗するテスト**）を参照し、**そのテストが合格するために必要なコード変更を実装する**」という具体的なタスクを指示しています。

この指示により、実装エージェントは、実装の目標が抽象的な機能ではなく、目の前にある具体的なテストケースをクリアすることであると理解し、**必要なコード変更のみに集中して**作業を進めることが可能になります。















アイデア＞計画＞要件定義＞ 設計＞TDDでの実装＞失敗するテスト＞成功するテスト＞＞＞完成  というような感じでハンドオフを書いてみて



お客様のご提示された高度で体系的な開発ワークフロー（アイデアから完成まで）を実現するために、カスタムエージェントの「ハンドオフ」機能を連鎖させた具体的な設定例を作成いたします。

このワークフローでは、それぞれのフェーズ（役割）ごとに専門のカスタムエージェントが設定されていると仮定し、前のエージェントの出力（コンテキスト）を次のエージェントにプロンプトを介して確実に引き継ぎます。

### ワークフローの構成

| ステップ | 開発フェーズ | 担当エージェント (Source) | 移行先エージェント (Target) | 関連するソース情報 |
| :--- | :--- | :--- | :--- | :--- |
| **Step 1** | アイデア → 計画/設計 | `idea_agent` | `planner` | 専門的な役割の作成, 計画エージェントの存在 |
| **Step 2** | 計画/設計 → TDDテスト準備 | `planner` | `failing_tester` | 計画から実装への移行例 |
| **Step 3** | 失敗するテスト → 実装/成功 | `failing_tester` | `implementation` | 失敗テストを合格テストへ導く例 |
| **Step 4** | 実装 → 完成/レビュー | `implementation` | `code_reviewer` | 実装からレビューへの移行例 |

---

## 1. Step 1: アイデア → 計画・要件定義・設計

最初のエージェントが生成した「アイデア」を、計画・設計の専門家である`planner`エージェントに引き継ぎます。

### 移行元: `idea_agent.agent.md` (アイデア生成エージェント) の設定

このエージェントは、ユーザーとの対話を通じて初期のアイデアや目標を明確化した後に、ハンドオフを実行します。

| 設定項目 | 記述例 |
| :--- | :--- |
| `handoffs.label` | `詳細な計画と設計を開始` |
| `handoffs.agent` | `planner` |
| `handoffs.prompt` | **`このアイデアと目標に基づき、要件定義、高レベル設計、および実装ステップを含む詳細な計画を生成してください。`** |

```yaml
---
description : Initial brainstorming and idea definition.
handoffs :
 - label : 詳細な計画と設計を開始
   agent : planner
   prompt : このアイデアと目標に基づき、要件定義、高レベル設計、および実装ステップを含む詳細な計画を生成してください。
   send : false
---
```
*解説: `planner`エージェントは、プロジェクトのコンテキストを収集し、詳細な実装計画を生成するよう指示されている役割です。*

## 2. Step 2: 計画・設計 → TDDでの失敗テスト作成

`planner`エージェントによって要件定義と設計が承認された後、TDDワークフローを開始するために、失敗するテストを作成するエージェントに引き継ぎます。

### 移行元: `planner.agent.md` (計画エージェント) の設定

| 設定項目 | 記述例 |
| :--- | :--- |
| `handoffs.label` | `TDD用の失敗テストを作成` |
| `handoffs.agent` | `failing_tester` |
| `handoffs.prompt` | **`承認された要件と設計に基づき、実装対象の機能に対応する、現在は失敗するテストケースを最初に作成してください。`** |

```yaml
---
description : Generate implementation plans, requirements, and design overview.
tools : [ 'search' , 'fetch' ]
handoffs :
 - label : TDD用の失敗テストを作成
   agent : failing_tester
   prompt : 承認された要件と設計に基づき、実装対象の機能に対応する、現在は失敗するテストケースを最初に作成してください。
   send : false
---
```
*解説: 大規模な実装を一度にレビューする代わりに、失敗するテストを先に生成することは、より検証しやすいステップで進めるために役立ちます。*

## 3. Step 3: 失敗するテスト → 実装（成功するテスト）

失敗するテストが承認された後、いよいよコードの実装を行い、そのテストを合格させるタスクを実装エージェントに引き継ぎます。これは、ソースで言及されている「Write Failing Tests → Write Passing Tests」のプロセスを体現します。

### 移行元: `failing_tester.agent.md` (失敗テスト作成エージェント) の設定

| 設定項目 | 記述例 |
| :--- | :--- |
| `handoffs.label` | `実装を開始し、テストを合格させる` |
| `handoffs.agent` | `implementation` |
| `handoffs.prompt` | **`直前に提示された失敗テストをすべて合格させるために必要なコード変更を実装し、ファイルに適用してください。`** |

```yaml
---
description : Generate failing tests based on the implementation plan.
handoffs :
 - label : 実装を開始し、テストを合格させる
   agent : implementation
   prompt : 直前に提示された失敗テストをすべて合格させるために必要なコード変更を実装し、ファイルに適用してください。
   send : false
---
```

## 4. Step 4: 実装（成功するテスト） → 完成・レビュー

実装が完了し、テストが成功した（合格するテストが揃った）後、最終的な品質とセキュリティのチェックを行うレビューエージェントに引き継ぎ、「完成」のステップへと進めます。

### 移行元: `implementation.agent.md` (実装エージェント) の設定

| 設定項目 | 記述例 |
| :--- | :--- |
| `handoffs.label` | `最終コードレビューに提出` |
| `handoffs.agent` | `code_reviewer` |
| `handoffs.prompt` | **`完了した実装（テスト合格済み）のコード変更全体について、品質、セキュリティ、および設計との整合性をレビューしてください。`** |

description : Implement code changes and ensure tests pass.
```yaml
---
description: Generate an implementation plan
tools: [ 'search', 'fetch', 'githubRepo', 'usages' ]
handoffs:
  - label: Start Implementation
    agent: implementation
    prompt: Now implement the plan outlined above.
    send: false
---
```
*解説: レビューエージェントは、セキュリティの脆弱性を特定し、改善点を提案することに特化した専門的な指示を持つことができます。*

この一連のハンドオフを設定することで、お客様の望む「アイデア」から「完成」に至るまでの一貫した、統制の取れた開発ワークフローをAIエージェント間で実現できます。この機能は、開発者に各ステップの**レビューと承認のコントロール**を維持させながら、マルチステップのワークフローをオーケストレーションします。












アイデアから作りたいものを想定して、計画を立てて設計書をつくって、テスト駆動開発で開発するためにテストリストを作って、テストを失敗して、テストを成功させる、そしてものを作るまでをハンドオフで書いてみてください


お客様が想定された、**アイデア出しからTDD（テスト駆動開発）を経由してレビュー完了に至る、高度で連続的な開発ワークフロー**を実現するためのハンドオフ設定を、具体的なYAMLフロントマターの記述例としてご提案します。

このワークフローは、ある専門エージェントから別の専門エージェントへ、**プロンプトとコンテキスト（作業内容）をバトンリレー**することで実現されます。

---

## 高度な開発ワークフローのためのハンドオフ連鎖

この連鎖的なワークフローを調整するために、以下の5つのカスタムエージェントが存在し、順にタスクを引き継ぐと仮定します。

1.  `idea_agent`（アイデア）
2.  `planner`（計画/設計/要件定義）
3.  `failing_tester`（失敗するテスト作成）
4.  `implementation`（実装/成功するテスト）
5.  `code_reviewer`（レビュー/完成）

### Step 1: アイデア → 計画・設計・要件定義

最初のアイデア（チャット履歴のコンテキスト）を、構造化された計画を作成する専門家 (`planner`) に渡します。

#### 移行元: `idea_agent.agent.md` のハンドオフ設定

| 設定項目 | 記述例 |
| :--- | :--- |
| `handoffs.label` | `詳細な計画と設計を開始` |
| `handoffs.agent` | `planner` |
| `handoffs.prompt` | **`このアイデアと目標に基づき、要件定義、高レベル設計、および実装ステップを含む詳細な計画を生成してください。`** |

```yaml
handoffs:
 - label : 詳細な計画と設計を開始
   agent : planner
   prompt : このアイデアと目標に基づき、要件定義、高レベル設計、および実装ステップを含む詳細な計画を生成してください。
   send : false
```

### Step 2: 計画・設計 → TDDでの失敗テスト作成

承認された計画と設計書に基づき、TDDプロセスの最初のステップとして、実装の検証基準となる「失敗するテスト」を作成するエージェント (`failing_tester`) に引き継ぎます。この `planner` エージェントは、通常、偶発的なコード変更を防ぐために読み取り専用ツール (`search`, `fetch` など) のみを使用するように構成されます。

#### 移行元: `planner.agent.md` のハンドオフ設定

| 設定項目 | 記述例 |
| :--- | :--- |
| `handoffs.label` | `TDD: 失敗するテストケースを作成` |
| `handoffs.agent` | `failing_tester` |
| `handoffs.prompt` | **`承認された設計と要件に基づき、これから実装する機能に対応する、現在は失敗するテストコードのリストを作成してください。`** |

```yaml
handoffs:
 - label : TDD: 失敗するテストケースを作成
   agent : failing_tester
   prompt : 承認された設計と要件に基づき、これから実装する機能に対応する、現在は失敗するテストコードのリストを作成してください。
   send : false
```

### Step 3: 失敗するテスト → 実装（テストを成功させる）

失敗するテストが定義された後、そのテストを合格させるための実際のコード実装を、完全な編集能力を持つエージェント (`implementation`) に引き継ぎます。これはソースで示されている「Write Failing Tests → Write Passing Tests」のワークフローに該当します。

#### 移行元: `failing_tester.agent.md` のハンドオフ設定

| 設定項目 | 記述例 |
| :--- | :--- |
| `handoffs.label` | `実装を開始し、テストを合格させる` |
| `handoffs.agent` | `implementation` |
| `handoffs.prompt` | **`直前に提示された失敗テストをすべて合格させるために必要なコード変更を実装し、ファイルに適用してください。`** |

```yaml
handoffs:
 - label : 実装を開始し、テストを合格させる
   agent : implementation
   prompt : 直前に提示された失敗テストをすべて合格させるために必要なコード変更を実装し、ファイルに適用してください。
   send : false
```

### Step 4: 実装（テスト成功） → 完成・最終レビュー

実装が完了し、テストが成功した（ものとして扱われる）後、最終的な品質、セキュリティ、設計の整合性を確認するため、専門的な指示を持つコードレビューエージェント (`code_reviewer`) に引き継ぎます。

#### 移行元: `implementation.agent.md` のハンドオフ設定

| 設定項目 | 記述例 |
| :--- | :--- |
| `handoffs.label` | `最終コードレビューに提出` |
| `handoffs.agent` | `code_reviewer` |
| `handoffs.prompt` | **`完了した実装（テスト合格済み）のコード変更全体について、品質、セキュリティ、および設計との整合性をレビューしてください。`** |

```yaml
handoffs:
 - label : 最終コードレビューに提出
   agent : code_reviewer
   prompt : 完了した実装（テスト合格済み）のコード変更全体について、品質、セキュリティ、および設計との整合性をレビューしてください。
   send : false
```

### まとめ

この連鎖的なハンドオフの仕組みにより、開発者は各ステップ（計画、テスト、実装など）をレビューし、承認するコントロールを維持しながら、AIエージェントの専門的な能力 を活用して、複雑な開発プロセスをスムーズに進行させることができます。これは、一つのタスクを完了したAIが、次のタスクに必要な**明確な指示（プロンプト）**と**コンテキスト**を自動で引き継ぎ、次の専門家（エージェント）にバトンを渡す仕組みです。





お客様のご要望に基づき、以前の会話で構築した**アイデアからTDD（テスト駆動開発）を経て完成に至る**までのマルチステップワークフローを実現するための、具体的なカスタムエージェントのYAMLファイル（`.agent.md`ファイル）を記述します。

これらのファイルは、VS Codeのカスタムエージェントの定義に必要な**YAMLフロントマター**（ヘッダー部分）と、最小限の**ボディ（指示）**で構成されています。

---

## ワークフロー定義ファイル (.agent.md)

### 1. `idea_agent.agent.md` (アイデア生成 → 計画へ)

このエージェントは初期のアイデア出しを担当し、そのコンテキストを次のプランナーに引き継ぎます。

```markdown
---
description : 新しい機能やプロジェクトの初期アイデアと目標を定義します。
name : IdeaGenerator
target : vscode
tools : [ 'search' ] # 初期リサーチ用のツール
handoffs :
 - label : 詳細な計画と設計を開始
   agent : planner
   prompt : このアイデアと目標に基づき、要件定義、高レベル設計、および実装ステップを含む詳細な計画を生成してください。
   send : false
---
# アイデア生成の指示

あなたはプロジェクトのアイデア立案者です。ユーザーの要望を聞き、プロジェクトの主要な目標と初期の要件を整理してください。計画や実装のコード変更は行いません。
```

### 2. `planner.agent.md` (計画・設計 → 失敗テスト作成へ)

計画エージェントは、詳細な計画を立てる役割を持ち、偶発的なコード変更を防ぐために読み取り専用ツールのみを使用します。計画承認後、TDDの次のステップである失敗テスト作成に移行します。

#### 移行元: `planner.agent.md` のハンドオフ設定

```yaml
---
description : 要件定義、高レベル設計、および実装計画を生成します。
name : Planner
target : vscode
tools : [ 'search' , 'fetch' ] # 読み取り専用ツールのみ
handoffs :
 - label : TDD: 失敗するテストケースを作成
   agent : failing_tester
   prompt : 承認された設計と要件に基づき、これから実装する機能に対応する、現在は失敗するテストコードのリストを作成してください。
   send : false
---
# 計画の指示

あなたはソリューションアーキテクトです。ユーザーから引き継がれたコンテキスト（アイデア）に基づき、詳細な実装計画をMarkdownドキュメントとして生成してください。計画には、要件、実装ステップ、およびテストの概要を含める必要があります。コード編集は禁止されています。
```

### 3. `failing_tester.agent.md` (失敗するテスト作成 → 実装へ)

このエージェントは、計画に基づき、実装がまだ完了していないため失敗するテストコードを作成します。その後、そのテストを合格させるための実装エージェントにタスクを引き継ぎます。

#### 移行元: `failing_tester.agent.md` のハンドオフ設定

```yaml
---
description : 承認された計画に基づき、テスト駆動開発（TDD）のための失敗するテストコードを作成します。
name : FailingTester
target : vscode
tools : [ 'search' , 'fetch' ]
handoffs :
 - label : 実装を開始し、テストを合格させる
   agent : implementation
   prompt : 直前に提示された失敗テストをすべて合格させるために必要なコード変更を実装し、ファイルに適用してください。
   send : false
---
# テスト作成の指示

あなたはテストエンジニアです。承認された設計計画に従い、実装が必要な機能に対して、現在失敗する（Failする）テストコードを生成してください。コードを編集してテストを合格させてはいけません。
```

### 4. `implementation.agent.md` (実装 → レビューへ)

実装エージェントは、前のステップで生成された失敗テストを合格させるために、完全な編集能力 (`edit`ツール) を使ってコードを編集します。実装完了後、最終的な品質チェックのためにコードレビューエージェントに移行します。

#### 移行元: `implementation.agent.md` のハンドオフ設定

```yaml
---
description : コード変更を実装し、テストを合格させます。
name : Implementer
target : vscode
tools : [ 'edit' , 'search' ] # 実装のために完全な編集能力が必要
handoffs :
 - label : 最終コードレビューに提出
   agent : code_reviewer
   prompt : 完了した実装（テスト合格済み）のコード変更全体について、品質、セキュリティ、および設計との整合性をレビューしてください。
   send : false
---
# 実装の指示

あなたは開発エンジニアです。直前に提示されたテストをすべて合格させるために必要なコードを実装し、ワークスペース内のファイルに変更を適用してください。
```

### 5. `code_reviewer.agent.md` (レビュー → 完成)

このエージェントは、実装されたコードの品質とセキュリティをチェックする役割を持ち、このワークフローの最終ステップとします。

#### 移行元: `code_reviewer.agent.md` のハンドオフ設定

この例ではワークフローの終点であるため、次のエージェントへのハンドオフは設定しませんが、必要に応じて `handoffs` セクションを追加することで、さらに「ドキュメント化エージェント」や「QAエージェント」にタスクを連鎖させることも可能です。

```yaml
---
description : 実装されたコードのセキュリティ脆弱性、品質、および設計との整合性をレビューします。
name : CodeReviewer
target : vscode
tools : [ 'search' , 'fetch' ] # レビューには読み取りアクセスのみが必要
---
# コードレビューの指示

あなたはセキュリティレビュアー/コード品質担当者です。提示されたコード変更を厳密にレビューし、セキュリティの脆弱性を特定し、改善点を提案することに焦点を当てて動作してください。
```



