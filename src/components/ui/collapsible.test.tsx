import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible";

describe("Collapsible Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(
      <Collapsible>
        <CollapsibleTrigger>Can I use this in my project?</CollapsibleTrigger>
        <CollapsibleContent>
          Yes. Free to use for personal and commercial projects.
        </CollapsibleContent>
      </Collapsible>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
