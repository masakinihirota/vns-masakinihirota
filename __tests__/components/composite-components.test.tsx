import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "../test-utils";
import { AppSidebar } from "@/components/app-sidebar";
import { SearchForm } from "@/components/search-form";
import { SidebarProvider } from "@/components/ui/sidebar";

// Lucideアイコンをモック
vi.mock("lucide-react", () => ({
  Search: () => <div data-testid="mock-search-icon">検索アイコン</div>,
  Check: () => <div data-testid="mock-check-icon">チェックアイコン</div>,
  ChevronsUpDown: () => (
    <div data-testid="mock-chevrons-icon">上下矢印アイコン</div>
  ),
  GalleryVerticalEnd: () => (
    <div data-testid="mock-gallery-icon">ギャラリーアイコン</div>
  ),
  PanelLeftIcon: () => (
    <div data-testid="mock-panel-left-icon">パネル左アイコン</div>
  ),
}));

describe("複合コンポーネント間の連携テスト", () => {
  it("AppSidebarに実際のSearchFormとVersionSwitcherが統合される", () => {
    // モックを解除して実際のコンポーネントを使用
    vi.unmock("@/components/search-form");
    vi.unmock("@/components/version-switcher");

    render(
      <SidebarProvider>
        <AppSidebar />
      </SidebarProvider>,
    );

    // SearchFormが存在することを確認
    const searchInput = screen.getByPlaceholderText("Search the docs...");
    expect(searchInput).toBeInTheDocument();

    // VersionSwitcherが存在することを確認
    expect(screen.getByText("Documentation")).toBeInTheDocument();
    expect(screen.getByText("v1.0.1")).toBeInTheDocument();
  });

  it("SearchFormの入力とサイドバーの状態管理", () => {
    vi.unmock("@/components/search-form");
    vi.unmock("@/components/version-switcher");

    render(
      <SidebarProvider>
        <AppSidebar />
      </SidebarProvider>,
    );

    // 検索フォームに入力
    const searchInput = screen.getByPlaceholderText(
      "Search the docs...",
    ) as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: "routing" } });

    // 入力値が反映されていることを確認
    expect(searchInput.value).toBe("routing");

    // サイドバーのRoutingリンクを見つける
    const routingLink = screen.getByText("Routing");
    expect(routingLink).toBeInTheDocument();
  });

  it("個別コンポーネントのイベント処理テスト", async () => {
    // カスタムイベントハンドラを持つコンポーネントをレンダリング
    const handleSearch = vi.fn((e) => e.preventDefault());

    render(
      <div>
        <SearchForm
          onSubmit={handleSearch}
          data-testid="search-form"
        />
      </div>,
    );

    // 検索フォームを送信
    const searchForm = screen.getByTestId("search-form");
    fireEvent.submit(searchForm);

    // 検索ハンドラが呼ばれたことを確認
    expect(handleSearch).toHaveBeenCalledTimes(1);
  });
});
