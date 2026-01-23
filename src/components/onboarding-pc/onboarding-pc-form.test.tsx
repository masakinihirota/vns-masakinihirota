import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { OnboardingPCForm } from "./onboarding-pc-form";

// Mock implementation of scrollIntoView
window.HTMLElement.prototype.scrollIntoView = function () {};

// Mock router
// vi.mock("next/navigation", () => ({
//   useRouter: () => ({
//     push: vi.fn(),
//   }),
// }));
// Assuming vitest setup handles modules mocking or we need to add it.
// Since import is from vitest, use vi.mock

import { vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("OnboardingPCForm", () => {
  it("renders the first step correctly", () => {
    render(<OnboardingPCForm userId="test-user-id" />);
    expect(screen.getByText("アカウント作成")).toBeInTheDocument();
    expect(screen.getByText(/VNSへようこそ！/)).toBeInTheDocument();
    // Step 1 title or content
    // Assuming StepDeclarationsPC renders something identifiable
  });

  it("should have no accessibility violations in initial state", async () => {
    const { container } = render(<OnboardingPCForm userId="test-user-id" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
