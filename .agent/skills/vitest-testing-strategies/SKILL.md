---
name: vitest-testing-strategies
description: VitestとReact Testing Libraryを使用したテストのベストプラクティス。安定性、正しいモック、統合テストパターンに焦点を当てています。
---

# Vitest Testing Strategies

このスキルは、Vitestを使用して堅牢で壊れにくいテストを作成するための戦略を概説します。特に、モックや環境の差異に関する一般的な問題の解決に焦点を当てています。

## 1. モック戦略 (Mocking Strategies)

### `vi.spyOn` vs `vi.mock`

- **`vi.spyOn` を使用する場合**: _既存のオブジェクト_（`localStorage`、`window`、クラスインスタンスなど）のメソッドをモックし、後で元に戻したい場合。
- **`vi.mock` を使用する場合**: _モジュール_ インポート全体を置き換えたい場合。

### `localStorage` のモック

`localStorage` は jsdom で利用可能ですが、状態検証のために明示的なモックが必要な場合があります：

```typescript
// 手動でモックオブジェクトを定義するよりも良い方法
const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

// Act
userEvent.click(button);

// Assert
expect(setItemSpy).toHaveBeenCalledWith('key', 'value');
```

## 2. 統合テストパターン (RGR + AAA)

**AAA** (Arrange, Act, Assert) パターンを厳密に守ってください。

```typescript
describe("Feature Integration", () => {
  it("should save data on submit", async () => {
    // Arrange (準備)
    const user = userEvent.setup();
    render(<MyComponent />);

    // Act (実行)
    await user.type(screen.getByRole("textbox"), "Hello");
    await user.click(screen.getByRole("button", { name: "Save" }));

    // Assert (検証)
    expect(await screen.findByText("Success")).toBeInTheDocument();
  });
});
```

## 3. 外部依存の処理 (Supabaseなど)

内部実装の詳細をモックすることは避けてください。境界（Boundaries）でモックします。
Supabaseクライアントコンポーネントフックの場合：

```typescript
import * as SupabaseHooks from "@/lib/supabase/client";

// テストセットアップにて
vi.mock("@/lib/supabase/client", () => ({
  createClient: vi.fn(() => mockSupabaseClient),
}));
```

## 4. 一般的な問題と修正 (Common Issues & Fixes)

- **モックでの "Module not found"**: `vi.mock` のパスがインポートパスと完全に一致しているか確認してください（エイリアス vs 相対パス）。
- **巻き上げ (Hoisting)**: `vi.mock` は巻き上げられます。`vi.mock` 実装内で使用される変数は、グローバルでない限り、慎重に参照するか、ファクトリー内で定義する必要があります。
- **Act 警告**: すべての非同期インタラクション（userEvent, revalidations）が await されていることを確認してください。

## 5. アクセシビリティテスト (Accessibility Testing)

コンポーネントテストには必ず axe チェックを含めてください。

```typescript
import { axe } from "vitest-axe";

it("should have no violations", async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```
