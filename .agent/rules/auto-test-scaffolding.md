---
globs:
alwaysApply: true
---

# テストファイル自動生成ルール (Auto Test Scaffolding)

AIは、UIコンポーネントやロジックファイルを**新規作成・修正**する際、対応するテストファイルが存在しない場合、自動的にテストのスケルトンを生成しなければならない。

## 適用条件

以下のいずれかに該当する場合、テストスケルトンを生成する：

1. **新規コンポーネント作成時**: `*.tsx` を `src/components/` 配下に新規作成した場合、同ディレクトリに `*.test.tsx` を生成
2. **新規ロジック作成時**: `*.logic.ts` を新規作成した場合、`*.logic.test.ts` を生成
3. **既存ファイル修正時**: 修正対象のコンポーネント/ロジックにテストファイルが存在しない場合、スケルトンを生成（ボーイスカウトルール準拠）

## 除外条件

以下は対象外とする：

- `src/components/ui/` 配下（Shadcn UI等の外部ライブラリ由来）
- `index.ts`（バレルファイル）
- `*.container.tsx`（コンテナコンポーネント、UIテストの対象外）
- 型定義のみのファイル（`*.types.ts`）

## 生成内容

### UIコンポーネント（`*.test.tsx`）

必ず以下を含める：

1. **基本レンダリングテスト**: コンポーネントがクラッシュせずレンダリングされること
2. **アクセシビリティテスト**: `vitest-axe` の `toHaveNoViolations` アサーション
3. **モックスケルトン**: `use client` コンポーネントの外部依存（Supabase、next/navigation等）の `vi.mock()`

### ロジック（`*.logic.test.ts`）

1. **エクスポート関数ごとの基本テスト**
2. **エッジケースのTODOコメント**

## テスト記述規約（必須）

- テストフレームワーク: **Vitest + React Testing Library**
- テスト構造: `describe` でコンポーネント/関数名、`it` で具体的な振る舞い
- テストケース名: **日本語**で記述
- パターン: **AAA パターン**（Arrange・Act・Assert）を明確に分離
- アクセシビリティ: `vitest-axe` チェック必須

## テンプレート

```typescript
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it, vi } from "vitest";
import { ComponentName } from "./component-name";

// 外部依存のモック
vi.mock("@/lib/supabase/client", () => ({
  createClient: vi.fn(() => ({
    auth: { signInAnonymously: vi.fn() },
  })),
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

describe("ComponentName", () => {
  it("正常にレンダリングされる", () => {
    // Arrange & Act
    const { container } = render(<ComponentName />);

    // Assert
    expect(container).toBeTruthy();
  });

  it("アクセシビリティ違反がない", async () => {
    // Arrange
    const { container } = render(<ComponentName />);

    // Act
    const results = await axe(container);

    // Assert
    expect(results).toHaveNoViolations();
  });
});
```

## 重要な注意事項

- テストは **RED（失敗）状態でも許容**。目的はテストの土台を作ること。
- 生成後、`npx vitest run <テストファイルパス>` で構文エラーがないことを確認する。
- 既存テストがある場合は上書きしない。
