import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

describe("Avatar Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
