import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { NationEventList } from "./nation-event-list";

// events.logic のモック
vi.mock("./events.logic", () => ({
  useEvents: () => ({
    events: [
      {
        id: "event-1",
        title: "テストイベント1",
        description: "説明1",
        type: "free",
        start_at: new Date().toISOString(),
        max_participants: 10,
      },
    ],
    isLoading: false,
    isError: false,
    mutate: vi.fn(),
  }),
}));

// Supabase クライアントのモック
vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: "test-user-id" } },
      }),
    },
  }),
}));

describe("NationEventList", () => {
  it("正常にレンダリングされる", () => {
    // Arrange & Act
    const { container } = render(<NationEventList />);

    // Assert
    expect(container).toBeTruthy();
  });

  it("見出しが表示される", () => {
    // Arrange & Act
    render(<NationEventList />);

    // Assert
    expect(screen.getByText("Upcoming Events")).toBeInTheDocument();
  });

  it("検索フィールドが表示される", () => {
    // Arrange & Act
    render(<NationEventList />);

    // Assert
    expect(screen.getByPlaceholderText("Search events...")).toBeInTheDocument();
  });

  it("アクセシビリティ違反がない", async () => {
    // Arrange
    const { container } = render(<NationEventList />);

    // Act
    const results = await axe(container);

    // Assert
    expect(results).toHaveNoViolations();
  });

  // TODO: 検索フィルタリングのテスト
  // TODO: ローディング・エラー状態のテスト
});
