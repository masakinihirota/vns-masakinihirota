import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "../../test-utils";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

describe("Card コンポーネント", () => {
  it("Card が正しくレンダリングされる", () => {
    render(<Card data-testid="card">カードコンテンツ</Card>);

    const card = screen.getByTestId("card");
    expect(card).toBeInTheDocument();
    expect(card).toHaveTextContent("カードコンテンツ");
    expect(card).toHaveClass("rounded-xl");
    expect(card).toHaveClass("border");
    expect(card).toHaveAttribute("data-slot", "card");
  });

  it("CardHeader が正しくレンダリングされる", () => {
    render(<CardHeader data-testid="card-header">ヘッダーコンテンツ</CardHeader>);

    const cardHeader = screen.getByTestId("card-header");
    expect(cardHeader).toBeInTheDocument();
    expect(cardHeader).toHaveTextContent("ヘッダーコンテンツ");
    expect(cardHeader).toHaveAttribute("data-slot", "card-header");
  });

  it("CardTitle が正しくレンダリングされる", () => {
    render(<CardTitle data-testid="card-title">カードタイトル</CardTitle>);

    const cardTitle = screen.getByTestId("card-title");
    expect(cardTitle).toBeInTheDocument();
    expect(cardTitle).toHaveTextContent("カードタイトル");
    expect(cardTitle).toHaveClass("font-semibold");
    expect(cardTitle).toHaveAttribute("data-slot", "card-title");
  });

  it("CardDescription が正しくレンダリングされる", () => {
    render(<CardDescription data-testid="card-description">カードの説明文</CardDescription>);

    const cardDescription = screen.getByTestId("card-description");
    expect(cardDescription).toBeInTheDocument();
    expect(cardDescription).toHaveTextContent("カードの説明文");
    expect(cardDescription).toHaveClass("text-sm");
    expect(cardDescription).toHaveAttribute("data-slot", "card-description");
  });

  it("CardAction が正しくレンダリングされる", () => {
    render(<CardAction data-testid="card-action">アクション</CardAction>);

    const cardAction = screen.getByTestId("card-action");
    expect(cardAction).toBeInTheDocument();
    expect(cardAction).toHaveTextContent("アクション");
    expect(cardAction).toHaveAttribute("data-slot", "card-action");
  });

  it("CardContent が正しくレンダリングされる", () => {
    render(<CardContent data-testid="card-content">コンテンツ</CardContent>);

    const cardContent = screen.getByTestId("card-content");
    expect(cardContent).toBeInTheDocument();
    expect(cardContent).toHaveTextContent("コンテンツ");
    expect(cardContent).toHaveClass("px-6");
    expect(cardContent).toHaveAttribute("data-slot", "card-content");
  });

  it("CardFooter が正しくレンダリングされる", () => {
    render(<CardFooter data-testid="card-footer">フッター</CardFooter>);

    const cardFooter = screen.getByTestId("card-footer");
    expect(cardFooter).toBeInTheDocument();
    expect(cardFooter).toHaveTextContent("フッター");
    expect(cardFooter).toHaveClass("flex");
    expect(cardFooter).toHaveAttribute("data-slot", "card-footer");
  });

  it("完全なカードコンポーネントが正しくレンダリングされる", () => {
    render(
      <Card data-testid="full-card">
        <CardHeader>
          <CardTitle>カードタイトル</CardTitle>
          <CardDescription>カードの説明文</CardDescription>
          <CardAction>
            <button>編集</button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <p>カードのメインコンテンツ</p>
        </CardContent>
        <CardFooter>
          <button>保存</button>
          <button>キャンセル</button>
        </CardFooter>
      </Card>
    );

    const card = screen.getByTestId("full-card");
    expect(card).toBeInTheDocument();
    expect(screen.getByText("カードタイトル")).toBeInTheDocument();
    expect(screen.getByText("カードの説明文")).toBeInTheDocument();
    expect(screen.getByText("編集")).toBeInTheDocument();
    expect(screen.getByText("カードのメインコンテンツ")).toBeInTheDocument();
    expect(screen.getByText("保存")).toBeInTheDocument();
    expect(screen.getByText("キャンセル")).toBeInTheDocument();
  });

  it("カスタムクラス名が正しく適用される", () => {
    render(
      <div>
        <Card className="custom-card" data-testid="custom-card" />
        <CardHeader className="custom-header" data-testid="custom-header" />
        <CardTitle className="custom-title" data-testid="custom-title" />
        <CardDescription className="custom-desc" data-testid="custom-desc" />
        <CardAction className="custom-action" data-testid="custom-action" />
        <CardContent className="custom-content" data-testid="custom-content" />
        <CardFooter className="custom-footer" data-testid="custom-footer" />
      </div>
    );

    expect(screen.getByTestId("custom-card")).toHaveClass("custom-card");
    expect(screen.getByTestId("custom-header")).toHaveClass("custom-header");
    expect(screen.getByTestId("custom-title")).toHaveClass("custom-title");
    expect(screen.getByTestId("custom-desc")).toHaveClass("custom-desc");
    expect(screen.getByTestId("custom-action")).toHaveClass("custom-action");
    expect(screen.getByTestId("custom-content")).toHaveClass("custom-content");
    expect(screen.getByTestId("custom-footer")).toHaveClass("custom-footer");
  });

  it("アクセシビリティ属性が正しく設定される", () => {
    render(
      <Card aria-label="情報カード" data-testid="a11y-card">
        <CardHeader aria-labelledby="card-title">
          <CardTitle id="card-title">アクセシブルカード</CardTitle>
        </CardHeader>
      </Card>
    );

    expect(screen.getByTestId("a11y-card")).toHaveAttribute(
      "aria-label",
      "情報カード"
    );
    expect(screen.getByText("アクセシブルカード").id).toBe("card-title");
  });
});
