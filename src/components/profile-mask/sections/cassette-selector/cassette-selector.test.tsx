import { render } from "@testing-library/react";
import { Disc } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { CassetteSelector } from "./cassette-selector";

describe("CassetteSelector", () => {
  const defaultProps = {
    label: "テストラベル",
    icon: Disc,
    colorClass: "border-l-blue-500",
    cassettes: [
      { id: "c1", name: "カセット1", items: [] },
      { id: "c2", name: "カセット2", items: [] },
    ],
    selectedId: "c1",
    onSelect: vi.fn(),
  };

  it("正常にレンダリングされる", () => {
    const { container } = render(<CassetteSelector {...defaultProps} />);
    expect(container).toBeTruthy();
    expect(container.textContent).toContain("テストラベル");
    expect(container.textContent).toContain("カセット1");
  });

  it("アクセシビリティ違反がない", async () => {
    const { container } = render(<CassetteSelector {...defaultProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
