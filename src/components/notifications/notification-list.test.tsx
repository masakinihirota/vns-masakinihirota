import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { NotificationList } from "./notification-list";

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

// next/navigation のモック
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// notifications.logic のモック
vi.mock("./notifications.logic", () => ({
  useNotifications: () => ({
    notifications: [
      {
        id: "notif-1",
        title: "テスト通知",
        message: "テストメッセージです",
        is_read: false,
        created_at: new Date().toISOString(),
        link_url: "/test",
      },
    ],
    isLoading: false,
    mutate: vi.fn(),
  }),
  useMarkAsRead: () => ({
    markAsRead: vi.fn().mockResolvedValue(undefined),
  }),
}));

describe("NotificationList", () => {
  it("正常にレンダリングされる", () => {
    // Arrange & Act
    const { container } = render(<NotificationList />);

    // Assert
    expect(container).toBeTruthy();
  });

  it("アクセシビリティ違反がない", async () => {
    // Arrange
    const { container } = render(<NotificationList />);

    // Act
    const results = await axe(container);

    // Assert
    expect(results).toHaveNoViolations();
  });

  // TODO: 通知クリックのテスト
  // TODO: 既読・未読の表示テスト
  // TODO: ローディング状態のテスト
});
