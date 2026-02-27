import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Badge } from "./badge";

describe("Badge Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<Badge>Badge Text</Badge>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
