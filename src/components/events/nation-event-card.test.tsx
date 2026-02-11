import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { NationEventCard } from "./nation-event-card";

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

// events.logic のモック
vi.mock("./events.logic", () => ({
  useJoinEvent: () => ({
    joinEvent: vi.fn().mockResolvedValue(undefined),
  }),
  useEvents: () => ({
    events: [],
    isLoading: false,
    isError: false,
    mutate: vi.fn(),
  }),
}));

/** テスト用イベントデータ */
const mockEvent = {
  id: "event-1",
  title: "テストイベント",
  description: "テストイベントの説明",
  type: "free" as const,
  start_at: new Date().toISOString(),
  max_participants: 10,
  nation_id: "nation-1",
  created_at: new Date().toISOString(),
};

describe("NationEventCard", () => {
  it("正常にレンダリングされる", () => {
    // Arrange & Act
    const { container } = render(
      <NationEventCard event={mockEvent as any} onJoinSuccess={vi.fn()} />
    );

    // Assert
    expect(container).toBeTruthy();
  });

  it("イベントタイトルが表示される", () => {
    // Arrange & Act
    render(
      <NationEventCard event={mockEvent as any} onJoinSuccess={vi.fn()} />
    );

    // Assert
    expect(screen.getByText("テストイベント")).toBeInTheDocument();
  });

  it("参加ボタンが表示される", () => {
    // Arrange & Act
    render(
      <NationEventCard event={mockEvent as any} onJoinSuccess={vi.fn()} />
    );

    // Assert
    expect(screen.getByText("Join Event")).toBeInTheDocument();
  });

  it("アクセシビリティ違反がない", async () => {
    // Arrange
    const { container } = render(
      <NationEventCard event={mockEvent as any} onJoinSuccess={vi.fn()} />
    );

    // Act
    const results = await axe(container);

    // Assert
    expect(results).toHaveNoViolations();
  });

  // TODO: 参加ボタンクリックのテスト
  // TODO: ローディング状態のテスト
});
