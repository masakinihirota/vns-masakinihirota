import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Checkbox } from "./checkbox";

describe("Checkbox Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(
      <div>
        <Checkbox id="terms" />
        <label htmlFor="terms">Accept terms</label>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
