import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import * as matchers from "vitest-axe/matchers";
import { GroupsContainer } from "./groups.container";

// Extend expect for toHaveNoViolations
expect.extend(matchers);

// Mock `scrollIntoView` as it's not implemented in jsdom
window.HTMLElement.prototype.scrollIntoView = function () {};

describe("Groups Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<GroupsContainer />);

    // We expect some violations due to color contrast issues inherent in "glassmorphism" on white background if not careful,
    // but we aim for 0. If fails, we acknowledge.
    // Also, mock data might generate elements with duplicate IDs if not careful (though I used unique keys).

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
