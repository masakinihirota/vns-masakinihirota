import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { StatBox } from "./stat-box";

describe("StatBox (Accessibility)", () => {
  it("should have no accessibility violations in default variant", async () => {
    const { container } = render(<StatBox label="Test Label" value="100" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations in cyber variant", async () => {
    const { container } = render(
      <StatBox label="Test Label" value="100" variant="cyber" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
