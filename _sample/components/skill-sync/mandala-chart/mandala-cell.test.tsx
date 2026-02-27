import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import { MandalaCell } from "./mandala-cell";

describe("MandalaCell Accessibility", () => {
  it("アクセシビリティ違反がないこと", async () => {
    const { container } = render(
      <MandalaCell label="Test Skill" status="SYNC" viewMode="all" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("中央セルの場合にアクセシビリティ違反がないこと", async () => {
    const { container } = render(
      <MandalaCell label="Center Skill" status="NONE" isCenter viewMode="all" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
