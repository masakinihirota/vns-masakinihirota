---
trigger: always_on
---

# Accessibility Rules (vitest-axe)

Antigravity（AIエージェント）は、UIコンポーネントを作成または修正する際、必ず以下のルールに従ってアクセシビリティテストを実装しなければなりません。

## 1. 原則

- **全てのUIコンポーネント**（Button, Input, Modal, Page全体など）に対して、`vitest-axe` によるアクセシビリティチェックを行うこと。
- テストは「違反がないこと (`toHaveNoViolations`)」をアサーションとして含めること。
- 新規作成時だけでなく、既存コンポーネントの修正時にも、アクセシビリティテストが存在しない場合は追加すること。

## 2. テスト実装テンプレート

`*.test.tsx` ファイルには、以下のパターンでテストを追加してください。
`vi.mock` などが必要な場合でも、`render` した結果の `container` を `axe` に渡す基本形は変わりません。

```typescript
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { ComponentName } from './component-name'; // 対象コンポーネント
describe('ComponentName Accessibility', () => {
  it('should have no accessibility violations', async () => {
    // Arrange
    const { container } = render(<ComponentName />);
    // Act
    const results = await axe(container);
    // Assert
    expect(results).toHaveNoViolations();
  });
});
```

## 3. 注意点

- **非同期処理**: `axe(container)` は非同期関数です。必ず `await` してください。
- **動的コンテンツ**: モーダルやドロップダウンなど、ユーザー操作後に表示される要素についても、操作後の状態で `axe` チェックを行うことが望ましいです。
- **Form要素**: ラベル (`aria-label`, `htmlFor`など) が不足しているとエラーになります。コンポーネント設計段階でPropsとしてラベルを受け取れるようにしてください。

## 4. エラーが出た場合の対処

- エラーメッセージに具体的な違反内容（例: "Elements must have sufficient color contrast"）が表示されます。
- 単に `aria-hidden="true"` で逃げるのではなく、可能な限り根本的な解決（コントラスト比の改善、適切なラベル付け）を行ってください。
