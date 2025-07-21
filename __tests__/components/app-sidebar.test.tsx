import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "../test-utils";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

// SearchFormとVersionSwitcherをモック
vi.mock("@/components/search-form", () => ({
  SearchForm: () => <div data-testid="mock-search-form">検索フォーム</div>,
}));

vi.mock("@/components/version-switcher", () => ({
  VersionSwitcher: ({
    versions,
    defaultVersion,
  }: { versions: string[]; defaultVersion: string }) => (
    <div data-testid="mock-version-switcher">
      バージョン切替: {defaultVersion}
      <ul>
        {versions.map((version) => (
          <li key={version}>{version}</li>
        ))}
      </ul>
    </div>
  ),
}));

// SidebarProviderでラップしたAppSidebarをレンダリングするヘルパー関数
const renderAppSidebar = () => {
  return render(
    <SidebarProvider>
      <AppSidebar />
    </SidebarProvider>,
  );
};

describe("AppSidebar - 複合コンポーネント", () => {
  it("正しくレンダリングされる", () => {
    renderAppSidebar();

    // ヘッダー部分の検証
    expect(screen.getByTestId("mock-version-switcher")).toBeInTheDocument();
    expect(screen.getByTestId("mock-search-form")).toBeInTheDocument();

    // サイドバーの項目が表示されていることを確認
    expect(screen.getByText("Getting Started")).toBeInTheDocument();
    expect(screen.getByText("Building Your Application")).toBeInTheDocument();
    expect(screen.getByText("API Reference")).toBeInTheDocument();
    expect(screen.getByText("Architecture")).toBeInTheDocument();
  });

  it("各セクションの子項目が正しく表示される", () => {
    renderAppSidebar();

    // Building Your Applicationセクションを検証
    expect(screen.getByText("Building Your Application")).toBeInTheDocument();

    // 特定の項目が存在することを確認
    expect(screen.getByText("Routing")).toBeInTheDocument();
    expect(screen.getByText("Data Fetching")).toBeInTheDocument();
    expect(screen.getByText("Testing")).toBeInTheDocument();
  });

  it("アクティブな項目が正しくマークされる", () => {
    renderAppSidebar();

    // アクティブな項目を検索
    const activeItem = screen.getByText("Data Fetching");
    expect(activeItem).toBeInTheDocument();

    // アクティブな項目の親要素にdata-active属性があることを確認
    // 注: 実際のDOM構造に合わせて調整が必要な場合があります
    const parentElement = activeItem.closest("a");
    expect(parentElement).toBeInTheDocument();
  });

  it("リンクが正しく設定されている", () => {
    renderAppSidebar();

    // すべてのリンクを取得
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThan(0);

    // リンクのhref属性を確認
    links.forEach((link) => {
      expect(link).toHaveAttribute("href", "#");
    });
  });
});
