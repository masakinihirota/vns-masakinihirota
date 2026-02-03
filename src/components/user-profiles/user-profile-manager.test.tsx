import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import * as axeMatchers from "vitest-axe/matchers";
import UserProfileManager from "./user-profile-manager";

expect.extend(axeMatchers);

// Mock Supabase client
const mockSelect = vi.fn();
vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    from: () => ({
      select: mockSelect,
    }),
  }),
}));

// Mock icons to avoid rendering issues in tests
vi.mock("lucide-react", () => ({
  Search: () => <div data-testid="icon-search" />,
  Plus: () => <div data-testid="icon-plus" />,
  Moon: () => <div data-testid="icon-moon" />,
  Sun: () => <div data-testid="icon-sun" />,
  Loader2: () => <div data-testid="icon-loader" />,
  Filter: () => <div data-testid="icon-filter" />,
  Users: () => <div data-testid="icon-users" />,
  Shield: () => <div data-testid="icon-shield" />,
  Trash2: () => <div data-testid="icon-trash" />,
  Edit2: () => <div data-testid="icon-edit" />,
  XCircle: () => <div data-testid="icon-x" />,
  Briefcase: () => <div data-testid="icon-briefcase" />,
  Gamepad2: () => <div data-testid="icon-gamepad" />,
  Heart: () => <div data-testid="icon-heart" />,
  HelpCircle: () => <div data-testid="icon-help" />,
  User: () => <div data-testid="icon-user" />,
  Mic: () => <div data-testid="icon-mic" />,
  Eye: () => <div data-testid="icon-eye" />,
  Bot: () => <div data-testid="icon-bot" />,
  Ghost: () => <div data-testid="icon-ghost" />,
  RotateCcw: () => <div data-testid="icon-restore" />,
  ArrowUp: () => <div data-testid="icon-arrow-up" />,
  ArrowDown: () => <div data-testid="icon-arrow-down" />,
  Contact: () => <div data-testid="icon-contact" />,
}));

describe("UserProfileManager", () => {
  it("初期表示でゴースト状態（アクティブなプロフィールなし）であること", async () => {
    // Arrange
    render(<UserProfileManager />);

    // Act
    // データ読み込み完了を待つ（ローダーが消えるまで）
    await waitFor(() => {
      expect(screen.queryByTestId("icon-loader")).not.toBeInTheDocument();
    });

    // Assert
    // ゴーストカードが表示され、かつ「選択状態」であることを確認する
    // ゴーストカードを特定するための role や text を探す
    const ghostCard = screen.getByTestId("ghost-card");
    expect(ghostCard).toBeInTheDocument();
    expect(ghostCard).toHaveAttribute("aria-pressed", "true"); // 選択状態を示す属性
  });

  it("プロフィールをクリックするとアクティブになり、ゴーストは非アクティブになること", async () => {
    // Arrange
    render(<UserProfileManager />);
    await waitFor(() =>
      expect(screen.queryByTestId("icon-loader")).not.toBeInTheDocument()
    );

    // Act
    // 最初のプロフィールカードをクリック
    const profileCards = screen.getAllByTestId("profile-card");
    expect(profileCards.length).toBeGreaterThan(0);
    fireEvent.click(profileCards[0]);

    // Assert
    const ghostCard = screen.getByTestId("ghost-card");
    expect(ghostCard).toHaveAttribute("aria-pressed", "false");
    expect(within(profileCards[0]).getByRole("checkbox")).toHaveAttribute(
      "aria-checked",
      "true"
    );
  });

  it("複数のプロフィールを同時にアクティブにできること", async () => {
    // Arrange
    render(<UserProfileManager />);
    await waitFor(() =>
      expect(screen.queryByTestId("icon-loader")).not.toBeInTheDocument()
    );
    const profileCards = screen.getAllByTestId("profile-card");

    // Act
    fireEvent.click(profileCards[0]); // 1つ目を選択
    fireEvent.click(profileCards[1]); // 2つ目を選択

    // Assert
    expect(within(profileCards[0]).getByRole("checkbox")).toHaveAttribute(
      "aria-checked",
      "true"
    );
    expect(within(profileCards[1]).getByRole("checkbox")).toHaveAttribute(
      "aria-checked",
      "true"
    );
  });

  it("全てのプロフィールを非アクティブにすると、自動的にゴーストに戻ること", async () => {
    // Arrange
    render(<UserProfileManager />);
    await waitFor(() =>
      expect(screen.queryByTestId("icon-loader")).not.toBeInTheDocument()
    );
    const profileCards = screen.getAllByTestId("profile-card");

    // Act
    fireEvent.click(profileCards[0]); // ON
    expect(within(profileCards[0]).getByRole("checkbox")).toHaveAttribute(
      "aria-checked",
      "true"
    );
    fireEvent.click(profileCards[0]); // OFF

    // Assert
    const ghostCard = screen.getByTestId("ghost-card");
    expect(ghostCard).toHaveAttribute("aria-pressed", "true");
    expect(within(profileCards[0]).getByRole("checkbox")).toHaveAttribute(
      "aria-checked",
      "false"
    );
  });

  it("ゴーストカードをクリックすると、全ての選択が解除されること", async () => {
    // Arrange
    render(<UserProfileManager />);
    await waitFor(() =>
      expect(screen.queryByTestId("icon-loader")).not.toBeInTheDocument()
    );
    const profileCards = screen.getAllByTestId("profile-card");
    const ghostCard = screen.getByTestId("ghost-card");

    // Act
    fireEvent.click(profileCards[0]);
    fireEvent.click(profileCards[1]);
    // この時点で2つ選択されているはず
    expect(within(profileCards[0]).getByRole("checkbox")).toHaveAttribute(
      "aria-checked",
      "true"
    );
    expect(within(profileCards[1]).getByRole("checkbox")).toHaveAttribute(
      "aria-checked",
      "true"
    );

    fireEvent.click(ghostCard); // ゴーストをクリック

    // Assert
    expect(ghostCard).toHaveAttribute("aria-pressed", "true");
    expect(within(profileCards[0]).getByRole("checkbox")).toHaveAttribute(
      "aria-checked",
      "false"
    );
    expect(within(profileCards[1]).getByRole("checkbox")).toHaveAttribute(
      "aria-checked",
      "false"
    );
  });

  it("should have no accessibility violations", async () => {
    // Arrange
    const { container } = render(<UserProfileManager />);
    await waitFor(() =>
      expect(screen.queryByTestId("icon-loader")).not.toBeInTheDocument()
    );

    // Act
    const results = await axe(container);

    // Assert
    expect(results).toHaveNoViolations();
  });

  describe("ゴミ箱機能（論理削除）", () => {
    it("削除ボタンを押すと、アイテムがリストから消える（ゴミ箱に移動）", async () => {
      render(<UserProfileManager />);
      await waitFor(
        () =>
          expect(screen.queryByTestId("icon-loader")).not.toBeInTheDocument(),
        { timeout: 3000 }
      );

      const deleteButtons = screen.getAllByTestId("button-delete");
      const initialCount = screen.getAllByTestId("profile-card").length;

      // Act: 削除（論理削除）
      vi.spyOn(window, "confirm").mockImplementation(() => true);
      fireEvent.click(deleteButtons[0]);

      // Assert: リストの数が1つ減るまで待つ
      await waitFor(
        () => {
          const currentCount = screen.queryAllByTestId("profile-card").length;
          expect(currentCount).toBe(initialCount - 1);
        },
        { timeout: 3000 }
      );
    });

    it("ゴミ箱タブに切り替えると、削除されたアイテムが表示される", async () => {
      render(<UserProfileManager />);
      await waitFor(
        () =>
          expect(screen.queryByTestId("icon-loader")).not.toBeInTheDocument(),
        { timeout: 3000 }
      );

      // 削除実行
      vi.spyOn(window, "confirm").mockImplementation(() => true);
      const deleteButtons = screen.getAllByTestId("button-delete");
      fireEvent.click(deleteButtons[0]);

      // 削除が反映される（Activeリストから消える）のを待つ
      await waitFor(
        () => {
          expect(screen.queryAllByTestId("profile-card").length).toBe(
            deleteButtons.length - 1
          );
        },
        { timeout: 3000 }
      );

      // ゴミ箱タブ切り替え
      const trashTab = screen.getByTestId("tab-trash");
      fireEvent.click(trashTab);

      // 削除されたアイテムが表示されるまで待つ
      await waitFor(
        () => {
          const trashCards = screen.queryAllByTestId("profile-card");
          expect(trashCards.length).toBeGreaterThanOrEqual(1);
        },
        { timeout: 3000 }
      );
    });

    it("ゴミ箱から復元すると、再度アクティブ一覧に表示される", async () => {
      render(<UserProfileManager />);
      await waitFor(
        () =>
          expect(screen.queryByTestId("icon-loader")).not.toBeInTheDocument(),
        { timeout: 3000 }
      );

      // 削除 -> ゴミ箱タブへ
      const deleteButtons = screen.getAllByTestId("button-delete");
      const initialCount = deleteButtons.length;
      vi.spyOn(window, "confirm").mockImplementation(() => true);
      fireEvent.click(deleteButtons[0]);

      await waitFor(
        () => {
          expect(screen.queryAllByTestId("profile-card").length).toBe(
            initialCount - 1
          );
        },
        { timeout: 3000 }
      );

      const trashTab = screen.getByTestId("tab-trash");
      fireEvent.click(trashTab);

      // ゴミ箱で復元ボタンを探す
      await waitFor(
        () => {
          expect(
            screen.queryAllByTestId("button-restore").length
          ).toBeGreaterThan(0);
        },
        { timeout: 3000 }
      );

      // 復元ボタンをクリック
      const restoreButtons = screen.getAllByTestId("button-restore");
      fireEvent.click(restoreButtons[0]);

      // 復元されてゴミ箱から消えるのを確認
      await waitFor(
        () => {
          const currentTrashCount =
            screen.queryAllByTestId("profile-card").length;
          expect(currentTrashCount).toBeLessThan(restoreButtons.length);
        },
        { timeout: 3000 }
      );

      // アクティブタブに戻る
      const activeTab = screen.getByTestId("tab-active");
      fireEvent.click(activeTab);

      // アイテムが復活しているか確認
      await waitFor(
        () => {
          expect(screen.getAllByTestId("profile-card").length).toBe(
            initialCount
          );
        },
        { timeout: 3000 }
      );
    });

    it("完全削除すると、アイテムが完全に消滅する", async () => {
      render(<UserProfileManager />);
      await waitFor(
        () =>
          expect(screen.queryByTestId("icon-loader")).not.toBeInTheDocument(),
        { timeout: 3000 }
      );

      // 削除 -> ゴミ箱タブへ
      const deleteButtons = screen.getAllByTestId("button-delete");
      vi.spyOn(window, "confirm").mockImplementation(() => true);
      fireEvent.click(deleteButtons[0]);

      await waitFor(
        () => {
          expect(screen.queryAllByTestId("profile-card").length).toBe(
            deleteButtons.length - 1
          );
        },
        { timeout: 3000 }
      );

      const trashTab = screen.getByTestId("tab-trash");
      fireEvent.click(trashTab);

      // ゴミ箱でアイテムが表示されるのを待つ
      await waitFor(
        () => {
          expect(
            screen.queryAllByTestId("button-permanent-delete").length
          ).toBeGreaterThan(0);
        },
        { timeout: 3000 }
      );

      // 完全削除ボタン (button-permanent-delete) をクリック
      const permDeleteButtons = screen.getAllByTestId(
        "button-permanent-delete"
      );

      // window.confirm のモック
      vi.spyOn(window, "confirm").mockImplementation(() => true);

      fireEvent.click(permDeleteButtons[0]);

      // そのアイテムが消えていること
      await waitFor(
        () => {
          const trashCards = screen.queryAllByTestId("profile-card");
          expect(trashCards.length).toBeLessThan(permDeleteButtons.length);
        },
        { timeout: 3000 }
      );
    });
  });

  describe("ソート機能", () => {
    it("ヘッダーをクリックすると、名前昇順・降順でソートされる", async () => {
      render(<UserProfileManager />);
      await waitFor(
        () =>
          expect(screen.queryByTestId("icon-loader")).not.toBeInTheDocument(),
        { timeout: 3000 }
      );

      // ヘッダー (名前) をクリック - ここでは testid="header-displayName" を想定
      const nameHeader = screen.getByTestId("header-displayName");

      // 初期状態: defaultで displayName asc なので、AIが最初のはず
      expect(screen.getByTestId("icon-arrow-up")).toBeInTheDocument();
      let cards = screen.getAllByTestId("profile-card");
      expect(cards[0]).toHaveTextContent("AI アシスタント");

      // 1回目のクリック: 降順 (DESC) になるはず
      fireEvent.click(nameHeader);

      await waitFor(
        () => {
          cards = screen.getAllByTestId("profile-card");
          expect(cards[0]).not.toHaveTextContent("AI アシスタント");
          expect(screen.getByTestId("icon-arrow-down")).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      // 2回目のクリック: 昇順 (ASC) に戻るはず
      fireEvent.click(nameHeader);

      await waitFor(
        () => {
          cards = screen.getAllByTestId("profile-card");
          expect(cards[0]).toHaveTextContent("AI アシスタント");
          expect(screen.getByTestId("icon-arrow-up")).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });
  });
});
