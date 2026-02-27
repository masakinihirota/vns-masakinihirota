import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Skeleton } from "./skeleton";

describe("Skeleton Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<Skeleton className="w-[100px] h-[20px] rounded-full" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
