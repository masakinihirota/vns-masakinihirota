import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ValuesList } from "./values-list";
import { VALUES_QUESTIONS } from "./values-list.logic";

// Mock Lucide icons
vi.mock("lucide-react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("lucide-react")>();
  return {
    ...actual,
    Lock: () => <div>Lock</div>,
    Unlock: () => <div>Unlock</div>,
    Loader2: () => <div>Loading</div>,
    Save: () => <div>Save</div>,
  };
});

describe("ValuesList UI", () => {
  const mockProps = {
    questions: VALUES_QUESTIONS,
    answers: {},
    loading: false,
    savingId: null,
    onAnswerChange: vi.fn(),
    onPrivacyToggle: vi.fn(),
  };

  it("タイトルと質問が表示されること", () => {
    render(<ValuesList {...mockProps} />);
    expect(screen.getByText("価値観プロフィール")).toBeInTheDocument();
    expect(screen.getByText("仕事における成長意欲")).toBeInTheDocument();
  });

  it("ロード中表示が出ること", () => {
    render(<ValuesList {...mockProps} loading={true} />);
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("スライダー操作でコールバックが呼ばれること", () => {
    render(<ValuesList {...mockProps} />);
    const sliders = screen.getAllByRole("slider");
    fireEvent.change(sliders[0], { target: { value: "80" } });
    expect(mockProps.onAnswerChange).toHaveBeenCalledWith(
      VALUES_QUESTIONS[0].id,
      80
    );
  });
});
