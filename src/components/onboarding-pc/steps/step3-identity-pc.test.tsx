import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { GENERATIONS } from "../../onboarding/onboarding.logic";
import { Step3IdentityPC } from "./step3-identity-pc";

// Mock generateAnonymousName if it's imported globally, or we just test the callback
// If the component imports specific logic, we might need to mock that module.
vi.mock("@/lib/anonymous-name-generator", () => ({
  generateAnonymousName: vi.fn(),
  generateUniqueCandidates: vi.fn(() => [
    "Candidate 1",
    "Candidate 2",
    "Candidate 3",
  ]),
}));

describe("Step3IdentityPC", () => {
  const mockUpdate = vi.fn();
  const defaultProps = {
    data: {
      display_id: "user-123",
      zodiac_sign: "",
      display_name: "",
    },
    onUpdate: mockUpdate,
  };

  it("renders identity fields", () => {
    render(<Step3IdentityPC {...defaultProps} />);

    expect(screen.getByText("Display ID")).toBeInTheDocument();
    expect(screen.getByDisplayValue("user-123")).toBeInTheDocument();

    expect(screen.getByLabelText("星座")).toBeInTheDocument();
    expect(screen.getByText("表示名 (匿名)")).toBeInTheDocument();
    expect(screen.getByLabelText("生誕世代")).toBeInTheDocument();

    // Should show placeholder initially
    expect(
      screen.getByText("星座を選択すると候補が表示されます")
    ).toBeInTheDocument();
  });

  it("displays candidates when zodiac is selected", () => {
    // Since component is controlled, we render with the value already set to test the effect
    render(
      <Step3IdentityPC
        {...defaultProps}
        data={{ ...defaultProps.data, zodiac_sign: "aries" }}
      />
    );

    // Should display candidates from mock
    expect(screen.getByText("Candidate 1")).toBeInTheDocument();
    expect(screen.getByText("Candidate 2")).toBeInTheDocument();
    expect(screen.getByText("Candidate 3")).toBeInTheDocument();
  });

  it("updates display_name when a candidate is selected", () => {
    render(
      <Step3IdentityPC
        {...defaultProps}
        data={{ ...defaultProps.data, zodiac_sign: "aries" }}
      />
    ); // Pre-select zodiac to trigger useEffect

    // Wait for effect? No, useEffect runs after render, but in tests `render` usually settles.
    // However, initial render with zodiac set should trigger candidates.

    const candidateBtn = screen.getByText("Candidate 1");
    fireEvent.click(candidateBtn);

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ display_name: "Candidate 1" })
    );
  });

  it("updates generation", () => {
    render(<Step3IdentityPC {...defaultProps} />);

    const genSelect = screen.getByLabelText("生誕世代");
    fireEvent.change(genSelect, { target: { value: GENERATIONS[0] } });

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ birth_generation: GENERATIONS[0] })
    );
  });
});
