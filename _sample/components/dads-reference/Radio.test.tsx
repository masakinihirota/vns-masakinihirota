import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import { Radio } from "./Radio";

describe("Radio Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<Radio>ラジオボタン</Radio>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("エラー状態でアクセシビリティ違反がないこと", async () => {
    const { container } = render(<Radio isError={true}>エラー項目</Radio>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
