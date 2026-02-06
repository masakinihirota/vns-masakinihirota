import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { HomeTrial } from "./home-trial";

// Mock dependencies
vi.mock("@/components/home/start-page/view-toggle", () => ({
  ViewToggle: ({ onViewModeChange }: any) => (
    <button onClick={() => onViewModeChange("beginner")}>Toggle View</button>
  ),
}));
vi.mock("../trial-banner", () => ({
  TrialBanner: () => <div>Trial Banner</div>,
}));
vi.mock("../views/beginner-guide-view", () => ({
  BeginnerGuideView: () => <div>Beginner Guide</div>,
}));
vi.mock("../views/latest-info-view", () => ({
  LatestInfoView: () => <div>Latest Info</div>,
}));

describe("HomeTrial", () => {
  it("アクセシビリティ違反がないこと", async () => {
    const { container } = render(
      <HomeTrial viewMode="latest" onToggleView={() => {}} />
    );
    const results = await axe(container);
    // Ignore external component issues by mocking, checking container structure
    expect(results).toHaveNoViolations();
  });

  it("デフォルトで最新情報ビューが表示されること", () => {
    render(<HomeTrial viewMode="latest" onToggleView={() => {}} />);
    expect(screen.getByText("Latest Info")).toBeInTheDocument();
    expect(screen.queryByText("Beginner Guide")).toBeNull();
  });

  it("モード切り替えでビューが変わること（Props経由）", () => {
    const handleToggle = vi.fn();
    render(<HomeTrial viewMode="beginner" onToggleView={handleToggle} />);
    expect(screen.getByText("Beginner Guide")).toBeInTheDocument();
  });

  it("トグルボタンクリックでハンドラが呼ばれること", () => {
    const handleToggle = vi.fn();
    render(<HomeTrial viewMode="latest" onToggleView={handleToggle} />);

    fireEvent.click(screen.getByText("Toggle View"));
    expect(handleToggle).toHaveBeenCalledWith("beginner");
  });
});
