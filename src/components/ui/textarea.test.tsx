import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Textarea } from "./textarea";

describe("Textarea Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(
      <div>
        <label htmlFor="message">Your message</label>
        <Textarea placeholder="Type your message here." id="message" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
