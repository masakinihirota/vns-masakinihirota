import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Switch } from "./switch";

describe("Switch Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(
      <div className="flex items-center space-x-2">
        <Switch id="airplane-mode" />
        <label htmlFor="airplane-mode">Airplane Mode</label>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
