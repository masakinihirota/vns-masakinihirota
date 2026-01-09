import "vitest-axe/extend-expect";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { Step3FavWorks } from "./step3-fav-works";

describe("Step3FavWorks タグフィルタリングのテスト", () => {
  const mockProps = {
    favWorks: [],
    addFavWork: vi.fn(),
    toggleBestWork: vi.fn(),
    removeFavWork: vi.fn(),
  };

  it("カテゴリタグ（アニメ）を選択すると、そのカテゴリの作品のみが表示される", () => {
    render(<Step3FavWorks {...mockProps} />);

    // 「アニメ」タグをクリック
    const animeTag = screen.getByTestId("tag-アニメ");
    fireEvent.click(animeTag);

    // アニメ作品が表示されることを確認
    expect(
      screen.getByText(/ヴァイオレット・エヴァーガーデン/)
    ).toBeInTheDocument();
    expect(screen.getByText(/響け！ユーフォニアム/)).toBeInTheDocument();

    // 漫画作品が表示されないことを確認
    expect(screen.queryByText(/SLAM DUNK/)).not.toBeInTheDocument();
  });

  it("ジャンルタグを選択すると、そのジャンルの作品が表示される", () => {
    render(<Step3FavWorks {...mockProps} />);

    // アニメタブに切り替え（ジャンルを表示させるため）
    const animeTab = screen.getByTestId("tab-アニメ");
    fireEvent.click(animeTab);

    // 「スポーツ」などのジャンル（漫画のジャンルだが、アニメタブでは表示されないはずなので、
    // アニメのジャンル「ドラマ」などを探す）
    const dramaTag = screen
      .getAllByRole("button")
      .find((b) => /ドラマ/.test(b.textContent || ""));
    if (!dramaTag) throw new Error("Drama tag not found");
    fireEvent.click(dramaTag);

    expect(
      screen.getByText(/ヴァイオレット・エヴァーガーデン/)
    ).toBeInTheDocument();
    // ドラマ以外の「千と千尋の神隠し」などは非表示になるはず
    expect(screen.queryByText(/千と千尋の神隠し/)).not.toBeInTheDocument();
  });

  it("should have no accessibility violations", async () => {
    const { container } = render(<Step3FavWorks {...mockProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
