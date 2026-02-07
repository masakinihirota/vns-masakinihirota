import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import * as matchers from "vitest-axe/matchers";
import { MandalaCell } from "./mandala-cell";

expect.extend(matchers);

describe("MandalaCell", () => {
  const defaultProps = {
    text: "テストテキスト",
    label: "A-1",
    isCenter: false,
    isBlockCenter: false,
    onClick: vi.fn(),
  };

  it("テキストが表示されること", () => {
    render(<MandalaCell {...defaultProps} />);
    expect(screen.getByText("テストテキスト")).toBeInTheDocument();
  });

  it("クリック時にonClickが呼ばれること", () => {
    render(<MandalaCell {...defaultProps} />);
    fireEvent.click(screen.getByRole("button"));
    expect(defaultProps.onClick).toHaveBeenCalled();
  });

  it("キーボード操作（Enter）でonClickが呼ばれること", () => {
    render(<MandalaCell {...defaultProps} />);
    fireEvent.keyDown(screen.getByRole("button"), { key: "Enter" });
    expect(defaultProps.onClick).toHaveBeenCalled();
  });

  it("アクセシビリティ違反がないこと", async () => {
    const { container } = render(<MandalaCell {...defaultProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("文字数に応じて動的にフォントサイズが変わること（短い場合）", () => {
    const { container } = render(<MandalaCell {...defaultProps} text="短" />);
    const span = container.querySelector("span");
    expect(span?.style.fontSize).toBe("13px");
  });

  it("文字数に応じて動的にフォントサイズが変わること（長い場合）", () => {
    const { container } = render(
      <MandalaCell
        {...defaultProps}
        text="これは非常に長い思考の断片であり、フォントサイズがさらに縮小されるべき、40文字以上の長いテキストです。"
      />
    );
    const span = container.querySelector("span");
    // 40文字以上なので 9px になるはず
    expect(span?.style.fontSize).toBe("9px");
  });
});
