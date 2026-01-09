import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import * as axeMatchers from "vitest-axe/matchers";
import { MandalaEditor } from "./mandala-editor";
import { MandalaData } from "./mandala-editor.logic";

// PrismJSの完全なモック化
vi.mock("prismjs", () => ({
  default: {
    highlight: vi.fn((code) => code),
    highlightAll: vi.fn(),
    languages: { markdown: {} },
  },
}));
vi.mock("prismjs/components/prism-markdown", () => ({}));
vi.mock("prismjs/themes/prism-tomorrow.css", () => ({}));

// グローバル Prism のモック（ReferenceError対策）
(global as any).Prism = {
  highlight: vi.fn((code) => code),
  highlightAll: vi.fn(),
  languages: { markdown: {} },
};

expect.extend(axeMatchers);

describe("MandalaEditor", () => {
  const mockData: MandalaData = {
    center: { label: "★", title: "中心目標", items: Array(8).fill("") },
    blocks: Array(8)
      .fill(null)
      .map((_, i) => ({
        label: ["A", "B", "C", "D", "E", "F", "G", "H"][i] as any,
        title: "サブ目標",
        items: Array(8).fill(""),
      })),
  };

  const defaultProps = {
    markdown: "# [C] 中心目標",
    setMarkdown: vi.fn(),
    data: mockData,
    copied: false,
    onCopy: vi.fn(),
    onReset: vi.fn(),
    onClearBlock: vi.fn(),
    onCellEdit: vi.fn(),
    // Added props
    displayMode: "split" as const,
    fitMode: "width" as const,
    onFitModeChange: vi.fn(),
    onDisplayModeChange: vi.fn(),
  };

  it("タイトルが表示されること", () => {
    render(<MandalaEditor {...defaultProps} />);
    expect(screen.getByText("Mandala Markdown Editor")).toBeInTheDocument();
  });

  it("Markdown入力エリアが存在すること", () => {
    render(<MandalaEditor {...defaultProps} />);
    // react-simple-code-editor は内部のtextareaにidを付与できる
    expect(
      screen.getByLabelText("Markdown content for mandala chart")
    ).toBeInTheDocument();
  });

  it("アクセシビリティ違反がないこと", async () => {
    const { container } = render(<MandalaEditor {...defaultProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
