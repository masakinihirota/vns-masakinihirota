import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { Step3IdentityPC } from "./step3-identity-pc";

describe("Step3IdentityPC", () => {
  const mockOnUpdate = vi.fn();
  const defaultData = {
    zodiac_sign: "",
    birth_generation: "",
    amazon_associate_tag: "",
    is_minor: undefined,
  };

  it("should have no accessibility violations", async () => {
    const { container } = render(
      <Step3IdentityPC data={defaultData} onUpdate={mockOnUpdate} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders the age check question", () => {
    render(<Step3IdentityPC data={defaultData} onUpdate={mockOnUpdate} />);
    expect(screen.getByText("あなたは成年ですか？")).toBeInTheDocument();
  });

  it("calls onUpdate with is_minor: false when 'Yes' is clicked", () => {
    render(<Step3IdentityPC data={defaultData} onUpdate={mockOnUpdate} />);
    const yesRadio = screen.getByLabelText("はい (成人)");
    fireEvent.click(yesRadio);
    expect(mockOnUpdate).toHaveBeenCalledWith({ is_minor: false });
  });

  it("calls onUpdate with is_minor: true when 'No' is clicked", () => {
    render(<Step3IdentityPC data={defaultData} onUpdate={mockOnUpdate} />);
    const noRadio = screen.getByLabelText("いいえ (未成年)");
    fireEvent.click(noRadio);
    expect(mockOnUpdate).toHaveBeenCalledWith({ is_minor: true });
  });

  it("shows blocking message when is_minor is true", () => {
    render(
      <Step3IdentityPC
        data={{ ...defaultData, is_minor: true }}
        onUpdate={mockOnUpdate}
      />
    );
    expect(
      screen.getByText(
        /申し訳ありません。未成年の方は現在VNSをご利用いただけません/
      )
    ).toBeInTheDocument();
  });

  it("disables other fields when is_minor is true", () => {
    render(
      <Step3IdentityPC
        data={{ ...defaultData, is_minor: true }}
        onUpdate={mockOnUpdate}
      />
    );
    const zodiacSelect = screen.getByLabelText("星座");
    const generationSelect = screen.getByLabelText("生誕世代");
    const inputs = screen.getByLabelText("AmazonアソシエイトID (任意)");

    expect(zodiacSelect).toBeDisabled();
    expect(generationSelect).toBeDisabled();
    expect(inputs).toBeDisabled();
  });
});
