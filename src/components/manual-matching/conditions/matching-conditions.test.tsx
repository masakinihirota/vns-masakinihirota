import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MatchingConditions } from "./matching-conditions";
import { DEFAULT_SETTINGS } from "./matching-conditions.logic";

describe("MatchingConditions UI", () => {
  const mockProps = {
    settings: DEFAULT_SETTINGS,
    isSaving: false,
    isStarting: false,
    onValueImportanceChange: vi.fn(),
    onGenreToggle: vi.fn(),
    onLocationChange: vi.fn(),
    onSave: vi.fn(),
    onStartMatching: vi.fn(),
  };

  it("タイトルが表示されること", () => {
    render(<MatchingConditions {...mockProps} />);
    expect(screen.getByText("マッチング条件設定")).toBeInTheDocument();
  });

  it("スライダーが表示されること", () => {
    render(<MatchingConditions {...mockProps} />);
    expect(screen.getByText("仕事より家庭優先")).toBeInTheDocument();
    // Native range input check
    const inputs = screen.getAllByRole("slider");
    expect(inputs.length).toBeGreaterThan(0);
  });

  it("保存ボタンがクリックできること", () => {
    render(<MatchingConditions {...mockProps} />);
    const saveButton = screen.getByText("設定を保存");
    fireEvent.click(saveButton);
    expect(mockProps.onSave).toHaveBeenCalled();
  });
});
