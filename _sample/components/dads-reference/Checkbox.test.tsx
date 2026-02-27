import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import { Checkbox } from "./Checkbox";

describe("Checkbox Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<Checkbox>チェックボックス</Checkbox>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("エラー状態でアクセシビリティ違反がないこと", async () => {
    const { container } = render(<Checkbox isError={true}>エラー項目</Checkbox>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
