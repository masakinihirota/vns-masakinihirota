import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, userEvent } from "../../test-utils";
import { Button } from "@/components/ui/button";

describe("Button コンポーネント", () => {
  it("デフォルトボタンが正しくレンダリングされる", () => {
    render(<Button>送信</Button>);

    const button = screen.getByRole("button", { name: "送信" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-primary");
    expect(button).toHaveAttribute("data-slot", "button");
  });

  it("バリアントが正しく適用される", () => {
    render(
      <div>
        <Button variant="default">デフォルト</Button>
        <Button variant="destructive">削除</Button>
        <Button variant="outline">アウトライン</Button>
        <Button variant="secondary">セカンダリ</Button>
        <Button variant="ghost">ゴースト</Button>
        <Button variant="link">リンク</Button>
      </div>
    );

    expect(screen.getByRole("button", { name: "デフォルト" })).toHaveClass("bg-primary");
    expect(screen.getByRole("button", { name: "削除" })).toHaveClass("bg-destructive");
    expect(screen.getByRole("button", { name: "アウトライン" })).toHaveClass("border");
    expect(screen.getByRole("button", { name: "セカンダリ" })).toHaveClass("bg-secondary");
    expect(screen.getByRole("button", { name: "ゴースト" })).toHaveClass("hover:bg-accent");
    expect(screen.getByRole("button", { name: "リンク" })).toHaveClass("text-primary");
  });

  it("サイズが正しく適用される", () => {
    render(
      <div>
        <Button size="default">デフォルト</Button>
        <Button size="sm">小</Button>
        <Button size="lg">大</Button>
        <Button size="icon">アイコン</Button>
      </div>
    );

    expect(screen.getByRole("button", { name: "デフォルト" })).toHaveClass("h-9");
    expect(screen.getByRole("button", { name: "小" })).toHaveClass("h-8");
    expect(screen.getByRole("button", { name: "大" })).toHaveClass("h-10");
    expect(screen.getByRole("button", { name: "アイコン" })).toHaveClass("size-9");
  });

  it("クリックイベントが正しく処理される", async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>クリック</Button>);

    const button = screen.getByRole("button", { name: "クリック" });
    await userEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("無効状態が正しく適用される", () => {
    render(<Button disabled>無効</Button>);

    const button = screen.getByRole("button", { name: "無効" });
    expect(button).toBeDisabled();
    expect(button).toHaveClass("disabled:opacity-50");
  });

  it("カスタムクラス名が正しく適用される", () => {
    render(<Button className="custom-class">カスタム</Button>);

    const button = screen.getByRole("button", { name: "カスタム" });
    expect(button).toHaveClass("custom-class");
  });

  it("asChild プロパティが正しく機能する", () => {
    render(
      <Button asChild>
        <a href="#">リンクボタン</a>
      </Button>
    );

    const link = screen.getByRole("link", { name: "リンクボタン" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "#");
    expect(link).toHaveAttribute("data-slot", "button");
  });

  it("アクセシビリティ属性が正しく設定される", () => {
    render(
      <Button
        aria-label="フォームを送信"
        type="submit"
      >
        送信
      </Button>
    );

    const button = screen.getByRole("button", { name: "フォームを送信" });
    expect(button).toHaveAttribute("type", "submit");
    expect(button).toHaveAttribute("aria-label", "フォームを送信");
  });
});
