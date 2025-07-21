/**
 * テストユーティリティのテスト
 *
 * このファイルは、テストユーティリティ自体のテストを行います。
 * テストユーティリティが正しく動作することを確認します。
 */

import { describe, it, expect, vi } from "vitest";
import React from "react";
import {
  render,
  renderWithTheme,
  renderWithLocale,
  renderWithProviders,
  screen,
} from "./utils";
import { userEvent } from "./utils";
import {
  createTestUser,
  createTestProfile,
  createTestWork,
  createTestSkill,
  createTestGroup,
  createTestDataArray,
} from "./utils";
import {
  suppressConsoleError,
  suppressConsoleWarning,
  setTestWindowSize,
  setTestMediaQuery,
} from "./utils";

// テスト用のシンプルなコンポーネント
const TestComponent = ({
  text = "テストコンポーネント",
  onClick = () => {},
}: {
  text?: string;
  onClick?: () => void;
}) => {
  return <button onClick={onClick}>{text}</button>;
};

describe("レンダリングヘルパー", () => {
  it("render関数が正しく動作すること", () => {
    render(<TestComponent />);
    expect(screen.getByText("テストコンポーネント")).toBeInTheDocument();
  });

  it("renderWithTheme関数が正しく動作すること", () => {
    renderWithTheme(<TestComponent />, "dark");
    expect(screen.getByText("テストコンポーネント")).toBeInTheDocument();
    // テーマの検証は実装に依存するため、ここでは基本的な動作のみ確認
  });

  it("renderWithLocale関数が正しく動作すること", () => {
    renderWithLocale(<TestComponent />, "en");
    expect(screen.getByText("テストコンポーネント")).toBeInTheDocument();
    // ロケールの検証は実装に依存するため、ここでは基本的な動作のみ確認
  });

  it("renderWithProviders関数が正しく動作すること", () => {
    renderWithProviders(<TestComponent />, {
      theme: "dark",
      locale: "en",
    });
    expect(screen.getByText("テストコンポーネント")).toBeInTheDocument();
  });
});

describe("ユーザーイベントヘルパー", () => {
  it("userEvent.click関数が正しく動作すること", async () => {
    const handleClick = vi.fn();
    render(<TestComponent onClick={handleClick} />);
    const button = screen.getByText("テストコンポーネント");

    await userEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("userEvent.type関数が正しく動作すること", async () => {
    render(<input data-testid="test-input" />);
    const input = screen.getByTestId("test-input") as HTMLInputElement;

    await userEvent.type(input, "テストテキスト");

    expect(input.value).toBe("テストテキスト");
  });

  it("userEvent.clear関数が正しく動作すること", async () => {
    render(
      <input
        data-testid="test-input"
        defaultValue="初期値"
      />,
    );
    const input = screen.getByTestId("test-input") as HTMLInputElement;

    expect(input.value).toBe("初期値");
    await userEvent.clear(input);

    expect(input.value).toBe("");
  });
});

describe("テストデータヘルパー", () => {
  it("createTestUser関数が正しく動作すること", () => {
    const user = createTestUser();

    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("email");
    expect(user).toHaveProperty("name");
  });

  it("createTestProfile関数が正しく動作すること", () => {
    const profile = createTestProfile();

    expect(profile).toHaveProperty("id");
    expect(profile).toHaveProperty("userId");
    expect(profile).toHaveProperty("displayName");
  });

  it("createTestWork関数が正しく動作すること", () => {
    const work = createTestWork();

    expect(work).toHaveProperty("id");
    expect(work).toHaveProperty("profileId");
    expect(work).toHaveProperty("title");
  });

  it("createTestSkill関数が正しく動作すること", () => {
    const skill = createTestSkill();

    expect(skill).toHaveProperty("id");
    expect(skill).toHaveProperty("profileId");
    expect(skill).toHaveProperty("name");
  });

  it("createTestGroup関数が正しく動作すること", () => {
    const group = createTestGroup();

    expect(group).toHaveProperty("id");
    expect(group).toHaveProperty("name");
    expect(group).toHaveProperty("description");
  });

  it("createTestDataArray関数が正しく動作すること", () => {
    const users = createTestDataArray(3, createTestUser);

    expect(users).toHaveLength(3);
    expect(users[0]).toHaveProperty("id", "test-0");
    expect(users[1]).toHaveProperty("id", "test-1");
    expect(users[2]).toHaveProperty("id", "test-2");
  });
});

describe("テスト環境ヘルパー", () => {
  it("suppressConsoleError関数が存在すること", () => {
    expect(suppressConsoleError).toBeDefined();
    expect(typeof suppressConsoleError).toBe("function");
  });

  it("suppressConsoleWarning関数が存在すること", () => {
    expect(suppressConsoleWarning).toBeDefined();
    expect(typeof suppressConsoleWarning).toBe("function");
  });

  it("setTestWindowSize関数が存在すること", () => {
    expect(setTestWindowSize).toBeDefined();
    expect(typeof setTestWindowSize).toBe("function");
  });

  it("setTestMediaQuery関数が存在すること", () => {
    expect(setTestMediaQuery).toBeDefined();
    expect(typeof setTestMediaQuery).toBe("function");
  });
});
