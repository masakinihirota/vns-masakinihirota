import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, userEvent } from "../test-utils";
import { DAButton } from "@/components/ui/da-button";

describe("DAButton - デジタル庁デザインシステム準拠", () => {
  it("プライマリボタンが正しくレンダリングされる", () => {
    render(<DAButton variant="primary">送信</DAButton>);

    const button = screen.getByRole("button", { name: "送信" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-[var(--da-color-primary-600)]");
  });

  it("セカンダリボタンが正しくレンダリングされる", () => {
    render(<DAButton variant="secondary">キャンセル</DAButton>);

    const button = screen.getByRole("button", { name: "キャンセル" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-[var(--da-color-gray-100)]");
  });

  it("アウトラインボタンが正しくレンダリングされる", () => {
    render(<DAButton variant="outline">詳細</DAButton>);

    const button = screen.getByRole("button", { name: "詳細" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("border-[var(--da-color-primary-600)]");
  });

  it("危険操作ボタンが正しくレンダリングされる", () => {
    render(<DAButton variant="destructive">削除</DAButton>);

    const button = screen.getByRole("button", { name: "削除" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-[var(--da-color-error)]");
  });

  it("異なるサイズが正しく適用される", () => {
    render(
      <div>
        <DAButton size="sm">小</DAButton>
        <DAButton size="md">中</DAButton>
        <DAButton size="lg">大</DAButton>
        <DAButton size="xl">特大</DAButton>
      </div>,
    );

    expect(screen.getByRole("button", { name: "小" })).toHaveClass("h-8");
    expect(screen.getByRole("button", { name: "中" })).toHaveClass("h-9");
    expect(screen.getByRole("button", { name: "大" })).toHaveClass("h-10");
    expect(screen.getByRole("button", { name: "特大" })).toHaveClass("h-12");
  });

  it("クリックイベントが正しく処理される", async () => {
    const handleClick = vi.fn();
    render(<DAButton onClick={handleClick}>クリック</DAButton>);

    const button = screen.getByRole("button", { name: "クリック" });
    await userEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("無効状態が正しく適用される", () => {
    render(<DAButton disabled>無効</DAButton>);

    const button = screen.getByRole("button", { name: "無効" });
    expect(button).toBeDisabled();
    expect(button).toHaveClass("disabled:opacity-50");
  });

  it("アクセシビリティ属性が正しく設定される", () => {
    render(
      <DAButton
        aria-label="フォームを送信"
        type="submit"
      >
        送信
      </DAButton>,
    );

    const button = screen.getByRole("button", { name: "フォームを送信" });
    expect(button).toHaveAttribute("type", "submit");
    expect(button).toHaveAttribute("aria-label", "フォームを送信");
  });
});
