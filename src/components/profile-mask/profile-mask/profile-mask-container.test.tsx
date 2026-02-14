import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { ProfileMaskContainer } from "./profile-mask-container";

// Mock child components to avoid deep rendering issues in simple unit tests
vi.mock("./profile-mask-view", () => ({
  ProfileMaskView: () => <div data-testid="profile-mask-view" />,
}));

describe("ProfileMaskContainer", () => {
  it("正常にレンダリングされる", () => {
    // Arrange & Act
    const { container } = render(<ProfileMaskContainer />);

    // Assert
    expect(container).toBeTruthy();
  });

  it("アクセシビリティ違反がない", async () => {
    // Arrange
    const { container } = render(<ProfileMaskContainer />);

    // Act
    const results = await axe(container);

    // Assert
    expect(results).toHaveNoViolations();
  });
});
