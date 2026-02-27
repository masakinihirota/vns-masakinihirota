import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import { Button } from "./Button";

describe("Button Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("asChild prop should have no accessibility violations", async () => {
    const { container } = render(
      <Button asChild>
        <a href="#">Link Button</a>
      </Button>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
