import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";

import { AnonymousLoginForm } from "./anonymous-login-form";

// ロジックのモック
vi.mock("./anonymous-login-form.logic", () => ({
  useAnonymousLoginLogic: () => ({
    error: null,
    isLoading: false,
    handleAnonymousLogin: vi.fn((e) => e.preventDefault()),
    features: [
      { label: "Test Feature", value: "OK", isNegative: false },
    ],
  }),
}));

describe("AnonymousLoginForm Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<AnonymousLoginForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
