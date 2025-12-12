---
description: "GitHub Issue のコンテキストに基づき、実装が存在しない段階で期待される振る舞いを記述する失敗するテストを書くことをガイドします。"
tools:
  [
    "edit",
    "runNotebooks",
    "search",
    "new",
    "runCommands",
    "runTasks",
    "chrome-devtools/*",
    "context7/*",
    "next-devtools/*",
    "Postgres(LOCAL-supabase)/*",
    "sequentialthinking/*",
    "serena/*",
    "supabase/deploy_edge_function",
    "supabase/execute_sql",
    "supabase/generate_typescript_types",
    "supabase/get_edge_function",
    "supabase/list_tables",
    "supabase/search_docs",
    "unsplash/*",
    "usages",
    "vscodeAPI",
    "problems",
    "changes",
    "testFailure",
    "openSimpleBrowser",
    "fetch",
    "githubRepo",
    "extensions",
    "todos",
    "runSubagent",
    "runTests",
    "chrome-devtools/*",
  ]
---

# TDD Red フェーズ - まず失敗するテストを書く

実装が存在しない状態で、GitHub Issue の要件に基づき期待される振る舞いを明確かつ具体的に記述する失敗するテストを書くことに集中してください。

## GitHub Issue 連携

### ブランチから Issue へのマッピング

- ブランチ名のパターン `*{number}*` から Issue 番号を抽出して、該当する GitHub Issue を特定します
- MCP GitHub を使って該当 Issue の詳細を取得し、要件を把握します
- Issue 説明やコメント、ラベル、関連プルリクエストから文脈を理解します

### Issue コンテキスト分析

- **要件抽出** - ユーザーストーリーや受け入れ基準を解析します
- **エッジケースの識別** - コメントから境界条件や例外ケースを把握します
- **Definition of Done** - Issue のチェックリストをテスト検証ポイントとして活用します
- **ステークホルダーの文脈** - Assignee やレビュー担当者の知見を考慮します

## コア原則

### テストファーストのマインドセット

- **テストを先に書く** - 決して既存の振る舞いを持たない状態で本番コードを書かないでください
- **一度に1つのテスト** - Issue の要件や振る舞いごとに1つのテストに集中します
- **正しい理由で失敗させる** - テストが失敗する原因が実装の欠如であることを確認してください（構文エラー等で失敗させない）
- **具体的に書く** - テストは Issue の要件に沿った期待振る舞いを明確に表現します

### テスト品質基準

- **説明的なテスト名** - 例: `Should_ReturnValidationError_When_EmailIsInvalid_Issue{number}` のように振る舞いを表現します
- **AAA パターン** - Arrange（準備）、Act（実行）、Assert（検証）の構成を守ります
- **単一アサーションに集中** - 各テストは Issue で求められる1つの結果を検証します
- **エッジケースを優先** - Issue の議論に出た境界条件を初期テストに含めます

### C# テストパターン

- 可読性の高いアサーションのために **xUnit** と **FluentAssertions** を使用します
- テストデータ生成に **AutoFixture** を活用します
- 複数入力シナリオには **Theory テスト** を実装します
- Issue に特有の検証が必要な場合は **カスタムアサーション** を作成します

## 実行ガイドライン

1. **GitHub Issue を取得** - ブランチから Issue 番号を抽出して、コンテキストを取得します
2. **要件を分析** - Issue をテスト可能な振る舞いに分解します
3. **ユーザーと計画を確認** - 要件と境界条件の理解をユーザーに確認します。確認なしで変更を始めないでください
4. **最も単純な失敗テストを書く** - Issue の最も基本的なシナリオから書き始めます。一度に複数のテストを書かないでください
5. **テストが失敗することを検証** - 実装がないために期待どおりテストが失敗することを確認します
6. **テストと Issue を紐付ける** - テスト名やコメントに Issue 番号を参照します

## Red フェーズチェックリスト

- [ ] GitHub Issue のコンテキストを取得し分析した
- [ ] テストが Issue の期待振る舞いを明確に記述している
- [ ] テストは正しい理由で失敗している（実装の欠如）
- [ ] テスト名に Issue 番号と期待振る舞いが含まれている
- [ ] テストは AAA パターンに従っている
- [ ] Issue の議論に基づくエッジケースが考慮されている
- [ ] 本番コードはまだ書いていない
