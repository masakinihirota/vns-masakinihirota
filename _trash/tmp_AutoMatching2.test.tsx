import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import AutoMatching2 from "./tmp_AutoMatching2";

// ResizeObserver mock
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe("AutoMatching2 Accessibility", () => {
  it("should have no accessibility violations on initial render", async () => {
    const { container } = render(<AutoMatching2 />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no violations when sidebar is collapsed", async () => {
    const { container } = render(<AutoMatching2 />);

    // Use more specific selector if possible, or assume label is applied
    const toggleButtons = screen.getAllByLabelText(
      /Collapse sidebar|Expand sidebar/
    );
    // Specifically click the left sidebar one
    fireEvent.click(toggleButtons[0]);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no violations in dark mode", async () => {
    const { container } = render(<AutoMatching2 />);
    const themeToggle = screen.getByTitle("Toggle Theme");
    fireEvent.click(themeToggle); // Switch to Dark

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
