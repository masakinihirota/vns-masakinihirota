import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import * as axeMatchers from "vitest-axe/matchers";

import { renderWithWait } from "@/lib/test-utils";

import { MandalaEditor } from "./mandala-editor";
import { MandalaData } from "./mandala-editor.logic";

expect.extend(axeMatchers);

describe("MandalaEditor", () => {
  const mockData: MandalaData = {
    center: { label: "★", title: "中心目標", items: Array.from({ length: 8 }, () => "") },
    blocks: Array.from({ length: 8 }, (_, index) => ({
      label: (["A", "B", "C", "D", "E", "F", "G", "H"][index] || "") as "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "★",
      title: "サブ目標",
      items: Array.from({ length: 8 }, () => ""),
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

  it("タイトルが表示されること", async () => {
    await renderWithWait(<MandalaEditor {...defaultProps} />);
    expect(screen.getByText("Mandala Pro")).toBeInTheDocument();
  });

  it("Markdown入力エリアが存在すること", async () => {
    await renderWithWait(<MandalaEditor {...defaultProps} />);
    // react-simple-code-editor は内部のtextareaにidを付与できる
    expect(
      screen.getByLabelText("Markdown content for mandala chart")
    ).toBeInTheDocument();
  });

  it("アクセシビリティ違反がないこと", async () => {
    const { container } = await renderWithWait(<MandalaEditor {...defaultProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
