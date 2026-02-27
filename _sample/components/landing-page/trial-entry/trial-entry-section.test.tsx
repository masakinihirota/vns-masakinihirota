import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";

import { renderWithWait } from "@/lib/test-utils";

import { TrialEntrySection } from "./trial-entry-section";
import { useTrialEntry } from "./trial-entry.logic";

// hooksのモック
vi.mock("./trial-entry.logic", () => ({
  useTrialEntry: vi.fn(),
}));

describe("TrialEntrySection Accessibility", () => {
  it("should have no accessibility violations", async () => {
    // Arrange
    vi.mocked(useTrialEntry).mockReturnValue({
      isPending: false,
      handleLocalModeStart: vi.fn(),
    });

    const { container } = await renderWithWait(<TrialEntrySection />);

    // Act
    const results = await axe(container);

    // Assert
    expect(results).toHaveNoViolations();
  });

  it("renders correctly", async () => {
    // Arrange
    vi.mocked(useTrialEntry).mockReturnValue({
      isPending: false,
      handleLocalModeStart: vi.fn(),
    });

    await renderWithWait(<TrialEntrySection />);

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
