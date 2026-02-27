import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Input } from "./input";

describe("Input Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(
      <div>
        <label htmlFor="email">Email</label>
        <Input id="email" type="email" placeholder="Email" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
