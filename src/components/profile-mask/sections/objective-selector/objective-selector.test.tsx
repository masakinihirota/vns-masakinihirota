import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { ObjectiveSelector } from "./objective-selector";

describe("ObjectiveSelector", () => {
  const defaultProps = {
    selectedIds: ["build_work"],
    onToggle: vi.fn(),
  };

  it("正常にレンダリングされる", () => {
    const { container } = render(<ObjectiveSelector {...defaultProps} />);
    expect(container).toBeTruthy();
  });

  it("アクセシビリティ違反がない", async () => {
    const { container } = render(<ObjectiveSelector {...defaultProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
