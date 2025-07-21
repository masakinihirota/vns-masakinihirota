# テストガイド

このドキュメントは、プロジェクトのテスト戦略とベストプラクティスについて説明します。

## テスト構造

テストは以下の階層で構成されています：

```
E2E Tests (Playwright)
├── Integration Tests (Vitest)
│   ├── API Route Tests
│   ├── Database Integration Tests
│   └── Supabase Integration Tests
└── Unit Tests (Vitest + RTL)
    ├── Component Tests
    ├── Hook Tests
    ├── Utility Function Tests
    └── Page Tests
```

## テストユーティリティ

テストユーティリティは `__tests__/utils` ディレクトリに配置されており、以下のモジュールで構成されています：

- `render-helpers.tsx`: コンポーネントのレンダリングに関連するヘルパー関数
- `user-event-helpers.ts`: ユーザーイベントをシミュレートするヘルパー関数
- `test-data-helpers.ts`: テストデータを生成するヘルパー関数
- `test-environment-helpers.ts`: テスト環境を設定するヘルパー関数

これらのユーティリティは `__tests__/utils/index.ts` からエクスポートされており、テストファイルでは以下のようにインポートできます：

```typescript
import { render, userEvent, createTestUser } from "__tests__/utils";
```

## テストの種類

### 単体テスト

単体テストは、個々の関数やコンポーネントを分離してテストします。

```typescript
// 関数のテスト例
import { formatDate } from "@/lib/utils";

describe("formatDate", () => {
  it("正しい形式で日付をフォーマットすること", () => {
    const date = new Date("2023-01-01");
    expect(formatDate(date)).toBe("2023年1月1日");
  });
});

// コンポーネントのテスト例
import { Button } from "@/components/ui/button";
import { render, screen } from "__tests__/utils";

describe("Button", () => {
  it("子要素を正しくレンダリングすること", () => {
    render(<Button>テスト</Button>);
    expect(screen.getByText("テスト")).toBeInTheDocument();
  });
});
```

### 統合テスト

統合テストは、複数のコンポーネントや機能が連携して動作することを確認します。

```typescript
// APIルートのテスト例
import { createClient } from "@/lib/supabase/server";
import { vi } from "vitest";

vi.mock("@/lib/supabase/server");

describe("API統合テスト", () => {
  it("認証済みユーザーのデータを取得できること", async () => {
    // モックの設定
    const mockClient = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: "test-user-id" } },
        }),
      },
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockResolvedValue({
        data: [{ id: "test-profile-id", name: "テストユーザー" }],
      }),
    };

    (createClient as any).mockReturnValue(mockClient);

    // テスト対象のAPIを呼び出す
    const response = await fetch("/api/profile");
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("profile");
    expect(data.profile).toHaveProperty("name", "テストユーザー");
  });
});
```

### E2Eテスト

E2Eテストは、実際のブラウザ環境でアプリケーション全体の動作を確認します。

```typescript
// Playwrightを使用したE2Eテスト例
import { test, expect } from "@playwright/test";

test("ログインフロー", async ({ page }) => {
  // ログインページにアクセス
  await page.goto("/login");

  // フォームに入力
  await page.fill("input[name=email]", "test@example.com");
  await page.fill("input[name=password]", "password");

  // ログインボタンをクリック
  await page.click("button[type=submit]");

  // ダッシュボードにリダイレクトされることを確認
  await expect(page).toHaveURL("/dashboard");

  // ユーザー名が表示されることを確認
  await expect(page.locator(".user-name")).toContainText("テストユーザー");
});
```

## テストのベストプラクティス

### 1. テストの分離

各テストは独立して実行できるようにしてください。テスト間で状態を共有しないでください。

```typescript
// 良い例
describe("Counter", () => {
  it("初期値が0であること", () => {
    render(<Counter />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("ボタンをクリックすると値が増加すること", () => {
    render(<Counter />);
    userEvent.click(screen.getByText("+"));
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});

// 悪い例（テスト間で状態を共有）
describe("Counter", () => {
  let container;

  beforeEach(() => {
    container = render(<Counter />);
  });

  it("初期値が0であること", () => {
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("ボタンをクリックすると値が増加すること", () => {
    userEvent.click(screen.getByText("+"));
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});
```

### 2. テストの可読性

テストは明確で理解しやすいものにしてください。テストの目的が一目でわかるようにしてください。

```typescript
// 良い例
it("無効なメールアドレスを入力するとエラーメッセージが表示されること", async () => {
  render(<LoginForm />);
  await userEvent.type(screen.getByLabelText("メールアドレス"), "invalid-email");
  await userEvent.click(screen.getByText("ログイン"));
  expect(screen.getByText("有効なメールアドレスを入力してください")).toBeInTheDocument();
});

// 悪い例
it("エラーチェック", async () => {
  render(<LoginForm />);
  const input = screen.getAllByRole("textbox")[0];
  await userEvent.type(input, "invalid-email");
  const buttons = screen.getAllByRole("button");
  await userEvent.click(buttons[0]);
  expect(screen.getByText(/有効な/)).toBeInTheDocument();
});
```

### 3. テストの網羅性

重要なコードパスをすべてテストするようにしてください。特に、エラーケースや境界条件を忘れないでください。

```typescript
// 良い例
describe("divide関数", () => {
  it("正の数で割り算ができること", () => {
    expect(divide(10, 2)).toBe(5);
  });

  it("負の数で割り算ができること", () => {
    expect(divide(10, -2)).toBe(-5);
  });

  it("0で割るとエラーをスローすること", () => {
    expect(() => divide(10, 0)).toThrow("0で割ることはできません");
  });
});
```

### 4. モックの適切な使用

外部依存関係は適切にモック化してください。ただし、過剰なモック化は避けてください。

```typescript
// 良い例（外部APIのモック）
it("ユーザーデータを取得できること", async () => {
  // 外部APIをモック化
  vi.spyOn(global, "fetch").mockResolvedValue({
    ok: true,
    json: async () => ({ id: "user-1", name: "テストユーザー" }),
  } as Response);

  const { result } = renderHook(() => useUser("user-1"));
  await waitFor(() => expect(result.current.isSuccess).toBe(true));

  expect(result.current.data).toEqual({ id: "user-1", name: "テストユーザー" });
});

// 悪い例（過剰なモック化）
it("ユーザーデータを表示できること", async () => {
  // コンポーネント内部の実装詳細をモック化（脆弱なテスト）
  vi.spyOn(UserComponent.prototype, "fetchData").mockImplementation(() => {
    this.setState({ user: { id: "user-1", name: "テストユーザー" } });
  });

  render(<UserComponent userId="user-1" />);
  expect(screen.getByText("テストユーザー")).toBeInTheDocument();
});
```

### 5. テストの高速化

テストは可能な限り高速に実行できるようにしてください。特に、不要なセットアップや非同期処理を避けてください。

```typescript
// 良い例（必要なセットアップのみ）
it("ユーザー名を表示すること", () => {
  render(<UserProfile user={{ name: "テストユーザー" }} />);
  expect(screen.getByText("テストユーザー")).toBeInTheDocument();
});

// 悪い例（不要なセットアップ）
it("ユーザー名を表示すること", () => {
  // テストに関係のない複雑なセットアップ
  const store = configureStore({
    reducer: {
      user: userReducer,
      posts: postsReducer,
      comments: commentsReducer,
    },
  });

  render(
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <UserProfile user={{ name: "テストユーザー" }} />
        </Router>
      </ThemeProvider>
    </Provider>
  );

  expect(screen.getByText("テストユーザー")).toBeInTheDocument();
});
```

## テストの実行

テストは以下のコマンドで実行できます：

- 全てのテスト: `npm run test`
- 単体テストのみ: `npm run test:unit`
- 統合テストのみ: `npm run test:integration`
- E2Eテストのみ: `npm run test:e2e`
- 並列実行: `npm run test:parallel`
- カバレッジレポート: `npm run test:coverage`

## テストのデバッグ

テストのデバッグには以下の方法が使用できます：

1. `console.log`を使用する
2. `test.only`または`it.only`を使用して特定のテストのみを実行する
3. `vitest --ui`を使用してVitestのUIモードを使用する
4. `npm run test:e2e:debug`を使用してPlaywrightのデバッグモードを使用する

## テストカバレッジ

テストカバレッジの目標は以下の通りです：

- 関数・メソッド: 90%以上
- 分岐: 85%以上
- 行: 90%以上

カバレッジレポートは `npm run test:coverage` で生成できます。
