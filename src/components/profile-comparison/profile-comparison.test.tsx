import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { toHaveNoViolations } from "vitest-axe/matchers";
import { ProfileComparisonContainer } from "./profile-comparison-container";

expect.extend(toHaveNoViolations);

describe("ProfileComparisonContainer Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<ProfileComparisonContainer />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
