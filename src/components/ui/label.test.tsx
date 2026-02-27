import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Label } from "./label";

describe("Label Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(
      <div>
        <Label htmlFor="terms">Accept terms and conditions</Label>
        <input id="terms" type="checkbox" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
