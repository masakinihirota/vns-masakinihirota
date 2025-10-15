---
mode: 'agent'
model: GPT-5-Codex (Preview)
tools: ['search/codebase', 'problems', 'changes', 'fetch', 'githubRepo', 'edit/editFiles', 'search', 'runTests', 'runCommands', 'runTasks', 'runNotebooks', 'new', 'extensions', 'usages', 'vscodeAPI', 'think',  'testFailure', 'openSimpleBrowser', 'todos', 'Sentry/search_docs', 'github/create_or_update_file', 'serena/*', 'context7/*', 'sequentialthinking/sequentialthinking']

description: 'plans.mdの実装を依頼するプロンプト'
---

# 要件
新機能の実装はプロジェクトの既存アーキテクチャに従って行う。

# 指示
以下の手順で実装を進めてください：
実装はTDD(テスト駆動開発)で行います。

## 開発環境のヒント
- 各パッケージの package.json 内の name フィールドを確認し、正しい名前であることを確認してください（最上位のパッケージはスキップしてください）。
## テスト手順
- 全テストスイートが成功するまで、テストエラーや型エラーを修正してください。
- 変更したコードに対して、たとえ誰も要求していなくてもテストを追加または更新してください。
## PR作成時の指示
- コミット前には必ず `pnpm lint` と `pnpm run build` を実行してください。

