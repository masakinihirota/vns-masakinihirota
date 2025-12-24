import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { WorksList } from "./work-list";
import { MOCK_WORKS } from "./work-list.logic";

// Mock Lucide icons
// eslint-disable-next-line @typescript-eslint/no-explicit-any
vi.mock("lucide-react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("lucide-react")>();
  return {
    ...(actual as any), // eslint-disable-line @typescript-eslint/no-explicit-any
    Plus: () => <div>Plus</div>,
    BookOpen: () => <div>BookOpen</div>,
    Film: () => <div>Film</div>,
    Gamepad2: () => <div>Gamepad2</div>,
    Monitor: () => <div>Monitor</div>,
    MoreHorizontal: () => <div>MoreHorizontal</div>,
    Loader2: () => <div>Loading</div>,
    ExternalLink: () => <div>ExternalLink</div>,
  };
});

describe("WorksList UI", () => {
  const mockProps = {
    works: MOCK_WORKS,
    loading: false,
    onCreateNew: vi.fn(),
  };

  it("タイトルとリストが表示されること", () => {
    render(<WorksList {...mockProps} />);
    expect(screen.getByText("作品ライブラリ")).toBeInTheDocument();
    expect(screen.getByText("STEINS;GATE")).toBeInTheDocument();
    expect(screen.getByText("葬送のフリーレン")).toBeInTheDocument();
  });

  it("新規登録ボタンがクリックできること", () => {
    render(<WorksList {...mockProps} />);
    const button = screen.getByText("新規登録");
    fireEvent.click(button);
    expect(mockProps.onCreateNew).toHaveBeenCalled();
  });

  it("ロード中表示が出ること", () => {
    render(<WorksList {...mockProps} loading={true} />);
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });
});
