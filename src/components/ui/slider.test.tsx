import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Slider } from "./slider";

describe("Slider Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(
      <Slider defaultValue={[50]} max={100} step={1} aria-label="Volume" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
