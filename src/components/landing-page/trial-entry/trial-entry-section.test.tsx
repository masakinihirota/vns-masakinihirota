import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { TrialEntrySection } from "./trial-entry-section";
import { useTrialEntry } from "./trial-entry.logic";

// hooksのモック
vi.mock("./trial-entry.logic", () => ({
  useTrialEntry: vi.fn(),
}));

describe("TrialEntrySection Accessibility", () => {
  it("should have no accessibility violations", async () => {
    // Arrange
    (useTrialEntry as any).mockReturnValue({
      isPending: false,
      handleLocalModeStart: vi.fn(),
    });

    const { container } = render(<TrialEntrySection />);

    // Act
    const results = await axe(container);

    // Assert
    expect(results).toHaveNoViolations();
  });

  it("renders correctly", () => {
    // Arrange
    (useTrialEntry as any).mockReturnValue({
      isPending: false,
      handleLocalModeStart: vi.fn(),
    });

    render(<TrialEntrySection />);

    // Assert
    expect(screen.getByText("お試し体験")).toBeInTheDocument();
    expect(screen.getByText("正式メンバー")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /ゲートを開く/ })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /メンバー登録/ })
    ).toBeInTheDocument();
  });
});
