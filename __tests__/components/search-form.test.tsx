import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "../test-utils";
import { SearchForm } from "@/components/search-form";

// Lucideアイコンをモック
vi.mock("lucide-react", () => ({
  Search: () => <div data-testid="mock-search-icon">検索アイコン</div>,
}));

describe("SearchForm - 検索フォームコンポーネント", () => {
  it("正しくレンダリングされる", () => {
    render(<SearchForm />);

    // 検索入力フィールドが存在することを確認
    const searchInput = screen.getByPlaceholderText("Search the docs...");
    expect(searchInput).toBeInTheDocument();

    // ラベルが存在することを確認
    expect(screen.getByLabelText("Search")).toBeInTheDocument();

    // 検索アイコンが存在することを確認
    expect(screen.getByTestId("mock-search-icon")).toBeInTheDocument();
  });

  it("入力フィールドに値を入力できる", () => {
    render(<SearchForm />);

    const searchInput = screen.getByPlaceholderText(
      "Search the docs...",
    ) as HTMLInputElement;

    // 入力値を変更
    fireEvent.change(searchInput, { target: { value: "nextjs" } });

    // 入力値が反映されていることを確認
    expect(searchInput.value).toBe("nextjs");
  });

  it("フォーム送信イベントが発生する", () => {
    const handleSubmit = vi.fn((e) => e.preventDefault());

    // data-testid属性を追加してフォームを特定できるようにする
    render(
      <SearchForm
        onSubmit={handleSubmit}
        data-testid="search-form"
      />,
    );

    const form = screen.getByTestId("search-form");
    const searchInput = screen.getByPlaceholderText(
      "Search the docs...",
    ) as HTMLInputElement;

    // 入力値を設定
    fireEvent.change(searchInput, { target: { value: "react hooks" } });

    // フォームを送信
    fireEvent.submit(form);

    // 送信ハンドラが呼ばれたことを確認
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("アクセシビリティ要件を満たしている", () => {
    render(<SearchForm />);

    // 入力フィールドにラベルが関連付けられていることを確認
    const searchInput = screen.getByPlaceholderText("Search the docs...");
    expect(searchInput).toHaveAttribute("id", "search");

    const label = screen.getByText("Search");
    expect(label).toHaveAttribute("for", "search");

    // スクリーンリーダー用のクラスが適用されていることを確認
    expect(label).toHaveClass("sr-only");
  });

  it("カスタムプロパティが正しく適用される", () => {
    const testId = "custom-search-form";
    render(
      <SearchForm
        data-testid={testId}
        className="custom-class"
      />,
    );

    const form = screen.getByTestId(testId);
    expect(form).toBeInTheDocument();
    expect(form).toHaveClass("custom-class");
  });
});
