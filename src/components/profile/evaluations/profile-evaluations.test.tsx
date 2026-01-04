import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { ProfileEvaluations, Evaluation } from "./profile-evaluations";
import "vitest-axe/extend-expect";

const mockEvaluations: Evaluation[] = [
  {
    id: 1,
    title: "Anime 1 (T1)",
    category: "アニメ",
    status: "now",
    tier: "tier1",
  },
  {
    id: 2,
    title: "Anime 2 (T2)",
    category: "アニメ",
    status: "now",
    tier: "tier2",
  },
  {
    id: 3,
    title: "Anime 3 (T3)",
    category: "アニメ",
    status: "now",
    tier: "tier3",
  },
  {
    id: 4,
    title: "Anime 4 (Normal)",
    category: "アニメ",
    status: "now",
    tier: "normal",
  },
  {
    id: 5,
    title: "Manga 1 (T1)",
    category: "漫画",
    status: "now",
    tier: "tier1",
  },
];

function ProfileEvaluationsWrapper({
  evaluations,
}: {
  evaluations: Evaluation[];
}) {
  const [selectedCategory, setSelectedCategory] = React.useState("全部");
  const [viewMode, setViewMode] = React.useState<"simple" | "tiered">("simple");
  return (
    <ProfileEvaluations
      evaluations={evaluations}
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
      viewMode={viewMode}
      setViewMode={setViewMode}
    />
  );
}

describe("ProfileEvaluations", () => {
  it("アクセシビリティ違反がないこと", async () => {
    const { container } = render(
      <ProfileEvaluations
        evaluations={mockEvaluations}
        selectedCategory="全部"
        setSelectedCategory={() => { }}
        viewMode="simple"
        setViewMode={() => { }}
      />
    );
    const results = await axe(container);
    if (results.violations.length > 0) {
      console.info(JSON.stringify(results.violations, null, 2));
    }
    // @ts-ignore
    expect(results).toHaveNoViolations();
  });

  it("初期表示（評価は好き一択モード）でTier 1, 2, 3の作品のみが表示され、Tier列が表示されないこと", async () => {
    render(<ProfileEvaluationsWrapper evaluations={mockEvaluations} />);

    // 「評価は好き一択」ボタンがアクティブであることを確認
    const simpleBtn = screen.getByText("評価は好き一択");
    expect(simpleBtn).toHaveClass("bg-slate-900");

    // Tier 1, 2, 3 の作品が表示されている
    expect(screen.getByText("Anime 1 (T1)")).toBeInTheDocument();
    expect(screen.getByText("Anime 2 (T2)")).toBeInTheDocument();
    expect(screen.getByText("Anime 3 (T3)")).toBeInTheDocument();

    // normal の作品は表示されていない
    expect(screen.queryByText("Anime 4 (Normal)")).not.toBeInTheDocument();

    // "Tier" というヘッダーが存在しないことを確認
    expect(screen.queryByText("Tier")).not.toBeInTheDocument();
  });

  it("モードを切り替えると、全ての作品が表示され、Tier列が表示されること", async () => {
    render(<ProfileEvaluationsWrapper evaluations={mockEvaluations} />);

    const tieredBtn = screen.getByText("評価は絶対相対評価 Tier方式");
    fireEvent.click(tieredBtn);

    // 全ての作品が表示されている
    expect(screen.getByText("Anime 1 (T1)")).toBeInTheDocument();
    expect(screen.getByText("Anime 2 (T2)")).toBeInTheDocument();
    expect(screen.getByText("Anime 3 (T3)")).toBeInTheDocument();
    expect(screen.getByText("Anime 4 (Normal)")).toBeInTheDocument();

    // "Tier" ヘッダーが表示されている
    expect(screen.getAllByText("Tier")[0]).toBeInTheDocument();

    // Tierの値（1, 2, 3, 普）が表示されていることを確認
    expect(screen.getAllByText("1")[0]).toBeInTheDocument();
    expect(screen.getAllByText("普")[0]).toBeInTheDocument();
  });

  it("カテゴリを切り替えると、該当するカテゴリの作品のみが表示され、'全部'選択時は全カテゴリが表示されること", async () => {
    render(<ProfileEvaluationsWrapper evaluations={mockEvaluations} />);

    // 初期状態は「全部」なので全て表示
    expect(screen.getByText("Anime 1 (T1)")).toBeInTheDocument();
    expect(screen.getByText("Manga 1 (T1)")).toBeInTheDocument();

    // アニメに切り替え
    fireEvent.click(screen.getByText("アニメ"));
    expect(screen.getByText("Anime 1 (T1)")).toBeInTheDocument();
    expect(screen.queryByText("Manga 1 (T1)")).not.toBeInTheDocument();

    // 漫画に切り替え
    fireEvent.click(screen.getByText("漫画"));
    expect(screen.queryByText("Anime 1 (T1)")).not.toBeInTheDocument();
    expect(screen.getByText("Manga 1 (T1)")).toBeInTheDocument();

    // 全部に戻す
    fireEvent.click(screen.getByText("全部"));
    expect(screen.getByText("Anime 1 (T1)")).toBeInTheDocument();
    expect(screen.getByText("Manga 1 (T1)")).toBeInTheDocument();
  });
});
