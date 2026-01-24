import { render, screen, fireEvent, within } from "@testing-library/react";
import { useState } from "react";
import { describe, it, expect, vi } from "vitest";
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

    // Top 5 languages should be visible
    // 1. Japanese
    expect(screen.getAllByText("日本語 (Japanese)")).toHaveLength(2);
    // 4. Chinese Traditional (Now major)
    expect(
      screen.getAllByText("中国語 (繁体字) (Chinese Traditional)")
    ).toHaveLength(2);

    // 11. German (Now hidden major -> other)
    const hiddenLang = screen.queryByText("ドイツ語 (German)");
    expect(hiddenLang).not.toBeInTheDocument();
  });

  it("shows hidden languages when 'show more' is clicked", () => {
    render(<Step4LanguagePC {...defaultProps} />);

    const nativeSection = screen.getByText("母語 (複数選択可)").closest(".p-4");
    expect(nativeSection).toBeInTheDocument();
    if (!nativeSection) return;

    const showMoreBtn = within(nativeSection as HTMLElement).getByRole(
      "button",
      { name: /もっと見る|すべて表示/ }
    );
    fireEvent.click(showMoreBtn);

    // German is 11th, so it should be visible now
    expect(
      within(nativeSection as HTMLElement).getByText("ドイツ語 (German)")
    ).toBeInTheDocument();
  });

  it("keeps selected hidden language visible after collapsing", () => {
    render(<TestWrapper />);

    const nativeSection = screen.getByText("母語 (複数選択可)").closest(".p-4");
    expect(nativeSection).toBeInTheDocument();
    if (!nativeSection) return;

    // 1. Expand
    const showMoreBtn = within(nativeSection as HTMLElement).getByRole(
      "button",
      { name: /もっと見る/ }
    );
    fireEvent.click(showMoreBtn);

    // 2. Select German (which is normally hidden)
    const germanItem = within(nativeSection as HTMLElement).getByText(
      "ドイツ語 (German)"
    );
    fireEvent.click(germanItem);

    // 3. Collapse
    const closeBtn = within(nativeSection as HTMLElement).getByRole("button", {
      name: /閉じる/,
    });
    fireEvent.click(closeBtn);

    // 4. Verify German is STILL visible because it's selected
    expect(
      within(nativeSection as HTMLElement).getByText("ドイツ語 (German)")
    ).toBeInTheDocument();

    // 5. Verify unselected hidden language (e.g. Russian) is NOT visible
    expect(
      within(nativeSection as HTMLElement).queryByText("ロシア語 (Russian)")
    ).not.toBeInTheDocument();
  });

  it("updates native languages (toggle item)", () => {
    render(<Step4LanguagePC {...defaultProps} />);

    const nativeSection = screen.getByText("母語 (複数選択可)").closest(".p-4");
    expect(nativeSection).toBeInTheDocument();
    if (!nativeSection) return;

    const japaneseItem = within(nativeSection as HTMLElement).getByText(
      "日本語 (Japanese)"
    );
    fireEvent.click(japaneseItem);

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        nativeLanguages: ["日本語 (Japanese)"],
      })
    );
  });

  it("updates available languages (toggle item)", () => {
    render(<Step4LanguagePC {...defaultProps} />);

    const availableSection = screen.getByText("使用可能言語").closest(".p-4");
    expect(availableSection).toBeInTheDocument();
    if (!availableSection) return;

    const englishItem = within(availableSection as HTMLElement).getByText(
      "英語 (English)"
    );
    fireEvent.click(englishItem);

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        availableLanguages: ["英語 (English)"],
      })
    );
  });

  it("excludes 'Other' option from available languages but keeps it in native languages", () => {
    render(<Step4LanguagePC {...defaultProps} />);

    // 1. Check Native Languages (should have Other)
    const nativeSection = screen.getByText("母語 (複数選択可)").closest(".p-4");
    expect(nativeSection).toBeInTheDocument();

    // Expand list
    const showMoreNative = within(nativeSection as HTMLElement).getByRole(
      "button",
      {
        name: /もっと見る|すべて表示/,
      }
    );
    fireEvent.click(showMoreNative);

    expect(
      within(nativeSection as HTMLElement).getByText("その他 (Other)")
    ).toBeInTheDocument();

    // 2. Check Available Languages (should NOT have Other)
    const availableSection = screen.getByText("使用可能言語").closest(".p-4");
    expect(availableSection).toBeInTheDocument();

    // Expand list (if button exists - it might not if Other was the only one hidden, but there are others)
    // Actually, "Other" is the last item. There are 12 items. Major is 5. So 7 hidden.
    // If we remove "Other", there are 11 items. Major 5. 6 hidden.
    // So "Show More" should still exist.
    const showMoreAvailable = within(
      availableSection as HTMLElement
    ).queryByRole("button", {
      name: /もっと見る|すべて表示/,
    });

    // If show more exists, click it to reveal everything
    if (showMoreAvailable) {
      fireEvent.click(showMoreAvailable);
    }

    expect(
      within(availableSection as HTMLElement).queryByText("その他 (Other)")
    ).not.toBeInTheDocument();
  });

  it("should have no accessibility violations", async () => {
    const { container } = render(<Step4LanguagePC {...defaultProps} />);
    const results = await axe(container);
    // @ts-ignore
    expect(results).toHaveNoViolations();
  });
});
