import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";

import { GoogleLoginForm } from "./google-login-form";

// ロジックのモック
vi.mock("./google-login-form.logic", () => ({
  useGoogleLoginLogic: () => ({
    error: null,
    isLoading: false,
    handleSocialLogin: vi.fn((e) => e.preventDefault()),
    features: [
      { label: "Test Feature", value: "OK", isNegative: false },
    ],
  }),
}));

describe("GoogleLoginForm Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<GoogleLoginForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
