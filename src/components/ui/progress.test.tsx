import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Progress } from "./progress";

describe("Progress Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<Progress value={33} aria-label="Loading progress" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
