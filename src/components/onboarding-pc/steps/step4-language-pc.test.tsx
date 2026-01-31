import { fireEvent, render, screen, within } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import * as matchers from "vitest-axe/matchers";
import { Step4LanguagePC } from "./step4-language-pc";

expect.extend(matchers);

// Wrapper component to handle state updates for tests
const TestWrapper = () => {
  const [data, setData] = useState<any>({
    nativeLanguages: [],
    availableLanguages: [],
    uses_ai_translation: null,
  });

  const handleUpdate = (newData: any) => {
    setData((prev: any) => ({ ...prev, ...newData }));
  };

  return <Step4LanguagePC data={data} onUpdate={handleUpdate} />;
};

describe("Step4LanguagePC", () => {
  const mockUpdate = vi.fn();
  const defaultProps = {
    data: {
      nativeLanguages: [],
      availableLanguages: [],
    },
    onUpdate: mockUpdate,
  };

  it("renders major languages initially", () => {
    render(<Step4LanguagePC {...defaultProps} />);

    // 「日本語 (Japanese)」は両方のセクションの主要言語（AVAILABLE_LANGUAGE_OPTIONS の先頭に移動したため）
    expect(screen.getAllByText("日本語 (Japanese)")).toHaveLength(2);

    // 「英語 (English)」も両方のセクションの主要言語
    expect(screen.getAllByText("英語 (English)")).toHaveLength(2);

    // 母語セクションの主要5件に入っていない言語（例：韓国語）が非表示であることを確認
    // インデックスによっては表示される可能性があるので、確実なものを選択
    const hiddenLang = screen.queryByText("ロシア語 (Russian)");
    expect(hiddenLang).not.toBeInTheDocument();
  });

  it("shows hidden languages when 'show more' is clicked", () => {
    render(<Step4LanguagePC {...defaultProps} />);

    const nativeSection = screen.getByTestId("native-languages-section");
    expect(nativeSection).toBeInTheDocument();

    const showMoreBtn = within(nativeSection).getByRole("button", {
      name: /もっと見る|すべて表示/,
    });
    fireEvent.click(showMoreBtn);

    // ドイツ語などは展開後に表示されるはず
    expect(
      within(nativeSection).getByText("ドイツ語 (German)")
    ).toBeInTheDocument();
  });

  it("keeps selected hidden language visible after collapsing", () => {
    render(<TestWrapper />);

    const nativeSection = screen.getByTestId("native-languages-section");
    expect(nativeSection).toBeInTheDocument();

    // 1. Expand
    const showMoreBtn = within(nativeSection).getByRole("button", {
      name: /もっと見る/,
    });
    fireEvent.click(showMoreBtn);

    // 2. Select German (which is normally hidden)
    const germanItem = within(nativeSection).getByText("ドイツ語 (German)");
    fireEvent.click(germanItem);

    // 3. Collapse
    const closeBtn = within(nativeSection).getByRole("button", {
      name: /閉じる/,
    });
    fireEvent.click(closeBtn);

    // 4. Verify German is STILL visible because it's selected
    expect(
      within(nativeSection).getByText("ドイツ語 (German)")
    ).toBeInTheDocument();

    // 5. Verify unselected hidden language (e.g. Russian) is NOT visible
    expect(
      within(nativeSection).queryByText("ロシア語 (Russian)")
    ).not.toBeInTheDocument();
  });

  it("updates native languages (toggle item)", () => {
    render(<Step4LanguagePC {...defaultProps} />);

    const nativeSection = screen.getByTestId("native-languages-section");
    expect(nativeSection).toBeInTheDocument();

    const nativeItem = within(nativeSection).getByText("日本語 (Japanese)");
    fireEvent.click(nativeItem);

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        nativeLanguages: ["日本語 (Japanese)"],
      })
    );
  });

  it("updates available languages (toggle item)", () => {
    render(<Step4LanguagePC {...defaultProps} />);

    const section = screen.getByTestId("available-languages-section");
    expect(section).toBeInTheDocument();

    // 日本語 (Japanese) が初期表示（主要リストの上位5件）にあるはず
    expect(within(section).getByText("日本語 (Japanese)")).toBeInTheDocument();

    // N1 などは初期表示にはないはず
    expect(within(section).queryByText(/N1：/)).not.toBeInTheDocument();

    // 「英語 (English)」を選択テスト
    const englishItem = within(section).getByText("英語 (English)");
    fireEvent.click(englishItem);

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        availableLanguages: ["英語 (English)"],
      })
    );

    // 「もっと見る」をクリックして展開
    const showMoreBtn = within(section).getByRole("button", {
      name: /もっと見る/,
    });
    fireEvent.click(showMoreBtn);

    // 展開後に N1 が表示されることを確認
    expect(within(section).getByText(/N1：/)).toBeInTheDocument();
  });

  it("excludes 'Other' option from available languages but keeps it in native languages", () => {
    render(<Step4LanguagePC {...defaultProps} />);

    // 1. Check Native Languages (should have Other)
    const nativeSection = screen.getByTestId("native-languages-section");
    expect(nativeSection).toBeInTheDocument();

    // Expand list
    const showMoreNative = within(nativeSection).getByRole("button", {
      name: /もっと見る|すべて表示/,
    });
    fireEvent.click(showMoreNative);

    expect(
      within(nativeSection).getByText("その他 (Other)")
    ).toBeInTheDocument();

    // 2. Check Available Languages (should NOT have Other)
    const availableSection = screen.getByTestId("available-languages-section");
    expect(availableSection).toBeInTheDocument();

    // Expand list
    const showMoreAvailable = within(availableSection).queryByRole("button", {
      name: /もっと見る|すべて表示/,
    });

    // If show more exists, click it to reveal everything
    if (showMoreAvailable) {
      fireEvent.click(showMoreAvailable);
    }

    expect(
      within(availableSection).queryByText("その他 (Other)")
    ).not.toBeInTheDocument();
  });

  it("should have no accessibility violations", async () => {
    const { container } = render(<Step4LanguagePC {...defaultProps} />);
    const results = await axe(container);
    // @ts-ignore
    expect(results).toHaveNoViolations();
  });
});
