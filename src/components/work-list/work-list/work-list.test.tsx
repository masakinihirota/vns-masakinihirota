import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { WorkList } from "./work-list";
import { PROFILES, Work } from "./work-list.logic";

// ダミーデータ
const mockWorks: Work[] = [
  {
    id: 1,
    title: "Test Anime",
    category: "アニメ",
    tags: ["SF"],
    externalUrl: "#",
    affiliateUrl: "#",
    isOfficial: true,
    userRating: "TIER1",
    lastTier: "TIER1",
  },
];

const defaultProps = {
  works: mockWorks,
  filteredAndSortedWorks: mockWorks,
  currentItems: mockWorks,
  totalPages: 1,
  selectedWork: undefined,
  isLoading: false,
  currentPage: 1,
  adVisible: true,
  selectedWorkId: null,
  sortConfig: { key: "title", direction: "asc" } as const,
  ratingMode: "tier" as const,
  searchInput: "",
  appliedSearch: "",
  enabledCategories: ["アニメ", "漫画"],
  activeProfile: PROFILES[0],
  isProfileAccordionOpen: false,
  profiles: PROFILES,

  onAdVisibleChange: vi.fn(),
  onSelectedWorkIdChange: vi.fn(),
  onPageChange: vi.fn(),
  onSearchInputChange: vi.fn(),
  onActiveProfileChange: vi.fn(),
  onIsProfileAccordionOpenChange: vi.fn(),

  onRatingModeToggle: vi.fn(),
  onCategoryToggle: vi.fn(),
  onSortRequest: vi.fn(),
  onRatingChange: vi.fn(),
  onSearchExecute: vi.fn(),
  onSearchClear: vi.fn(),
};

describe("WorkList UI", () => {
  it("ローディング中はスケルトンが表示される", () => {
    render(<WorkList {...defaultProps} isLoading={true} currentItems={[]} />);
    // スケルトンのクラスを持つ要素があるか確認
    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("データが表示される", () => {
    render(<WorkList {...defaultProps} />);
    screen.debug(); // DOMを出力して確認
    expect(screen.getByText("Test Anime")).toBeInTheDocument();
  });

  it("検索入力が可能", () => {
    render(<WorkList {...defaultProps} />);
    const input = screen.getByPlaceholderText(/作品名・タグで検索/);
    fireEvent.change(input, { target: { value: "search term" } });
    expect(defaultProps.onSearchInputChange).toHaveBeenCalledWith(
      "search term"
    );
  });

  it("作品クリックで選択イベントが発火する", () => {
    render(<WorkList {...defaultProps} />);
    fireEvent.click(screen.getByText("Test Anime"));
    expect(defaultProps.onSelectedWorkIdChange).toHaveBeenCalledWith(1);
  });

  it("評価モードの切り替えボタンが機能する", () => {
    render(<WorkList {...defaultProps} />);
    const tierModeBtn = screen.getByTitle("Tier方式");
    const likeModeBtn = screen.getByTitle("好き方式");

    fireEvent.click(likeModeBtn);
    expect(defaultProps.onRatingModeToggle).toHaveBeenCalledWith("like");

    fireEvent.click(tierModeBtn);
    expect(defaultProps.onRatingModeToggle).toHaveBeenCalledWith("tier");
  });

  it("作品選択時に評価パネルが表示される", () => {
    render(
      <WorkList
        {...defaultProps}
        selectedWork={mockWorks[0]}
        selectedWorkId={1}
      />
    );
    expect(screen.getByText("Editing Work")).toBeInTheDocument();
    expect(screen.getAllByText("Test Anime")).toHaveLength(2);
    // Tierボタンが表示されているか
    expect(screen.getByText("Tier 1")).toBeInTheDocument();
  });

  it("should have no accessibility violations", async () => {
    const { container } = render(<WorkList {...defaultProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
