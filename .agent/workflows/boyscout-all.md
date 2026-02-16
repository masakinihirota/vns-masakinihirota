---
description: src/components 以下の全コンポーネントディレクトリに対して、順次ボーイスカウトルールを適用します。
---

# Boy Scout All Workflow

このワークフローは、`src/components` ディレクトリ内のすべてのコンポーネントに対して、個別に `boyscout` ワークフロー（監査・修正）を実行するためのメタワークフローです。
大規模な変更を一度に行うのではなく、コンポーネント単位で着実に品質を向上させることを目的としています。

# 手順

## 1. コンポーネント一覧の取得

まず、対象となるコンポーネントディレクトリを特定します。

- **推奨コマンド (PowerShell)**:
  ```powershell
  Get-ChildItem src/components -Directory | Select-Object -ExpandProperty Name
  ```
- **差分モード (Optional)**:
  変更があったコンポーネントのみを対象にする場合は、Gitの差分を利用します。
  ```powershell
  git diff --name-only main...HEAD | ForEach-Object { if ($_ -match '^src/components/([^/]+)/') { $matches[1] } } | Select-Object -Unique
  ```

## 2. 各コンポーネントへの適用 (Iterative Execution)

特定された各ディレクトリ（例: `ui`, `features`, `layout` 等）に対して、以下の手順を**一つずつ**実行してください。
**並列実行は禁止**です。一つずつ確実に完了させてください。

### 実行ループ

各コンポーネント `[ComponentName]` に対して：

1.  **タスク境界の設定 (Task Boundary)**
    - `task_boundary` ツールを使用して、現在の作業対象を明確にします。
    - TaskName: `Boy Scout: [ComponentName]`
    - TaskStatus: `Auditing and cleaning up [ComponentName]`

2.  **ボーイスカウトルールの適用**
    - 以下のワークフローファイルを読み込み、指示に従って実行してください。
    - 参照ファイル: `.agent/workflows/boyscout.md`
    - 主なチェック項目:
        - 構造と配置・開発ダッシュボード登録
        - 自動化ツール (`oxlint`, `test`)
        - ルール適合性 (a11y, Security)
        - クリーンアップ (未使用コード削除, 型修正)

3.  **エラーハンドリング**
    - コンポーネント内で解決困難なエラー（型エラーやテスト落ち）が見つかった場合：
        - 無理に修正しようとせず、そのエラー内容を `audit_log.txt` (またはメモ) に記録してください。
        - そのコンポーネントの作業を切り上げ、次のコンポーネントへ進んでください。
        - **"Stop the world" (全停止) は避けてください。**

## 3. App層のチェック (Page Structure Check)

`src/components` の全チェック完了後、`src/app` ディレクトリも簡易チェックします。

- **チェック項目**:
    - `page.tsx` に複雑なロジックや直接的なデータフェッチが書かれていないか？
    - `src/components` への委譲ができているか？
    - `src/proxy.ts` で処理すべきリクエスト介入が混ざっていないか？

## 4. 完了報告

全てのチェックが完了したら、以下の内容を含むサマリーをユーザーに報告してください。

1. **修正したコンポーネント数**: (例: 12 components processed)
2. **主な修正内容**: (例: Removed unused imports, fixed 3 a11y issues, registered 2 new pages to dashboard)
3. **未解決の課題**: (監査で見つかったが修正をスキップした重大な問題)

# 注意点

- **時間配分**: コンポーネント数が多い場合、非常に時間がかかります。適宜 `notify_user` で途中経過を報告することを検討してください（特にユーザーからの応答待ちが発生しそうな場合）。
- **変更の安全性**: 機能変更や大規模リファクタリングは行わず、あくまで「掃除（Cleanup）」に留めてください。
