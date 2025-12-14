import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AutoMatching } from "./auto-matching";
import { SearchCriteria, MatchingScore } from "./auto-matching.logic";

describe("AutoMatching UI", () => {
  // Mock ResizeObserver for Radix UI
  beforeAll(() => {
    global.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  const defaultCriteria: SearchCriteria = {
    role: "Frontend Engineer",
    skills: [],
    location: "東京",
    min_salary: 600,
    remote: false,
  };

  const mockProps = {
    criteria: defaultCriteria,
    results: [],
    loading: false,
    darkMode: false,
    onCriteriaChange: vi.fn(),
    onSearch: vi.fn(),
    onToggleDarkMode: vi.fn(),
  };

  it("検索条件フォームが表示されること", () => {
    render(<AutoMatching {...mockProps} />);
    expect(screen.getByText(/マッチング条件/)).toBeInTheDocument();
    expect(screen.getByText(/希望職種/)).toBeInTheDocument();
    expect(screen.getByText(/勤務地/)).toBeInTheDocument();
  });

  it("検索ボタンをクリックするとonSearchが呼ばれること", () => {
    render(<AutoMatching {...mockProps} />);
    const button = screen.getByRole("button", { name: /再検索/i });
    fireEvent.click(button);
    expect(mockProps.onSearch).toHaveBeenCalled();
  });

  it("結果がある場合、リストが表示されること", () => {
    const results: MatchingScore[] = [
      {
        session_id: "1",
        candidate_id: "c1",
        score: 0.9,
        rank: 1,
        explanation: { skill_match: 90, salary_match: 100, location_match: 100, tags: [] },
        candidate: {
          id: "c1",
          name: "Test Candidate",
          role: "Frontend",
          skills: [],
          location: "Tokyo",
          min_salary: 500,
          max_salary: 800,
          experience_years: 5,
          avatar_url: "",
        },
        created_at: new Date().toISOString(),
      },
    ];
    render(<AutoMatching {...mockProps} results={results} />);

    expect(screen.getByText(/Match/)).toBeInTheDocument();
    expect(screen.getByText(/Test Candidate/)).toBeInTheDocument();
  });
});
