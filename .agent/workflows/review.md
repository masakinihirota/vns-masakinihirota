---
description: Review 指示書
---

このワークフローは、指定されたコードや変更に対して、徹底的なレビューを行うための手順書です。
単なる指摘にとどまらず、具体的な修正案や改善の方向性を提示し、コード品質を高めることを目的とします。

## 1. 準備 (Preparation)

レビューを開始する前に、以下のスキルファイルを確認し、レビューの観点を整理してください。
特にセキュリティとデータベース関連は厳格にチェックする必要があります。

- [ ] [code-review](file:///u:/2026src/vns-masakinihirota.worktrees/anti/.agent/skills/code-review/SKILL.md)
- [ ] [security-review](file:///u:/2026src/vns-masakinihirota.worktrees/anti/.agent/skills/security-review/SKILL.md)
- [ ] [supabase-postgres-best-practices](file:///u:/2026src/vns-masakinihirota.worktrees/anti/.agent/skills/postgres-best-practices/SKILL.md) (DB関連の場合)
- [ ] [coding-standards](file:///u:/2026src/vns-masakinihirota.worktrees/anti/.agent/skills/coding-standards/SKILL.md)

## 2. レビュー実行 (Execution)

対象ファイルまたはディレクトリに対して、以下の観点でチェックを行ってください。

### 2.1 構造と設計 (Structure & Design)

- **コンポーネントの配置**: `src/components/<feature>/` に関連ファイル（UI, Logic, Test）がまとまっているか（Collocation）。
- **依存関係**: ページコンポーネント (`src/app/**/page.tsx`) が直接データフェッチを行っていないか（Logicへの委譲）。
- **責務の分離**: ビジネスロジックがUIから分離されているか。カスタムフックや `*.logic.ts` を活用しているか。

### 2.2 コード品質 (Code Quality)

- **型安全性**: `any` 型の使用を避け、適切な型定義がなされているか。
- **命名規則**: 変数名、関数名が分かりやすく、プロジェクトの命名規則（kebab-case for files, PascalCase for components, etc.）に従っているか。
- **エラーハンドリング**: `try-catch` が適切に使用され、ユーザーへのフィードバックが考慮されているか。
- **コメント**: 複雑なロジックには、日本語でdocstringやコメントが記述されているか。

### 2.3 セキュリティ (Security)

- **インジェクション対策**: SQLインジェクションやXSSの脆弱性がないか。
- **認証・認可**: 適切な権限チェック（RLS, Auth Policies）が行われているか。
- **機密情報**: APIキーやシークレットがハードコードされていないか。

### 2.4 パフォーマンス (Performance)

- **レンダリング**: 不要な再レンダリングが発生していないか（`useMemo`, `useCallback` の適切な使用）。
- **データ取得**: N+1問題や過剰なデータ取得がないか。

### 2.5 テスト (Tests)

- **テストの存在**: 重要なロジックやコンポーネントに対するテストが含まれているか。
- **カバレッジ**: エッジケースやエラー系も考慮されているか。

## 3. レポート作成 (Reporting)

発見された問題点について、以下の形式でレポートを出力してください。

### 指摘事項フォーマット

**[重要度] ファイル名:行番号**

- **問題点**: 何が問題なのかを具体的に記述。
- **影響**: バグ、パフォーマンス低下、セキュリティリスクなど。
- **修正案**: 具体的なコード修正例や改善方針。

**重要度の定義**:

- 🔴 **Critical**: システム停止、データ損失、セキュリティホールなど、即時修正が必要。
- 🟠 **Major**: 機能不全、重大なバグ、パフォーマンスの著しい低下。
- 🟡 **Minor**: 軽微なバグ、使い勝手の悪さ、可読性の低下。
- 🔵 **Info**: 改善提案、質問、確認事項。

## 4. 完了条件 (Definition of Done)

- [ ] すべての指摘事項が明確に文書化されていること。
- [ ] 重大な問題については、具体的な修正コードが提示されていること。
- [ ] レビュー結果がユーザーに共有されていること。
