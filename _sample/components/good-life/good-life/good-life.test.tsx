import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";

import { renderWithWait } from "@/lib/test-utils";

import { GoodLife } from "./good-life";

// SidebarProvider などの依存関係をモック
vi.mock("@/components/ui/sidebar", () => ({
  SidebarProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SidebarInset: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/layout", () => ({
  GlobalHeader: () => <header>GlobalHeader</header>,
}));

describe("GoodLife Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = await renderWithWait(<GoodLife />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("GoodLife Rendering", () => {
  it("タイトルが表示されること", async () => {
    await renderWithWait(<GoodLife />);
    expect(
      screen.getByText("良い人生を送るための最も重要な美徳")
    ).toBeInTheDocument();
  });

  it("翻訳切り替えボタンが表示されること", async () => {
    await renderWithWait(<GoodLife />);
    expect(screen.getByText("日本語")).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
  });
});
