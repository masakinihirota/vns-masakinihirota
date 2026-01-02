import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { OnboardingForm } from "./onboarding-form";

const { pushMock } = vi.hoisted(() => {
  return { pushMock: vi.fn() };
});

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe("OnboardingForm", () => {
  it("オンボーディングフォームがレンダリングされること", () => {
    // ResizeObserver mock
    global.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };

    render(<OnboardingForm userId="test-user-id" />);
    expect(screen.getByText("ルートアカウント作成")).toBeInTheDocument();
  });

  it("completes the full flow and submits data", async () => {
    // Mock alert
    global.alert = vi.fn();

    const { container } = render(<OnboardingForm userId="user_123" />);

    // Step 1: Identity
    const zodiacSelect = container.querySelector("#zodiac_sign");
    if (!zodiacSelect) throw new Error("Zodiac select not found");
    fireEvent.change(zodiacSelect, { target: { value: "獅子座" } });

    const generationSelect = container.querySelector("#birth_generation");
    if (!generationSelect) throw new Error("Generation select not found");
    fireEvent.change(generationSelect, { target: { value: "1990年代" } });

    fireEvent.click(screen.getByText("次へ"));

    // Step 2: Culture
    const cultureLabel = screen.getByLabelText(/文化圏/);
    fireEvent.change(cultureLabel, { target: { value: "english" } });

    const countrySelect = screen.getByRole("combobox", { name: "国" });
    fireEvent.change(countrySelect, { target: { value: "その他 (Others)" } });

    fireEvent.click(screen.getByText("次へ"));

    // Step 3: Hours
    // We need to click "完了"
    fireEvent.click(screen.getByText("完了"));

    await waitFor(
      () => {
        expect(pushMock).toHaveBeenCalledWith("/root-accounts");
      },
      { timeout: 5000 }
    );
  });
});
