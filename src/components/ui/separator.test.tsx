import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Separator } from "./separator";

describe("Separator Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(
      <div>
        <p>Section 1</p>
        <Separator />
        <p>Section 2</p>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
