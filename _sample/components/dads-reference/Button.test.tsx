import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import { Button } from "./Button";

describe("Button Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<Button size="md">テストボタン</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("aria-disabled 状態でアクセシビリティ違反がないこと", async () => {
    const { container } = render(
      <Button size="md" aria-disabled={true}>
        無効ボタン
      </Button>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
