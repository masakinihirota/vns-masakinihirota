import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../../test-utils";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";

// モックの設定
vi.mock("@radix-ui/react-dialog", () => {
  return {
    Root: ({ children, ...props }: React.PropsWithChildren<{}>) => (
      <div data-testid="sheet-root" data-slot="sheet" {...props}>
        {children}
      </div>
    ),
    Trigger: ({ children, ...props }: React.PropsWithChildren<{}>) => (
      <button data-testid="sheet-trigger" data-slot="sheet-trigger" {...props}>
        {children}
      </button>
    ),
    Portal: ({ children, ...props }: React.PropsWithChildren<{}>) => (
      <div data-testid="sheet-portal" data-slot="sheet-portal" {...props}>
        {children}
      </div>
    ),
    Overlay: ({ children, ...props }: React.PropsWithChildren<{ className?: string }>) => (
      <div data-testid="sheet-overlay" data-slot="sheet-overlay" className={props.className}>
        {children}
      </div>
    ),
    Content: ({ children, ...props }: React.PropsWithChildren<{ className?: string }>) => (
      <div data-testid="sheet-content" data-slot="sheet-content" className={props.className} {...props}>
        {children}
      </div>
    ),
    Close: ({ children, ...props }: React.PropsWithChildren<{}>) => (
      <button data-testid="sheet-close" data-slot="sheet-close" {...props}>
        {children}
      </button>
    ),
    Title: ({ children, ...props }: React.PropsWithChildren<{ className?: string }>) => (
      <h2 data-testid="sheet-title" data-slot="sheet-title" className={props.className} {...props}>
        {children}
      </h2>
    ),
    Description: ({ children, ...props }: React.PropsWithChildren<{ className?: string }>) => (
      <p data-testid="sheet-description" data-slot="sheet-description" className={props.className} {...props}>
        {children}
      </p>
    ),
  };
});

// Lucide アイコンのモック
vi.mock("lucide-react", () => ({
  XIcon: () => <div data-testid="x-icon">X</div>,
}));

describe("Sheet コンポーネント", () => {
  it("Sheet が正しくレンダリングされる", () => {
    render(
      <Sheet>
        <div>シートの内容</div>
      </Sheet>
    );

    const sheet = screen.getByTestId("sheet-root");
    expect(sheet).toBeInTheDocument();
    expect(sheet).toHaveAttribute("data-slot", "sheet");
  });

  it("SheetTrigger が正しくレンダリングされる", () => {
    render(<SheetTrigger>開く</SheetTrigger>);

    const trigger = screen.getByTestId("sheet-trigger");
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveTextContent("開く");
    expect(trigger).toHaveAttribute("data-slot", "sheet-trigger");
  });

  it("SheetClose が正しくレンダリングされる", () => {
    render(<SheetClose>閉じる</SheetClose>);

    const close = screen.getByTestId("sheet-close");
    expect(close).toBeInTheDocument();
    expect(close).toHaveTextContent("閉じる");
    expect(close).toHaveAttribute("data-slot", "sheet-close");
  });

  it("SheetContent が正しくレンダリングされる", () => {
    render(
      <SheetContent>
        <div>コンテンツ</div>
      </SheetContent>
    );

    const portal = screen.getByTestId("sheet-portal");
    expect(portal).toBeInTheDocument();
    expect(portal).toHaveAttribute("data-slot", "sheet-portal");

    const overlay = screen.getByTestId("sheet-overlay");
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveAttribute("data-slot", "sheet-overlay");
    expect(overlay).toHaveClass("bg-black/50");

    const content = screen.getByTestId("sheet-content");
    expect(content).toBeInTheDocument();
    expect(content).toHaveAttribute("data-slot", "sheet-content");
    expect(content).toHaveClass("bg-background");

    const closeButton = screen.getByTestId("sheet-close");
    expect(closeButton).toBeInTheDocument();

    const xIcon = screen.getByTestId("x-icon");
    expect(xIcon).toBeInTheDocument();
  });

  it("SheetContent の side プロパティが正しく適用される", () => {
    const { rerender } = render(<SheetContent side="right">コンテンツ</SheetContent>);
    expect(screen.getByTestId("sheet-content")).toHaveClass("right-0");

    rerender(<SheetContent side="left">コンテンツ</SheetContent>);
    expect(screen.getByTestId("sheet-content")).toHaveClass("left-0");

    rerender(<SheetContent side="top">コンテンツ</SheetContent>);
    expect(screen.getByTestId("sheet-content")).toHaveClass("top-0");

    rerender(<SheetContent side="bottom">コンテンツ</SheetContent>);
    expect(screen.getByTestId("sheet-content")).toHaveClass("bottom-0");
  });

  it("SheetHeader が正しくレンダリングされる", () => {
    render(<SheetHeader>ヘッダー</SheetHeader>);

    const header = screen.getByText("ヘッダー");
    expect(header).toBeInTheDocument();
    expect(header).toHaveAttribute("data-slot", "sheet-header");
    expect(header).toHaveClass("flex");
    expect(header).toHaveClass("p-4");
  });

  it("SheetFooter が正しくレンダリングされる", () => {
    render(<SheetFooter>フッター</SheetFooter>);

    const footer = screen.getByText("フッター");
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveAttribute("data-slot", "sheet-footer");
    expect(footer).toHaveClass("mt-auto");
    expect(footer).toHaveClass("p-4");
  });

  it("SheetTitle が正しくレンダリングされる", () => {
    render(<SheetTitle>タイトル</SheetTitle>);

    const title = screen.getByTestId("sheet-title");
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("タイトル");
    expect(title).toHaveAttribute("data-slot", "sheet-title");
    expect(title).toHaveClass("font-semibold");
  });

  it("SheetDescription が正しくレンダリングされる", () => {
    render(<SheetDescription>説明文</SheetDescription>);

    const description = screen.getByTestId("sheet-description");
    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent("説明文");
    expect(description).toHaveAttribute("data-slot", "sheet-description");
    expect(description).toHaveClass("text-sm");
  });

  it("完全なシートコンポーネントが正しくレンダリングされる", () => {
    render(
      <Sheet>
        <SheetTrigger>開く</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>シートタイトル</SheetTitle>
            <SheetDescription>シートの説明文</SheetDescription>
          </SheetHeader>
          <div>メインコンテンツ</div>
          <SheetFooter>
            <button>保存</button>
            <SheetClose>キャンセル</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );

    expect(screen.getByTestId("sheet-root")).toBeInTheDocument();
    expect(screen.getByTestId("sheet-trigger")).toHaveTextContent("開く");
    expect(screen.getByTestId("sheet-content")).toBeInTheDocument();
    expect(screen.getByTestId("sheet-title")).toHaveTextContent("シートタイトル");
    expect(screen.getByTestId("sheet-description")).toHaveTextContent("シートの説明文");
    expect(screen.getByText("メインコンテンツ")).toBeInTheDocument();
    expect(screen.getByText("保存")).toBeInTheDocument();
    expect(screen.getByText("キャンセル")).toBeInTheDocument();
  });

  it("カスタムクラス名が正しく適用される", () => {
    render(
      <div>
        <SheetContent className="custom-content">コンテンツ</SheetContent>
        <SheetHeader className="custom-header">ヘッダー</SheetHeader>
        <SheetFooter className="custom-footer">フッター</SheetFooter>
        <SheetTitle className="custom-title">タイトル</SheetTitle>
        <SheetDescription className="custom-desc">説明</SheetDescription>
      </div>
    );

    expect(screen.getByTestId("sheet-content")).toHaveClass("custom-content");
    expect(screen.getByText("ヘッダー")).toHaveClass("custom-header");
    expect(screen.getByText("フッター")).toHaveClass("custom-footer");
    expect(screen.getByTestId("sheet-title")).toHaveClass("custom-title");
    expect(screen.getByTestId("sheet-description")).toHaveClass("custom-desc");
  });

  it("アクセシビリティ属性が正しく設定される", () => {
    render(
      <SheetContent aria-label="シートダイアログ">
        <SheetTitle id="sheet-heading">アクセシブルシート</SheetTitle>
        <SheetDescription id="sheet-desc">アクセシビリティに配慮した説明</SheetDescription>
      </SheetContent>
    );

    expect(screen.getByTestId("sheet-content")).toHaveAttribute(
      "aria-label",
      "シートダイアログ"
    );
    expect(screen.getByTestId("sheet-title")).toHaveAttribute("id", "sheet-heading");
    expect(screen.getByTestId("sheet-description")).toHaveAttribute("id", "sheet-desc");
  });
});
