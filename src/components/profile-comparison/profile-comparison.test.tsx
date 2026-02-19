import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import * as axe from "vitest-axe";
import { ProfileComparisonContainer } from "./profile-comparison-container";

expect.extend(axe);

describe("ProfileComparisonContainer Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<ProfileComparisonContainer />);
    const results = await axe.axe(container);
    expect(results).toHaveNoViolations();
  });
});
