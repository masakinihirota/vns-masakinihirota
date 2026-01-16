import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { StepConfirmationPC } from "./step-confirmation-pc";

describe("StepConfirmationPC", () => {
  const mockOnBack = vi.fn();
  const mockOnSubmit = vi.fn();

  const validData = {
    // Step 1
    activity_area_id: 1,
    activity_culture_code: "japanese",
    selectedCountry: "日本",
    selectedRegion: "Tokyo",
    // Step 3
    is_minor: false,
    zodiac_sign: "aries",
    birth_generation: "1990",
    // Step 4
    nativeLanguages: ["Japanese"],
    // Step 2
    basic_values: {
      q1: "a",
      q2: "a",
      q3: "a",
      q4: "a",
      q5: "a",
      q6: "a",
      q7: "a",
      q8: "a",
      q9: "a",
      q10: "a",
    },
  };

  const invalidData = {
    activity_area_id: null,
    moon_location: "",
    mars_location: "",
    activity_culture_code: "",
    is_minor: undefined,
    zodiac_sign: "",
    nativeLanguages: [],
  };

  it("should have no accessibility violations", async () => {
    const { container } = render(
      <StepConfirmationPC
        data={validData}
        onBack={mockOnBack}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders valid status for all items when data is complete", () => {
    render(
      <StepConfirmationPC
        data={validData}
        onBack={mockOnBack}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
      />
    );

    expect(
      screen.getByText("入力完了です！設定を保存できます")
    ).toBeInTheDocument();

    // Check for "OK" badges (optional, but good to verify logic)
    const okBadges = screen.getAllByText("OK");
    expect(okBadges.length).toBeGreaterThanOrEqual(5);
  });

  it("renders error status when data is missing", () => {
    render(
      <StepConfirmationPC
        data={invalidData}
        onBack={mockOnBack}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
      />
    );

    expect(
      screen.getByText("全ての必須項目を入力してください")
    ).toBeInTheDocument();
  });

  it("shows age error if minor", () => {
    render(
      <StepConfirmationPC
        data={{ ...validData, is_minor: true }}
        onBack={mockOnBack}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
      />
    );

    expect(screen.getByText("未成年の方は利用できません")).toBeInTheDocument();
    expect(
      screen.getByText("全ての必須項目を入力してください")
    ).toBeInTheDocument();
  });
});
