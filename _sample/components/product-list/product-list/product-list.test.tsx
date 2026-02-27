import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";

import { ProductList } from "./product-list";
import { MOCK_ARTWORKS } from "./product-list.logic";

describe("ProductList UI", () => {
  const mockProperties = {
    artworks: MOCK_ARTWORKS,
    displayMode: "one-line" as const,
    onDisplayModeChange: vi.fn(),
    filter: { rating: "すべて" },
    onFilterChange: vi.fn(),
    sort: { key: "rating" as const, order: "asc" as const },
    onSortChange: vi.fn(),
    isLoading: false,
    error: null,
    filterRatingId: "rating-id",
    sortById: "sort-id",
  };

  it("アクセシビリティ違反がないこと", async () => {
    const { container } = render(<ProductList {...mockProperties} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("ローディング中が表示されること", () => {
    render(<ProductList {...mockProperties} isLoading={true} />);
    expect(screen.getByText("データを読み込み中...")).toBeInTheDocument();
  });

  it("エラーが表示されること", () => {
    const errorMessage = "エラーが発生しました";
    render(<ProductList {...mockProperties} error={errorMessage} />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("作品リストがレンダリングされること（1行モード）", () => {
    render(<ProductList {...mockProperties} />);
    expect(screen.getByText("星月夜")).toBeInTheDocument();
    expect(screen.getByText("モナ・リザ")).toBeInTheDocument();
    expect(
      screen.getByText("フィンセント・ファン・ゴッホ")
    ).toBeInTheDocument();
  });

  it("表示モード変更ハンドラが呼ばれること", () => {
    render(<ProductList {...mockProperties} />);
    const twoLineButton = screen.getByText("2行");
    fireEvent.click(twoLineButton);
    expect(mockProperties.onDisplayModeChange).toHaveBeenCalledWith("two-line");
  });

  it("フィルタ変更ハンドラが呼ばれること", () => {
    render(<ProductList {...mockProperties} />);
    const select = screen.getByLabelText("評価で絞り込み:");
    fireEvent.change(select, { target: { value: "Tier1" } });
    expect(mockProperties.onFilterChange).toHaveBeenCalledWith({ rating: "Tier1" });
  });

  it("ソート変更ハンドラが呼ばれること", () => {
    render(<ProductList {...mockProperties} />);
    // "作品名" を含むボタンを探す (アイコンや空白があってもヒットするように正規表現を使用)
    const button = screen.getByRole("button", { name: /作品名/ });
    fireEvent.click(button);
    expect(mockProperties.onSortChange).toHaveBeenCalledWith("title");
  });
});
