import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { OnboardingChoice } from "./OnboardingChoice";

// モック: useRouter
const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe("OnboardingChoice", () => {
  it("should render successfully", () => {
    render(<OnboardingChoice />);
    expect(
      screen.getByText("あなたの旅を選択してください")
    ).toBeInTheDocument();
    expect(screen.getByText("物語を始める")).toBeInTheDocument();
    expect(screen.getByText("自由に探索する")).toBeInTheDocument();
    expect(screen.getByText("仮面を作る")).toBeInTheDocument();
  });

  it("should select a path when clicked", () => {
    render(<OnboardingChoice />);
    const tutorialCard = screen.getByText("物語を始める").closest("div.group"); // カードの親要素を取得

    if (tutorialCard) {
      fireEvent.click(tutorialCard);
    }

    // 選択後のアクションバーが表示されているか確認（opacity-100クラスの有無などで判定も可能だが、ボタンが表示されているかで判定）
    const confirmButton = screen.getByRole("button", {
      name: /このルートで開始する/i,
    });
    expect(confirmButton).toBeVisible(); // opacity制御の場合はtoBeVisibleが通らない可能性もあるので注意が必要
  });

  it("should have no accessibility violations", async () => {
    const { container } = render(<OnboardingChoice />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
