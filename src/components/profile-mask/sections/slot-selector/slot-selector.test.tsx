import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { SlotSelector } from "./slot-selector";

describe("SlotSelector", () => {
  const defaultProps = {
    selectedSlots: ["works"],
    onToggle: vi.fn(),
  };

  it("正常にレンダリングされる", () => {
    const { container } = render(<SlotSelector {...defaultProps} />);
    expect(container).toBeTruthy();
  });

  it("アクセシビリティ違反がない", async () => {
    const { container } = render(<SlotSelector {...defaultProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
