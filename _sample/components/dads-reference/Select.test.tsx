import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import { Select } from "./Select";

describe("Select Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(
      <Select aria-label="セレクトボックス">
        <option value="1">オプション1</option>
      </Select>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("エラー状態でアクセシビリティ違反がないこと", async () => {
    const { container } = render(
      <Select aria-label="エラーセレクト" isError={true}>
        <option value="1">オプション1</option>
      </Select>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
