import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { AnonymousLoginForm } from "./anonymous-login-form";

// Logic hook のモック
vi.mock("./anonymous-login-form.logic", () => ({
  useAnonymousLoginLogic: () => ({
    isLoading: false,
    error: null,
    features: [
      { label: "Test Feature", value: "OK", isNegative: false },
    ],
    handleAnonymousLogin: vi.fn(),
  }),
}));

describe("AnonymousLoginForm Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<AnonymousLoginForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
