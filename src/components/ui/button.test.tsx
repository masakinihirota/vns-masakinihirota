import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Button } from "./button";

describe("Button Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
