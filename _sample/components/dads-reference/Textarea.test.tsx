import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import { Textarea } from "./Textarea";

describe("Textarea Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<Textarea aria-label="テキストエリア" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("エラー状態でアクセシビリティ違反がないこと", async () => {
    const { container } = render(
      <Textarea aria-label="エラーテキストエリア" isError={true} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
