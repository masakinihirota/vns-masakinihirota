import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

describe("Select Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(
      <Select>
        <SelectTrigger aria-label="Theme">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
