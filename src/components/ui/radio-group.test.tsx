import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { RadioGroup, RadioGroupItem } from "./radio-group";

describe("RadioGroup Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(
      <RadioGroup defaultValue="option-one">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-one" id="option-one" />
          <label htmlFor="option-one">Option One</label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-two" id="option-two" />
          <label htmlFor="option-two">Option Two</label>
        </div>
      </RadioGroup>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
