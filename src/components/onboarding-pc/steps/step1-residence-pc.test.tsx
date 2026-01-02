import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Step1ResidencePC } from "./step1-residence-pc";

describe("Step1ResidencePC", () => {
  const mockUpdate = vi.fn();

  const defaultProps = {
    data: {},
    onUpdate: mockUpdate,
  };

  it("render all fields correctly", () => {
    render(<Step1ResidencePC {...defaultProps} />);

    // 1. Residence Area
    expect(screen.getByText("居住エリア (Earth)")).toBeInTheDocument();
    // Map areas should be accessible buttons
    expect(
      screen.getByRole("button", { name: "Select Area 1" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Select Area 2" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Select Area 3" })
    ).toBeInTheDocument();

    // 2. Cultural Sphere
    expect(screen.getByText("住んでいる文化圏")).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: "文化圏" })
    ).toBeInTheDocument();

    // 3. Country (Label exists)
    expect(screen.getByText("国")).toBeInTheDocument();

    // 4. Region Label (Default "州/地域")
    expect(screen.getByLabelText("州/地域")).toBeInTheDocument();

    // Check fallback text for country detail
    expect(screen.getByText("文化圏を選択してください")).toBeInTheDocument();
  });

  it("updates residence area on selection", () => {
    render(<Step1ResidencePC {...defaultProps} />);

    // Target map area via accessible role
    const area1Button = screen.getByRole("button", { name: "Select Area 1" });
    fireEvent.click(area1Button);

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ activity_area_id: 1 })
    );
  });

  it("toggles residence area selection (deselects when clicked again)", () => {
    // Simulate state where Area 1 is already selected
    const props = {
      ...defaultProps,
      data: { ...defaultProps.data, activity_area_id: 1 },
    };
    render(<Step1ResidencePC {...props} />);

    // Target map area via accessible role
    const area1Button = screen.getByRole("button", { name: "Select Area 1" });
    fireEvent.click(area1Button);

    // Should call update with null/undefined to clear selection
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ activity_area_id: null })
    );
  });

  it("updates cultural sphere and resets child fields", () => {
    render(<Step1ResidencePC {...defaultProps} />);

    const sphereSelect = screen.getByRole("combobox", { name: "文化圏" });
    fireEvent.change(sphereSelect, { target: { value: "japanese" } });

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        activity_culture_code: "japanese",
        selectedCountry: "日本",
        selectedRegion: "",
      })
    );
  });

  it("shows prefecture input only when Japan is selected", () => {
    const { rerender } = render(<Step1ResidencePC {...defaultProps} />);

    // Initial: Not Japan (default "州/地域")
    expect(screen.getByLabelText("州/地域")).toBeInTheDocument();
    expect(screen.queryByLabelText("都道府県")).not.toBeInTheDocument();

    // Select Japan
    rerender(
      <Step1ResidencePC
        {...defaultProps}
        data={{ activity_culture_code: "japanese", selectedCountry: "日本" }}
      />
    );

    // Should see select for prefecture with label "都道府県"
    const prefSelect = screen.getByLabelText("都道府県");
    expect(prefSelect.tagName).toBe("SELECT");

    // Mock update to "USA"
    rerender(
      <Step1ResidencePC
        {...defaultProps}
        data={{ activity_culture_code: "english", selectedCountry: "アメリカ" }}
      />
    );

    // Should see input for region with label "州/地域"
    const prefInput = screen.getByLabelText("州/地域");
    expect(prefInput.tagName).toBe("INPUT");
  });

  it("updates moon and mars locations", () => {
    render(<Step1ResidencePC {...defaultProps} />);

    // Helper to find by label snippet since they include " (Moon - Optional)"
    const moonSelect = screen.getByLabelText(/月面拠点/);
    fireEvent.change(moonSelect, {
      target: { value: "静かの海 (Mare Tranquillitatis)" },
    });

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        moon_location: "静かの海 (Mare Tranquillitatis)",
      })
    );

    const marsSelect = screen.getByLabelText(/火星拠点/);
    fireEvent.change(marsSelect, {
      target: { value: "オリンポス山 (Olympus Mons)" },
    });

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        mars_location: "オリンポス山 (Olympus Mons)",
      })
    );
  });
});
