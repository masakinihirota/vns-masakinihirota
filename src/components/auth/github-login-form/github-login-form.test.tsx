import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";

import { GitHubLoginForm } from "./github-login-form";

// ロジックのモック
vi.mock("./github-login-form.logic", () => ({
  useGitHubLoginLogic: () => ({
    error: null,
    isLoading: false,
    handleSocialLogin: vi.fn((e) => e.preventDefault()),
    features: [
      { label: "Test Feature", value: "OK", isNegative: false },
    ],
  }),
}));

describe("GitHubLoginForm Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<GitHubLoginForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
