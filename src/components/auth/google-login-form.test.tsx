import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { GoogleLoginForm } from "./google-login-form";

// 外部依存のモック
vi.mock("@/lib/supabase/client", () => ({
  createClient: vi.fn(() => ({
    auth: {
      signInWithOAuth: vi.fn().mockResolvedValue({ error: null }),
    },
  })),
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  })),
}));

describe("GoogleLoginForm", () => {
  it("正常にレンダリングされる", () => {
    // Arrange & Act
    const { container } = render(<GoogleLoginForm />);

    // Assert
    expect(container).toBeTruthy();
  });

  it("Google認証のタイトルが表示される", () => {
    // Arrange & Act
    render(<GoogleLoginForm />);

    // Assert
    expect(screen.getByText("Google認証")).toBeInTheDocument();
  });

  it("サインインボタンが表示される", () => {
    // Arrange & Act
    render(<GoogleLoginForm />);

    // Assert
    expect(
      screen.getByRole("button", { name: "サインイン" })
    ).toBeInTheDocument();
  });

  it("Googleアカウントが必要であることが表示される", () => {
    // Arrange & Act
    render(<GoogleLoginForm />);

    // Assert
    expect(
      screen.getByText("必要なもの: Googleアカウント")
    ).toBeInTheDocument();
  });

  it("機能一覧が表示される", () => {
    // Arrange & Act
    render(<GoogleLoginForm />);

    // Assert
    expect(screen.getByText("ルートアカウント:")).toBeInTheDocument();
    expect(screen.getByText("ユーザープロフィール:")).toBeInTheDocument();
  });

  it("アクセシビリティ違反がない", async () => {
    // Arrange
    const { container } = render(<GoogleLoginForm />);

    // Act
    const results = await axe(container);

    // Assert
    expect(results).toHaveNoViolations();
  });

  // TODO: サインインボタンクリック時のローディング状態テスト
  // TODO: エラー発生時のエラーメッセージ表示テスト
  // TODO: OAuth リダイレクトURL の正確性テスト
});
