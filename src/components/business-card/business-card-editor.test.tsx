import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { BusinessCardEditor } from "./business-card-editor";

// 外部依存のモック
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// UserProfile のモックデータ
const mockProfile = {
  id: "test-profile-1",
  display_name: "テスト太郎",
  role_type: "エンジニア",
  user_id: "user-1",
};

describe("BusinessCardEditor", () => {
  it("正常にレンダリングされる", () => {
    // Arrange & Act
    const { container } = render(
      <BusinessCardEditor profile={mockProfile as any} initialCard={null} />
    );

    // Assert
    expect(container).toBeTruthy();
  });

  it("設定タイトルが表示される", () => {
    // Arrange & Act
    render(
      <BusinessCardEditor profile={mockProfile as any} initialCard={null} />
    );

    // Assert
    expect(screen.getByText("Configuration")).toBeInTheDocument();
  });

  it("保存ボタンが表示される", () => {
    // Arrange & Act
    render(
      <BusinessCardEditor profile={mockProfile as any} initialCard={null} />
    );

    // Assert
    expect(screen.getByText("Save Changes")).toBeInTheDocument();
  });

  it("アクセシビリティ違反がない", async () => {
    // Arrange
    const { container } = render(
      <BusinessCardEditor profile={mockProfile as any} initialCard={null} />
    );

    // Act
    const results = await axe(container);

    // Assert
    expect(results).toHaveNoViolations();
  });

  // TODO: タブ切り替えテスト
  // TODO: 入力フィールドの値変更テスト
  // TODO: 保存ボタンのクリックテスト
});
