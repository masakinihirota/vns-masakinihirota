import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll } from "vitest";
import { AutoMatching } from "./auto-matching";
import { UserProfile, MatchStats } from "./auto-matching.logic";

describe("AutoMatching UI", () => {
  beforeAll(() => {
    global.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  const mockProfile: UserProfile = {
    id: "1",
    name: "User 1",
    role: "Dev",
    tags: ["React"],
    icon: "👤",
    color: "bg-blue-500",
    matchScore: 0,
    values: [],
    createdWorks: [],
    favoriteWorks: [],
    skills: [],
  };

  const defaultProps = {
    selectedProfileId: "1",
    selectedCategories: [],
    matchCriterion: "count" as const,
    processLimit: 5,
    scoreThreshold: 80,
    view: "setup" as const,
    matchMode: "expand" as const,
    lastMatchStats: { added: 0, removed: 0 },
    viewingUser: null,
    isSidebarCollapsed: false,
    isRightSidebarCollapsed: false,
    rightSidebarTab: "watch" as const,
    myProfiles: [mockProfile],
    selectedProfile: mockProfile,
    currentWatchList: [],
    currentDriftList: [],
    onProfileSwitch: vi.fn(),
    onToggleCategory: vi.fn(),
    onSetSelectedCategories: vi.fn(),
    onSetMatchCriterion: vi.fn(),
    onSetProcessLimit: vi.fn(),
    onSetScoreThreshold: vi.fn(),
    onSetMatchMode: vi.fn(),
    onRunMatching: vi.fn(),
    onSetView: vi.fn(),
    onViewUser: vi.fn(),
    onCloseUserDetail: vi.fn(),
    onRestoreUser: vi.fn(),
    onRemoveUser: vi.fn(),
    onToggleSidebar: vi.fn(),
    onToggleRightSidebar: vi.fn(),
    onSetRightSidebarTab: vi.fn(),
  };

  it("設定画面が正しくレンダリングされること", () => {
    render(<AutoMatching {...defaultProps} />);
    expect(screen.getByText("自動マッチング設定")).toBeInTheDocument();
    expect(screen.getByText("Matching Management")).toBeInTheDocument();
  });

  it("マッチングモードの切り替えボタンが表示されること", () => {
    render(<AutoMatching {...defaultProps} />);
    expect(screen.getByText("新規プロフィールの追加")).toBeInTheDocument();
    expect(screen.getByText("既存リストの整理")).toBeInTheDocument();
  });

  it("サイドバーのプロファイル切り替え", () => {
    render(<AutoMatching {...defaultProps} />);
    const profileButton = screen.getByText("User 1");
    fireEvent.click(profileButton);
    expect(defaultProps.onProfileSwitch).toHaveBeenCalledWith("1");
  });
});
