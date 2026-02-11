import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { GeminiRootAccountView } from "./gemini-root-account";

/** テスト用アカウントデータ */
const mockAccountData = {
  id: "test-id",
  displayName: "テストユーザー",
  isVerified: true,
  walletAddress: "0x1234567890",
  trustScore: 85,
};

describe("GeminiRootAccountView", () => {
  it("正常にレンダリングされる", () => {
    // Arrange & Act
    const { container } = render(
      <GeminiRootAccountView
        accountData={mockAccountData as any}
        isDummy={false}
        loading={false}
        onCopyId={vi.fn()}
      />
    );

    // Assert
    expect(container).toBeTruthy();
  });

  it("ローディング中にローディング表示がされる", () => {
    // Arrange & Act
    const { container } = render(
      <GeminiRootAccountView
        accountData={null}
        isDummy={false}
        loading={true}
        onCopyId={vi.fn()}
      />
    );

    // Assert
    expect(container).toBeTruthy();
  });

  it("アクセシビリティ違反がない", async () => {
    // Arrange
    const { container } = render(
      <GeminiRootAccountView
        accountData={mockAccountData as any}
        isDummy={false}
        loading={false}
        onCopyId={vi.fn()}
      />
    );

    // Act
    const results = await axe(container);

    // Assert
    expect(results).toHaveNoViolations();
  });

  // TODO: コピーボタンのクリックテスト
  // TODO: ダミーモードの表示テスト
});
