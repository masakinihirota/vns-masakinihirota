import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import { Input } from "./Input";

describe("Input Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<Input aria-label="Test Input" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("error state should have no accessibility violations", async () => {
    const { container } = render(<Input aria-label="Error Input" isError />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
