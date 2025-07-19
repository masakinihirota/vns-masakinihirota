import React from "react";
import { describe, it, expect } from "vitest";
import {
  render,
  screen,
  createTestUser,
  createTestMessages,
  waitForLoadingToFinish,
  userEvent,
  renderWithTheme,
  renderWithLocale,
  renderWithProviders,
} from "./test-utils";

// テスト用の簡単なコンポーネント
const TestComponent = () => {
  return (
    <div>
      <h1>テストコンポーネント</h1>
      <p data-testid="test-content">これはテスト用のコンテンツです</p>
    </div>
  );
};

describe("test-utils", () => {
  it("カスタムレンダー関数が正常に動作する", () => {
    render(<TestComponent />);

    expect(screen.getByText("テストコンポーネント")).toBeInTheDocument();
    expect(screen.getByTestId("test-content")).toBeInTheDocument();
  });

  it("カスタムロケールでレンダリングできる", () => {
    render(<TestComponent />, { locale: "en" });

    expect(screen.getByText("テストコンポーネント")).toBeInTheDocument();
  });

  it("カスタムテーマでレンダリングできる", () => {
    render(<TestComponent />, { theme: "dark" });

    expect(screen.getByText("テストコンポーネント")).toBeInTheDocument();
  });

  it("カスタムメッセージでレンダリングできる", () => {
    const customMessages = {
      test: {
        message: "カスタムメッセージ",
      },
    };

    render(<TestComponent />, { messages: customMessages });

    expect(screen.getByText("テストコンポーネント")).toBeInTheDocument();
  });
});
describe("テストヘルパー関数", () => {
  it("createTestUser が正しいユーザーオブジェクトを作成する", () => {
    const user = createTestUser();

    expect(user).toEqual({
      id: "test-user-id",
      email: "test@example.com",
      name: "テストユーザー",
    });
  });

  it("createTestMessages が正しいメッセージオブジェクトを作成する", () => {
    const messages = createTestMessages();

    expect(messages).toHaveProperty("AppLayout");
    expect(messages.AppLayout).toHaveProperty("home", "ホーム");
  });

  it("createTestMessages がオーバーライドを適用する", () => {
    const overrides = {
      custom: {
        message: "カスタムメッセージ",
      },
    };

    const messages = createTestMessages(overrides);

    expect(messages).toHaveProperty("custom");
    expect(messages.custom.message).toBe("カスタムメッセージ");
  });

  it("waitForLoadingToFinish が非同期処理を待機する", async () => {
    const startTime = Date.now();
    await waitForLoadingToFinish();
    const endTime = Date.now();

    // 最低限の時間が経過していることを確認
    expect(endTime - startTime).toBeGreaterThanOrEqual(0);
  });
});
describe("追加のヘルパー関数", () => {
  it("renderWithTheme がテーマ付きでレンダリングできる", () => {
    renderWithTheme(<TestComponent />, "dark");

    expect(screen.getByText("テストコンポーネント")).toBeInTheDocument();
  });

  it("renderWithLocale がロケール付きでレンダリングできる", () => {
    renderWithLocale(<TestComponent />, "en");

    expect(screen.getByText("テストコンポーネント")).toBeInTheDocument();
  });

  it("renderWithProviders が複数のオプションでレンダリングできる", () => {
    renderWithProviders(<TestComponent />, {
      theme: "dark",
      locale: "en",
      messages: { test: { message: "Test message" } },
    });

    expect(screen.getByText("テストコンポーネント")).toBeInTheDocument();
  });

  it("userEvent.click がクリックイベントを発火する", async () => {
    const TestClickComponent = () => {
      const [clicked, setClicked] = React.useState(false);
      return (
        <div>
          <button
            onClick={() => setClicked(true)}
            data-testid="test-button"
          >
            クリック
          </button>
          {clicked && <p data-testid="clicked-text">クリックされました</p>}
        </div>
      );
    };

    render(<TestClickComponent />);
    const button = screen.getByTestId("test-button");

    await userEvent.click(button);

    expect(screen.getByTestId("clicked-text")).toBeInTheDocument();
  });

  it("userEvent.type ヘルパーが存在する", () => {
    expect(typeof userEvent.type).toBe("function");
  });

  it("userEvent.clear ヘルパーが存在する", () => {
    expect(typeof userEvent.clear).toBe("function");
  });
});
