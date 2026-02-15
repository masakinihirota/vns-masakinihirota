---
name: test-workflow
description: TDDサイクル、テスト戦略、シナリオ生成を包括したテスト自動化スキル。新機能開発やバグ修正時に必ず使用します。
---

# Test Workflow Skill (Testing & TDD)

このスキルは、高品質なコードを維持するためのテスト駆動開発 (TDD) ワークフロー、テスト戦略、およびシナリオ生成ガイドラインを統合したものです。

## 1. TDD Workflow (基本フロー)

新機能開発やバグ修正は、必ず以下の **Red-Green-Refactor** サイクルに従って進めます。

### step 1: 失敗するテストを書く (Red)
1.  **シナリオ生成**: 実装する機能の要件に基づき、網羅的なテストシナリオを定義します（後述の「Scenario Generation」参照）。
2.  **テスト実装**: `*.test.tsx` (UI) または `*.test.ts` (Logic) に、まだ実装されていない機能のテストを記述します。
3.  **確認**: テストを実行し、期待通りに失敗することを確認します。

### step 2: 最小限の実装を行う (Green)
1.  **実装**: テストを通過させるための最小限のコードを書きます。
2.  **確認**: テストを実行し、全て成功することを確認します。

### step 3: リファクタリング (Refactor)
1.  **改善**: テストが通っている状態で、コードの重複排除、可読性向上、構造改善を行います。
2.  **確認**: リファクタリング後もテストが成功し続けることを確認します。

## 2. Testing Strategies (テスト戦略)

Vitest と React Testing Library を使用した推奨プラクティスです。

### UI Components (`*.test.tsx`)
- **ユーザー視点**: 実装の詳細（stateの中身など）ではなく、ユーザーが見るもの（テキスト、ボタン）や操作（クリック）をテストします。
- **アクセシビリティ**: `vitest-axe` を使用し、`expect(container).toHaveNoViolations()` を必ず含めます。
- **インタラクション**: `userEvent` を使用して、実際のユーザー操作をシミュレートします。

```tsx
it('should submit form when valid', async () => {
  const user = userEvent.setup()
  render(<LoginForm />)

  await user.type(screen.getByLabelText('Email'), 'test@example.com')
  await user.click(screen.getByRole('button', { name: 'Login' }))

  expect(onSubmit).toHaveBeenCalled()
})
```

### Business Logic (`*.logic.test.ts`)
- **純粋関数**: 可能な限り副作用のない純粋関数として実装し、入出力のパターンを網羅的にテストします。
- **境界値分析**: 最大値、最小値、空文字、null/undefined などのエッジケースを重点的にテストします。

### Integration (`*.logic.integration.test.ts`)
- **データフロー**: DB接続やAPI通信を含むフローを検証します（必要に応じてモックサーバー `msw` を使用）。

## 3. Scenario Generation (シナリオ生成ガイドライン)

テストを書く前に、以下の観点でリストアップを行います。

1.  **正常系 (Happy Path)**: 基本的な成功パターン。
2.  **異常系 (Error Handling)**: バリデーションエラー、APIエラー、ネットワーク切断。
3.  **境界値 (Boundary)**: 0, 負数, 最大文字数, 空リスト。
4.  **状態遷移**: ローディング中、空データ表示、成功メッセージ、エラーメッセージ。
5.  **アクセシビリティ**: キーボード操作、スクリーンリーダー対応、コントラスト。

## 4. 命名規則と配置

詳細は [Vitest Naming Rules](./rules/naming.md) を参照してください。

| テスト種別 | ファイル名 |
| :--- | :--- |
| 表示確認・スモークテスト | `src/components/**/[Name].view.test.tsx` |
| 全項目・ロジックテスト | `src/components/**/[Name].spec.tsx` |
| ロジック単体テスト | `src/components/**/[Name].logic.test.ts` |
| 結合テスト | `src/components/**/[Name].logic.integration.test.ts` |
