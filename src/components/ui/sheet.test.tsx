import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./sheet";

describe("Sheet Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(
      <Sheet>
        <SheetTrigger>Open Sheet</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>Sheet description here.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
