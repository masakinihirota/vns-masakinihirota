import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { LatestInfoView } from "./latest-info-view";

describe("LatestInfoView", () => {
  it("アクセシビリティ違反がないこと", async () => {
    const { container } = render(<LatestInfoView works={[]} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("作品リストが空の場合、デモタイムラインが表示されること", () => {
    render(<LatestInfoView works={[]} />);
    expect(screen.getByText("タイムライン")).toBeInTheDocument();
    expect(
      screen.getByText("新しい「SFアニメ」カテゴリの特区が建国されました。")
    ).toBeInTheDocument();
  });

  it("作品リストが渡された場合、それが表示されること", () => {
    const mockWorks = [
      {
        id: "1",
        title: "すごい作品",
        category: "anime",
        author: "テスト作者",
        status: "public",
      },
    ];
    render(<LatestInfoView works={mockWorks} />);
    expect(
      screen.getByText("新作「すごい作品」(anime) が登録されました。")
    ).toBeInTheDocument();
    expect(screen.getByText("テスト作者")).toBeInTheDocument();
  });
});
