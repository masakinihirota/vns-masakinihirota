import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { TrialStorage } from "@/lib/trial-storage";
import { TrialOnboardingBackButton } from "./TrialOnboardingBackButton";

// モック: next/navigation
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

// モック: TrialStorage
vi.mock("@/lib/trial-storage", () => ({
  TrialStorage: {
    load: vi.fn(),
  },
}));

import { usePathname } from "next/navigation";

describe("TrialOnboardingBackButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("トライアル中かつ /onboarding-trial/choice 以外では表示されること", () => {
    // Arrange
    (usePathname as any).mockReturnValue("/home");
    (TrialStorage.load as any).mockReturnValue({
      rootAccount: { id: "test-id" },
    });

    // Act
    render(<TrialOnboardingBackButton />);

    // Assert
    expect(screen.getByText("旅の選択に戻る")).toBeInTheDocument();
  });

  it("トライアル中でない場合は表示されないこと", () => {
    // Arrange
    (usePathname as any).mockReturnValue("/home");
    (TrialStorage.load as any).mockReturnValue(null);

    // Act
    const { container } = render(<TrialOnboardingBackButton />);

    // Assert
    expect(container.firstChild).toBeNull();
  });

  it("/onboarding-trial/choice ページでは表示されないこと", () => {
    // Arrange
    (usePathname as any).mockReturnValue("/onboarding-trial/choice");
    (TrialStorage.load as any).mockReturnValue({
      rootAccount: { id: "test-id" },
    });

    // Act
    const { container } = render(<TrialOnboardingBackButton />);

    // Assert
    expect(container.firstChild).toBeNull();
  });

  it("アクセシビリティ違反がないこと", async () => {
    // Arrange
    (usePathname as any).mockReturnValue("/home");
    (TrialStorage.load as any).mockReturnValue({
      rootAccount: { id: "test-id" },
    });

    // Act
    const { container } = render(<TrialOnboardingBackButton />);
    const results = await axe(container);

    // Assert
    expect(results).toHaveNoViolations();
  });
});
