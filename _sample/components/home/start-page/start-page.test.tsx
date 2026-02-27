import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";

import { StartPage } from "./start-page";

describe("StartPage", () => {
  const defaultProps = {
    viewMode: "latest" as const,
    onViewModeChange: vi.fn(),
  };

  it("アクセシビリティ違反がないこと", async () => {
    const { container } = render(<StartPage {...defaultProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("ヘッダーと主要なセクションが表示されること", () => {
    render(<StartPage {...defaultProps} />);
    expect(screen.getByRole("heading", { name: /masakinihirota/i })).toBeInTheDocument();
  });

  it("最新情報ビューが表示されること（初期表示）", () => {
    render(<StartPage {...defaultProps} />);
    expect(screen.getByText(/おかえりなさい/i)).toBeInTheDocument();
    expect(screen.getByText(/タイムライン/i)).toBeInTheDocument();
  });

  it("ビギナーガイドビューが表示されること（切り替え時）", () => {
    render(<StartPage {...defaultProps} viewMode="beginner" />);
    expect(screen.getByTestId("beginner-guide-title")).toBeInTheDocument();
  });
});
