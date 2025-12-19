import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ManualMatchingConsole } from "./manual-matching-console";
import { MOCK_SUBJECTS, MOCK_CANDIDATES } from "./manual-matching-console.logic";

// Mock Lucide icons to prevent rendering issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
vi.mock("lucide-react", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as any), // eslint-disable-line @typescript-eslint/no-explicit-any
    User: () => <div data-testid="icon-user">UserIcon</div>,
    Filter: () => <div data-testid="icon-filter">FilterIcon</div>,
    Sun: () => <div>Sun</div>,
    Moon: () => <div>Moon</div>,
    Search: () => <div>Search</div>,
    BookOpen: () => <div>BookOpen</div>,
    Heart: () => <div>Heart</div>,
    Sparkles: () => <div>Sparkles</div>,
    CheckCircle2: () => <div>CheckCircle2</div>,
    Tv: () => <div>Tv</div>,
    Music: () => <div>Music</div>,
    Zap: () => <div>Zap</div>,
  };
});

describe("ManualMatchingConsole UI", () => {
  const mockProps = {
    subjects: MOCK_SUBJECTS,
    candidates: [],
    selectedSubject: null,
    selectedCandidate: null,
    loadingSubjects: false,
    loadingCandidates: false,
    comparisonData: null,
    darkMode: false,
    isMatchModalOpen: false,
    matchComment: "",
    isProcessingMatch: false,
    onSubjectSelect: vi.fn(),
    onCandidateSelect: vi.fn(),
    onToggleDarkMode: vi.fn(),
    onOpenMatchModal: vi.fn(),
    onCloseMatchModal: vi.fn(),
    onExecuteMatch: vi.fn(),
    onMatchCommentChange: vi.fn(),
  };

  it("ヘッダーが表示されること", () => {
    render(<ManualMatchingConsole {...mockProps} />);
    expect(screen.getByText("Manual Matching Console")).toBeInTheDocument();
    expect(screen.getByText("Deep Match Mode")).toBeInTheDocument();
  });

  it("対象会員リストが表示されること", () => {
    render(<ManualMatchingConsole {...mockProps} />);
    // screen.debug(); // Uncomment to debug
    expect(screen.getByText("佐藤 健太")).toBeInTheDocument();
    expect(screen.getByText("ITエンジニア")).toBeInTheDocument();
  });

  it("比較ビュー: 共通の作品が表示されること", () => {
    const selectedSubject = MOCK_SUBJECTS[0];
    const selectedCandidate = MOCK_CANDIDATES[0];
    const comparisonData = {
      commonWorks: [{ category: "comic", title: "宇宙兄弟" } as const],
      subjectUniqueWorks: [],
      candidateUniqueWorks: [],
      commonValues: ["仕事より家庭優先"],
      subjectUniqueValues: [],
      candidateUniqueValues: [],
    };

    render(
      <ManualMatchingConsole
        {...mockProps}
        selectedSubject={selectedSubject}
        selectedCandidate={selectedCandidate}
        comparisonData={comparisonData}
      />,
    );

    expect(screen.getByText(/価値観・作品マッチング/)).toBeInTheDocument();
    expect(screen.getByText("宇宙兄弟")).toBeInTheDocument();
    expect(screen.getByText("仕事より家庭優先")).toBeInTheDocument();
  });
});
