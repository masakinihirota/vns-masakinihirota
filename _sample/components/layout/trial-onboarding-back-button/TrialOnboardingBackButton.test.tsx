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
    vi.mocked(usePathname).mockReturnValue("/home");
    vi.mocked(TrialStorage.load).mockReturnValue({
      rootAccount: { id: "test-id" },
    } as unknown as ReturnType<typeof TrialStorage.load>); // To respect return type if strictly typed, but let's try just value or cast return value

    // Act
    render(<TrialOnboardingBackButton />);

    // Assert
    expect(screen.getByText("旅の選択に戻る")).toBeInTheDocument();
  });

  it("トライアル中でない場合は表示されないこと", () => {
    // Arrange
    vi.mocked(usePathname).mockReturnValue("/home");
    vi.mocked(TrialStorage.load).mockReturnValue(null as any);

    // Act
    const { container } = render(<TrialOnboardingBackButton />);

    // Assert
    expect(container.firstChild).toBeNull();
  });

  it("/onboarding-trial/choice ページでは表示されないこと", () => {
    // Arrange
    vi.mocked(usePathname).mockReturnValue("/onboarding-trial/choice");
    vi.mocked(TrialStorage.load).mockReturnValue({
      rootAccount: { id: "test-id" },
    } as unknown as ReturnType<typeof TrialStorage.load>);

    // Act
    const { container } = render(<TrialOnboardingBackButton />);

    // Assert
    expect(container.firstChild).toBeNull();
  });

  it("アクセシビリティ違反がないこと", async () => {
    // Arrange
    vi.mocked(usePathname).mockReturnValue("/home");
    vi.mocked(TrialStorage.load).mockReturnValue({
      rootAccount: { id: "test-id" },
    } as unknown as ReturnType<typeof TrialStorage.load>);

    // Act
    const { container } = render(<TrialOnboardingBackButton />);
    const results = await axe(container);

    // Assert
    expect(results).toHaveNoViolations();
  });
});
