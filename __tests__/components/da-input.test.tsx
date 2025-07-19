import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, userEvent } from "../test-utils";
import { DAInput, DALabel, DATextarea } from "@/components/ui/da-input";

describe("DAInput - デジタル庁デザインシステム準拠", () => {
  it("基本的な入力フィールドが正しくレンダリングされる", () => {
    render(<DAInput placeholder="お名前を入力してください" />);

    const input = screen.getByPlaceholderText("お名前を入力してください");
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass("border-[var(--da-color-gray-300)]");
  });

  it("エラー状態が正しく表示される", () => {
    render(
      <DAInput
        error
        helperText="この項目は必須です"
        placeholder="メールアドレス"
      />,
    );

    const input = screen.getByPlaceholderText("メールアドレス");
    const errorMessage = screen.getByText("この項目は必須です");

    expect(input).toHaveClass("border-[var(--da-color-error)]");
    expect(errorMessage).toHaveClass("text-[var(--da-color-error)]");
  });

  it("ヘルパーテキストが正しく表示される", () => {
    render(
      <DAInput
        helperText="半角英数字で入力してください"
        placeholder="ユーザーID"
      />,
    );

    const helperText = screen.getByText("半角英数字で入力してください");
    expect(helperText).toBeInTheDocument();
    expect(helperText).toHaveClass("text-[var(--da-color-gray-600)]");
  });

  it("入力値が正しく処理される", async () => {
    const handleChange = vi.fn();
    render(
      <DAInput
        onChange={handleChange}
        placeholder="テスト入力"
      />,
    );

    const input = screen.getByPlaceholderText("テスト入力");
    await userEvent.type(input, "テストテキスト");

    expect(input).toHaveValue("テストテキスト");
  });

  it("無効状態が正しく適用される", () => {
    render(
      <DAInput
        disabled
        placeholder="無効な入力フィールド"
      />,
    );

    const input = screen.getByPlaceholderText("無効な入力フィールド");
    expect(input).toBeDisabled();
    expect(input).toHaveClass("disabled:opacity-50");
  });
});

describe("DALabel - デジタル庁デザインシステム準拠", () => {
  it("基本的なラベルが正しくレンダリングされる", () => {
    render(<DALabel>お名前</DALabel>);

    const label = screen.getByText("お名前");
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass("text-[var(--da-color-gray-900)]");
  });

  it("必須マークが正しく表示される", () => {
    render(<DALabel required>メールアドレス</DALabel>);

    const label = screen.getByText("メールアドレス");
    const requiredMark = screen.getByText("*");

    expect(label).toBeInTheDocument();
    expect(requiredMark).toBeInTheDocument();
    expect(requiredMark).toHaveClass("text-[var(--da-color-error)]");
  });

  it("ラベルとインプットの組み合わせが正しく動作する", () => {
    render(
      <div>
        <DALabel
          htmlFor="test-input"
          required
        >
          テスト項目
        </DALabel>
        <DAInput
          id="test-input"
          placeholder="入力してください"
        />
      </div>,
    );

    const label = screen.getByText("テスト項目");
    const input = screen.getByPlaceholderText("入力してください");

    expect(label).toHaveAttribute("for", "test-input");
    expect(input).toHaveAttribute("id", "test-input");
  });
});

describe("DATextarea - デジタル庁デザインシステム準拠", () => {
  it("基本的なテキストエリアが正しくレンダリングされる", () => {
    render(<DATextarea placeholder="ご意見をお聞かせください" />);

    const textarea = screen.getByPlaceholderText("ご意見をお聞かせください");
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveClass("border-[var(--da-color-gray-300)]");
  });

  it("エラー状態が正しく表示される", () => {
    render(
      <DATextarea
        error
        helperText="内容を入力してください"
        placeholder="詳細"
      />,
    );

    const textarea = screen.getByPlaceholderText("詳細");
    const errorMessage = screen.getByText("内容を入力してください");

    expect(textarea).toHaveClass("border-[var(--da-color-error)]");
    expect(errorMessage).toHaveClass("text-[var(--da-color-error)]");
  });

  it("テキスト入力が正しく処理される", async () => {
    const handleChange = vi.fn();
    render(
      <DATextarea
        onChange={handleChange}
        placeholder="コメント"
      />,
    );

    const textarea = screen.getByPlaceholderText("コメント");
    await userEvent.type(textarea, "テストコメント");

    expect(textarea).toHaveValue("テストコメント");
  });
});
