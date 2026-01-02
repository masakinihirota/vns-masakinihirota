import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { Step4LanguagePC } from "./step4-language-pc";

describe("Step4LanguagePC", () => {
  const mockUpdate = vi.fn();
  const defaultProps = {
    data: {
      nativeLanguages: [],
      availableLanguages: [],
    },
    onUpdate: mockUpdate,
  };

  it("renders language fields", () => {
    render(<Step4LanguagePC {...defaultProps} />);

    expect(screen.getByText(/母語 .複数選択可./)).toBeInTheDocument();
    expect(screen.getByText("使用可能言語")).toBeInTheDocument();
    expect(screen.getByText("言語能力タイプ")).toBeInTheDocument();
  });

  it("updates native languages (toggle)", () => {
    render(<Step4LanguagePC {...defaultProps} />);

    // Get all checkboxes for a specific language.
    // 1st should be Native, 2nd should be Available (based on render order)
    const japaneseCheckboxes = screen.getAllByLabelText("日本語 (Japanese)");
    const nativeCheckbox = japaneseCheckboxes[0];

    fireEvent.click(nativeCheckbox);

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        nativeLanguages: ["日本語 (Japanese)"],
      })
    );
  });

  it("updates available languages (toggle)", () => {
    render(<Step4LanguagePC {...defaultProps} />);

    const englishCheckboxes = screen.getAllByLabelText("英語 (English)");
    const availableCheckbox = englishCheckboxes[1]; // 2nd one is Available

    fireEvent.click(availableCheckbox);

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        availableLanguages: ["英語 (English)"],
      })
    );
  });

  it("updates language ability type", () => {
    render(<Step4LanguagePC {...defaultProps} />);

    const aiRadio = screen.getByLabelText(/AI使用の力での言語能力/);
    fireEvent.click(aiRadio);

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        uses_ai_translation: true,
      })
    );
  });
});
