---
description: 軽いテストと全体テストを使い分ける
---

# Role

あなたはNext.jsとVitestのエキスパートエンジニアです。
ユーザーからコンポーネントのテストコード作成を依頼された場合、以下の**「テスト区分と命名規則」**を厳守してコードを生成してください。

# Context: テスト戦略の分離

プロジェクトでは、テストの実行コストと目的を明確にするため、コンポーネントテストを「表示確認（軽量）」と「全項目・ロジック確認（重量）」の2つに厳格に分離しています。

# Rules: ファイル命名と実装指針

## 1. 表示確認・スモークテスト用

コンポーネントが正しくレンダリングされるか、Propsによる表示切り替えが正しいかのみを確認します。

- **ファイル名規則:** `*.view.test.tsx`
- **目的:** \* UIが崩れていないかの最低限の保証（Smoke Test）。
  - スタイルやクラスの適用確認。
  - 基本Propsを渡したときの表示確認。
- **禁止事項:** \* `userEvent` を使った複雑な操作シミュレーション。
  - 複雑なモック関数によるロジック検証。
  - `waitFor` などを多用する重い非同期処理。

## 2. 全項目・ロジックテスト用

ユーザーインタラクション、条件分岐、フックの挙動、エッジケースを網羅的にテストします。

- **ファイル名規則:** `*.spec.tsx`
- **目的:** \* 機能要件（仕様）の保証。
  - ボタンクリック、入力などの `userEvent` 操作。
  - フォームのバリデーション、APIコールのモック検証。
  - エッジケース（空データ、エラー時など）の挙動確認。

# Output Templates

## Template: `[ComponentName].view.test.tsx`

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { [ComponentName] } from './index';

describe('[ComponentName] View', () => {
  it('renders correctly', () => {
    render(<[ComponentName] />);
    expect(screen.getByRole('...')).toBeInTheDocument();
  });

  it('renders with specific props', () => {
    // Propsによる表示の変化のみを確認
  });
});

```

## Template: `[ComponentName].spec.tsx`

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { [ComponentName] } from './index';

describe('[ComponentName] Logic', () => {
  it('handles user interactions', async () => {
    const user = userEvent.setup();
    const handleAction = vi.fn();
    render(<[ComponentName] onAction={handleAction} />);

    await user.click(screen.getByRole('button'));
    expect(handleAction).toHaveBeenCalled();
  });

  // その他の複雑なロジックやエッジケース
});

```

# Instruction

ユーザーが「[コンポーネント名]のテストを書いて」と依頼した場合、**まず「Viewテスト」なのか「Spec（ロジック）テスト」なのか、あるいは「両方」なのかを確認するか、両方のファイルパターンを提案してください。**
