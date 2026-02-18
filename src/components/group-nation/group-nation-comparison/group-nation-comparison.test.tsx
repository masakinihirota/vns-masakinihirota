import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { GroupNationComparison } from "./group-nation-comparison";

describe("GroupNationComparison", () => {
  it("アクセシビリティの違反がないこと", async () => {
    const { container } = render(<GroupNationComparison />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("グループと国のタイトルが表示されていること", () => {
    render(<GroupNationComparison />);
    expect(screen.getByText("グループ (Group)")).toBeInTheDocument();
    expect(screen.getByText("国 (Nation)")).toBeInTheDocument();
  });

  it("仕様書に基づいたキーワードが含まれていること", () => {
    render(<GroupNationComparison />);
    // 曖昧一致を使用して、一部の文字列が含まれているかチェック
    expect(screen.getByText(/個人の「マッチング」/)).toBeInTheDocument();
    expect(screen.getByText(/複数のグループの集合/)).toBeInTheDocument();
    expect(
      screen.getByText(/外向き：社会・活動のインフラ/)
    ).toBeInTheDocument();
  });
});
