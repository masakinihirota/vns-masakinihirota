import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "../test-utils";
import { VersionSwitcher } from "@/components/version-switcher";
import { SidebarProvider } from "@/components/ui/sidebar";

// Lucideアイコンをモック
vi.mock("lucide-react", () => ({
  Check: () => <div data-testid="mock-check-icon">チェックアイコン</div>,
  ChevronsUpDown: () => (
    <div data-testid="mock-chevrons-icon">上下矢印アイコン</div>
  ),
  GalleryVerticalEnd: () => (
    <div data-testid="mock-gallery-icon">ギャラリーアイコン</div>
  ),
}));

// SidebarProviderでラップしたVersionSwitcherをレンダリングするヘルパー関数
const renderVersionSwitcher = (props: {
  versions: string[];
  defaultVersion: string;
}) => {
  return render(
    <SidebarProvider>
      <VersionSwitcher {...props} />
    </SidebarProvider>,
  );
};

describe("VersionSwitcher - バージョン切替コンポーネント", () => {
  const versions = ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"];
  const defaultVersion = "1.0.1";

  it("正しくレンダリングされる", () => {
    renderVersionSwitcher({ versions, defaultVersion });

    // デフォルトバージョンが表示されていることを確認
    expect(screen.getByText(`v${defaultVersion}`)).toBeInTheDocument();
    expect(screen.getByText("Documentation")).toBeInTheDocument();

    // アイコンが表示されていることを確認
    expect(screen.getByTestId("mock-gallery-icon")).toBeInTheDocument();
    expect(screen.getByTestId("mock-chevrons-icon")).toBeInTheDocument();
  });

  it("異なるバージョンリストで正しく動作する", () => {
    const customVersions = ["3.0.0", "4.0.0", "5.0.0-rc"];
    const customDefault = "4.0.0";

    renderVersionSwitcher({
      versions: customVersions,
      defaultVersion: customDefault,
    });

    // カスタムデフォルトバージョンが表示されていることを確認
    expect(screen.getByText(`v${customDefault}`)).toBeInTheDocument();
  });
});
