/* eslint-disable unicorn/no-null */

import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";

import { useEvents } from "./events.logic";
import { NationEventList } from "./nation-event-list";

// useEvents フックをモック化
vi.mock("./events.logic", () => ({
  useEvents: vi.fn(),
  useJoinEvent: vi.fn(() => ({ joinEvent: vi.fn() })),
}));

const mockEvents = [
  {
    id: "1",
    title: "夏祭り",
    description: "楽しい夏祭りです。",
    type: "free",
    start_at: "2024-08-01T10:00:00Z",
    max_participants: 100,
  },
  {
    id: "2",
    title: "プログラミング勉強会",
    description: "React の勉強会です。",
    type: "paid",
    start_at: "2024-09-01T15:00:00Z",
    max_participants: 20,
  },
];

describe("NationEventList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("アクセシビリティ違反がないこと", async () => {
    (useEvents as any).mockReturnValue({
      events: mockEvents,
      isLoading: false,
      isError: null,
      mutate: vi.fn(),
    });

    const { container } = render(<NationEventList nationId="all" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("ローディング状態が表示されること", () => {
    (useEvents as any).mockReturnValue({
      events: null,
      isLoading: true,
      isError: null,
      mutate: vi.fn(),
    });

    render(<NationEventList />);
    expect(screen.getByText("Loading events...")).toBeInTheDocument();
  });

  it("エラー状態が表示されること", () => {
    (useEvents as any).mockReturnValue({
      events: null,
      isLoading: false,
      isError: new Error("Fetch error"),
      mutate: vi.fn(),
    });

    render(<NationEventList />);
    expect(screen.getByText("Error loading events")).toBeInTheDocument();
  });

  it("イベント一覧が正しく表示されること", () => {
    (useEvents as any).mockReturnValue({
      events: mockEvents,
      isLoading: false,
      isError: null,
      mutate: vi.fn(),
    });

    render(<NationEventList />);
    expect(screen.getByText("夏祭り")).toBeInTheDocument();
    expect(screen.getByText("プログラミング勉強会")).toBeInTheDocument();
  });

  it("検索クエリでイベントがフィルタリングされること", () => {
    (useEvents as any).mockReturnValue({
      events: mockEvents,
      isLoading: false,
      isError: null,
      mutate: vi.fn(),
    });

    render(<NationEventList />);

    const searchInput = screen.getByPlaceholderText("Search events...");
    fireEvent.change(searchInput, { target: { value: "夏祭り" } });

    expect(screen.getByText("夏祭り")).toBeInTheDocument();
    expect(screen.queryByText("プログラミング勉強会")).not.toBeInTheDocument();
  });

  it("検索結果が空の場合にメッセージが表示されること", () => {
    (useEvents as any).mockReturnValue({
      events: mockEvents,
      isLoading: false,
      isError: null,
      mutate: vi.fn(),
    });

    render(<NationEventList />);

    const searchInput = screen.getByPlaceholderText("Search events...");
    fireEvent.change(searchInput, { target: { value: "存在しないイベント" } });

    expect(screen.getByText("No upcoming events found.")).toBeInTheDocument();
  });
});
