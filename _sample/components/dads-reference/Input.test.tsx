import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import { Input } from "./Input";

describe("Input Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<Input aria-label="テキスト入力" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("エラー状態でアクセシビリティ違反がないこと", async () => {
    const { container } = render(
      <Input aria-label="エラー入力" isError={true} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
