import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Step2Culture } from "./step2-culture";

describe("Step2Culture", () => {
  it("renders all fields correctly", () => {
    const mockUpdate = vi.fn();
    render(<Step2Culture data={{}} onUpdate={mockUpdate} />);

    expect(screen.getByText("文化圏")).toBeInTheDocument();
    expect(screen.getByText("居住地 (国/地域)")).toBeInTheDocument();
    expect(screen.getByText("母国語")).toBeInTheDocument();
    expect(screen.getByText("使用可能言語")).toBeInTheDocument();
  });

  it("updates cultural sphere on selection", () => {
    const mockUpdate = vi.fn();
    render(<Step2Culture data={{}} onUpdate={mockUpdate} />);

    // Use getByLabelText or getByRole for select
    const sphereSelect = screen.getByLabelText(/文化圏/);
    fireEvent.change(sphereSelect, { target: { value: "english" } });

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ activity_culture_code: "english" })
    );
  });

  it("updates location when country and prefecture are selected", () => {
    const mockUpdate = vi.fn();
    render(<Step2Culture data={{}} onUpdate={mockUpdate} />);

    // Select requires cultural sphere to optionally show countries, but we have fallback
    // Use getByRole for aria-label "国"
    const countrySelect = screen.getByRole("combobox", { name: "国" });
    fireEvent.change(countrySelect, { target: { value: "Other" } });
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ country: "Other" })
    );

    // Re-render with japanese sphere to test prefecture
    render(
      <Step2Culture
        data={{ activity_culture_code: "japanese", country: "日本 (Japan)" }}
        onUpdate={mockUpdate}
      />
    );
    const prefSelect = screen.getByRole("combobox", { name: "都道府県" });
    fireEvent.change(prefSelect, { target: { value: "東京都" } });
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ prefecture: "東京都" })
    );
  });

  it("updates location when 'Other' country is selected", () => {
    const mockUpdate = vi.fn();
    render(
      <Step2Culture
        data={{ activity_culture_code: "english" }}
        onUpdate={mockUpdate}
      />
    );

    const countrySelect = screen.getByRole("combobox", { name: "国" });
    fireEvent.change(countrySelect, { target: { value: "その他 (Others)" } });

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ country: "その他 (Others)" })
    );
  });
});
