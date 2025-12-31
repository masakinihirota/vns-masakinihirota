import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ProductList } from "./product-list";
import { MOCK_ARTWORKS } from "./product-list.logic";

describe("ProductList UI", () => {
  const mockProps = {
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

  it("ローディング中が表示されること", () => {
    render(<ProductList {...mockProps} isLoading={true} />);
    expect(screen.getByText("データを読み込み中...")).toBeInTheDocument();
  });

  it("エラーが表示されること", () => {
    const errorMsg = "エラーが発生しました";
    render(<ProductList {...mockProps} error={errorMsg} />);
    expect(screen.getByText(errorMsg)).toBeInTheDocument();
  });

  it("作品リストがレンダリングされること（1行モード）", () => {
    render(<ProductList {...mockProps} />);
    expect(screen.getByText("星月夜")).toBeInTheDocument();
    expect(screen.getByText("モナ・リザ")).toBeInTheDocument();
    expect(
      screen.getByText("フィンセント・ファン・ゴッホ"),
    ).toBeInTheDocument();
  });

  it("表示モード変更ハンドラが呼ばれること", () => {
    render(<ProductList {...mockProps} />);
    const twoLineButton = screen.getByText("2行");
    fireEvent.click(twoLineButton);
    expect(mockProps.onDisplayModeChange).toHaveBeenCalledWith("two-line");
  });

  it("フィルタ変更ハンドラが呼ばれること", () => {
    render(<ProductList {...mockProps} />);
    const select = screen.getByLabelText("評価で絞り込み:");
    fireEvent.change(select, { target: { value: "Tier1" } });
    expect(mockProps.onFilterChange).toHaveBeenCalledWith({ rating: "Tier1" });
  });

  it("ソート変更ハンドラが呼ばれること", () => {
    render(<ProductList {...mockProps} />);
    // "作品名" を含むボタンを探す (アイコンや空白があってもヒットするように正規表現を使用)
    const button = screen.getByRole("button", { name: /作品名/ });
    fireEvent.click(button);
    expect(mockProps.onSortChange).toHaveBeenCalledWith("title");
  });
});
