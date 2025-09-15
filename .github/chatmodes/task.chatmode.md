---
description: 'タスクリストからタスクを選択し、テスト駆動開発（t-wada方式）でテストリスト作成→レッド→グリーン→リファクタリングのサイクルで実装します。'
tools: ['extensions', 'codebase', 'usages', 'vscodeAPI', 'think', 'problems', 'changes', 'testFailure', 'terminalSelection', 'terminalLastCommand', 'openSimpleBrowser', 'fetch', 'findTestFiles', 'searchResults', 'githubRepo', 'todos', 'runTests', 'runCommands', 'editFiles', 'runNotebooks', 'search', 'new', 'runTasks', 'add_issue_comment', 'cancel_workflow_run', 'create_branch', 'create_issue', 'create_or_update_file', 'create_pull_request', 'create_pull_request_with_copilot', 'create_repository', 'delete_file', 'get_dependabot_alert', 'get_file_contents', 'get_issue', 'get_pull_request', 'get_pull_request_diff', 'get_pull_request_files', 'get_workflow_run', 'list_branches', 'list_dependabot_alerts', 'list_issues', 'list_notifications', 'list_workflow_runs', 'list_workflows', 'mark_all_notifications_read', 'merge_pull_request', 'push_files', 'search_code', 'update_issue', 'sequentialthinking', 'Postgres(LOCAL-supabase)', 'shadcn-ui', 'context7', 'vscode', 'Figma MCP', 'playwright', 'git', 'serena']
---

# テスト駆動開発統合実行モード - VNS masakinihirota特化版

## 実行フロー全体

### Phase 1: タスク準備・選択
1. **プロジェクト状況確認**
   - Serena MCP で現在のプロジェクト状況を確認
   - 設計書（vns-masakinihirota-design）の最新状態を参照
   - devブランチからfeature/task-XXXブランチ作成

2. **タスク選択とサイジング**
   - [タスクリスト](../__task-list/tasks.md)から優先度🔴のタスクを選択
   - **タスクサイズチェック**: 1-2日で完了できる粒度かを検証
   - 大きすぎる場合はサブタスクに分解（必須）
   - GitHub課題として登録（必要に応じて）

### Phase 2: TDD設計フェーズ
3. **テストリスト作成（最重要）**
   - 振る舞いの分析を行い、期待される動作をリストアップ
   - テスト容易性と重要度による優先順位付け
   - 実装詳細ではなく、ユーザーの振る舞いに焦点を当てる

### Phase 3: TDDサイクル実行
4. **レッド→グリーン→リファクタリング**
   - 1つずつテストを書き、実装し、改善する短サイクル
   - 各段階で明確な完了条件を設ける
   - すべてのテストがパスするまで継続

### Phase 4: 完了・ドキュメント化
5. **品質確認と完了処理**
   - テスト・lint・build実行
   - ドキュメント作成（vns-masakinihirota-doc）
   - タスクリスト更新・コミット・PR作成

---

## TDDサイクル詳細

### ステップ1: テストリスト作成（設計フェーズ）
**最重要**: 実装前に必ずテストリストを作成

```typescript
/*
TODO: [コンポーネント名・機能名]
====================================
テスト容易性：高 重要度：高
- [ ] 基本的な表示・動作（固定値でのテスト）
- [ ] 必須パラメータでの基本処理
- [ ] 主要な成功パターン

テスト容易性：中 重要度：高
- [ ] エラー処理・例外ケース
- [ ] バリデーション・境界値
- [ ] ユーザーインタラクション

テスト容易性：低 重要度：中
- [ ] 複雑な統合処理
- [ ] 非同期処理・外部API連携
- [ ] パフォーマンス要件
*/
```

**設計フェーズのルール**:
- 振る舞いベースで期待される動作を整理
- 実装詳細ではなく、外部仕様に焦点
- 簡単で重要度の高いものを上位に配置
- 1つのテストは1-2時間で完了する粒度

### ステップ2: レッドフェーズ（失敗するテストを書く）

**1つずつテストを書く原則**:

```typescript
// React Testing Library + Vitest
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import ComponentName from './ComponentName';

describe('ComponentName', () => {
  it('基本的な表示ができる', () => {
    // Given: 準備
    const testData = { name: 'テスト太郎', id: '123' };

    // When: 実行
    render(<ComponentName data={testData} />);

    // Then: 検証（固定値での検証から始める）
    expect(screen.getByText('テスト太郎')).toBeInTheDocument();
  });
});
```

**レッドフェーズのルール**:
- テストリストから**1つだけ**選択
- 準備・実行・検証を含む完全なテストを作成
- 最初は固定値・静的データでのシンプルなテスト
- アサーションから逆向きに書き進める
- 複数のテストを同時に書かない

### ステップ3: グリーンフェーズ（最小限のコードで成功させる）

**最小実装の原則**:

```typescript
// 最初は固定値から始める
interface ComponentNameProps {
  data: {
    name: string;
    id: string;
  };
}

const ComponentName: React.FC<ComponentNameProps> = ({ data }) => {
  // 最初は固定値をハードコーディング
  return <div>テスト太郎</div>;

  // その後、実データを使用するように進化
  // return <div>{data.name}</div>;
};

export default ComponentName;
```

**グリーンフェーズのルール**:
- テストを成功させる最小限のコードのみ
- 最初は固定値・ハードコーディングでOK
- 過度な設計や早すぎる抽象化を避ける
- テストの変更は基本的にしない
- すべてのテストがパスすることを確認

### ステップ4: リファクタリング（必要に応じて設計改善）

**改善のガイドライン**:
- テストを変更せずに、コードの設計を改善
- 重複の排除、責任の分離
- 変数名・関数名の改善
- 必要以上のリファクタリングは避ける

---

## VNSプロジェクト固有の技術スタック

### 使用技術の統合
- **フレームワーク**: Next.js App Router + Server Components
- **データベース**: Supabase (RLS, Auth)
- **ORM**: Drizzle ORM（型安全なクエリ）
- **バリデーション**: Zod（スキーマバリデーション）
- **UI**: Shadcn/UI + Tailwind CSS
- **テスト**: Vitest + React Testing Library
- **状態管理**: Zustand（必要に応じて）

### 価値観マッチング機能への配慮
- オアシス宣言に基づく安全性の確保
- 個人情報を扱わない設計の徹底
- コロケーション戦略によるファイル配置
- セキュリティファーストの実装

---

## 品質保証・完了チェック

### 各フェーズでの確認項目

**テストリスト作成後**:
- [ ] 振る舞いベースで整理されている
- [ ] テスト容易性と重要度で優先順位付けされている
- [ ] 1つのテストが1-2時間で完了する粒度

**レッドフェーズ後**:
- [ ] 1つのテストが失敗している
- [ ] 準備・実行・検証が含まれている
- [ ] 固定値・静的データでのシンプルなテスト

**グリーンフェーズ後**:
- [ ] テストが成功している
- [ ] 最小限の実装のみ
- [ ] すべてのテストがパス

**リファクタリング後**:
- [ ] コードがよりシンプルになっている
- [ ] テストは変更されていない
- [ ] すべてのテストがパス

### 最終完了チェック
- [ ] `pnpm test` - Vitestテストがすべてパス
- [ ] `pnpm lint` - ESLint/Prettier確認
- [ ] `pnpm build` - ビルド確認
- [ ] タスクリスト更新（チェックマーク追加）
- [ ] vns-masakinihirota-docへの関連ドキュメント作成
- [ ] コミット・PR作成（必要に応じて）

---

## AIへの指示方針

### 許可ベースの明確な指示
```
テストリストを作成してください。振る舞いベースで優先順位を付けてください。
テストリストから1つだけ選んで、固定値での失敗するテストを書いてください。
テストを成功させる最小限のコードを書いてください。ハードコーディングから始めてください。
全テストをパスするコードを書いてください。
```

### テスト保護とガードレール
- テストコードは開発者の許可を得てから修正
- テストをガードレールとして活用
- 段階的なフィードバックを重視
- スコープを現在のタスクに限定

---

## TDDの狙い（t-wada方式）
- **それまで動作していたものは引き続き全て動作する**
- **新しい振る舞いは期待通りに動作する**
- **システムはさらなる変更の準備ができている**
- **プログラマとその同僚は、上記の点に自信を持っている**

---

## エラー対応・反復改善

### 問題発生時の対応
1. **テストエラー**: テストの意図を再確認し、実装を修正
2. **ビルドエラー**: 型安全性・依存関係を確認
3. **スコープ拡大**: 現在のタスクに集中し、将来機能は別タスク化

### 継続的改善
- 各TDDサイクルでの学習をSerena MCPのメモリに記録
- 効果的だったパターンを次のタスクに活用
- 問題のあったアプローチを文書化し、回避策を準備

この統合モードにより、タスク選択からTDD実装、完了まで一貫したワークフローを実現し、VNSプロジェクトの価値観マッチング機能を段階的に構築していきます。
