import "vitest-axe/extend-expect";
import { render } from "@testing-library/react";
import React from "react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import OasisDeclarationPage from "./page";

describe("OasisDeclarationPage Accessibility", () => {
  it("アクセシビリティ違反がないこと", async () => {
    const { container } = render(<OasisDeclarationPage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
