import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { axe } from "vitest-axe";
import { StepDeclarationsPC } from "./step-declarations-pc";

describe("StepDeclarationsPC", () => {
  const mockData = {
    agreed_oasis: false,
    agreed_human: false,
    agreed_honesty: false,
  };
  const mockOnUpdate = vi.fn();

  it("should render successfully", () => {
    render(<StepDeclarationsPC data={mockData} onUpdate={mockOnUpdate} />);
    expect(screen.getByText("3つの誓い")).toBeInTheDocument();
    expect(screen.getByText("オアシス宣言を守る")).toBeInTheDocument();
    expect(screen.getByText("人間宣言を守る")).toBeInTheDocument();
    expect(screen.getByText("正直宣言を守る")).toBeInTheDocument();
  });

  it("should have no accessibility violations", async () => {
    const { container } = render(
      <StepDeclarationsPC data={mockData} onUpdate={mockOnUpdate} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should call onUpdate when checkboxes are clicked", () => {
    render(<StepDeclarationsPC data={mockData} onUpdate={mockOnUpdate} />);

    const oasisCheckbox = screen.getByLabelText(
      /オアシス宣言を守る/i
    ) as HTMLInputElement;
    fireEvent.click(oasisCheckbox);
    expect(mockOnUpdate).toHaveBeenCalledWith({ agreed_oasis: true });

    const humanCheckbox = screen.getByLabelText(
      /人間宣言を守る/i
    ) as HTMLInputElement;
    fireEvent.click(humanCheckbox);
    expect(mockOnUpdate).toHaveBeenCalledWith({ agreed_human: true });

    const honestyCheckbox = screen.getByLabelText(
      /正直宣言を守る/i
    ) as HTMLInputElement;
    fireEvent.click(honestyCheckbox);
    expect(mockOnUpdate).toHaveBeenCalledWith({ agreed_honesty: true });
  });
});
