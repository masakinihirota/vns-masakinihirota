import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { StepBasicValuesPC } from "./step-basic-values-pc";

describe("StepBasicValuesPC", () => {
  const mockOnUpdate = vi.fn();
  const emptyData = { basic_values: {} };

  it("should have no accessibility violations", async () => {
    const { container } = render(
      <StepBasicValuesPC data={emptyData} onUpdate={mockOnUpdate} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders all 10 questions", () => {
    render(<StepBasicValuesPC data={emptyData} onUpdate={mockOnUpdate} />);

    expect(screen.getByText("あなたは平和がよいですか？")).toBeInTheDocument();
    expect(
      screen.getByText("ヘイト発言などネガティブな言葉は嫌ですか？")
    ).toBeInTheDocument();
    // ... check a few key ones or all
    expect(screen.getByText("人間が間違えること")).toBeInTheDocument();
    expect(
      screen.getByText("自分と違う意見についてどう思いますか？")
    ).toBeInTheDocument();

    // Count questions by title
    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings.length).toBe(10);
  });

  it("calls onUpdate when an option is selected", () => {
    render(<StepBasicValuesPC data={emptyData} onUpdate={mockOnUpdate} />);

    const yesButton = screen.getAllByText("はい")[0]; // First "Yes" button
    fireEvent.click(yesButton);

    expect(mockOnUpdate).toHaveBeenCalledWith({
      basic_values: expect.objectContaining({
        peace_preference: "yes",
      }),
    });
  });

  it("highlights selected options", () => {
    const presetData = {
      basic_values: {
        peace_preference: "yes",
      },
    };

    render(<StepBasicValuesPC data={presetData} onUpdate={mockOnUpdate} />);

    // First "Yes" button should be highlighted (teal bg)
    // We can check class name or style, but class check is fragile.
    // Let's assume the button with "はい" and appropriate parent is expected.
    // For specific test, we can query by aria-pressed if we added it, but valid approach for now:
    const yesButtons = screen.getAllByText("はい");
    const selectedBtn = yesButtons[0];
    expect(selectedBtn.className).toContain("bg-teal-500");
  });

  it("handles multi-select for opinion_diversity", () => {
    const data = { basic_values: { opinion_diversity: ["new_perspective"] } };
    render(<StepBasicValuesPC data={data} onUpdate={mockOnUpdate} />);

    // Click "many_opinions" option
    const optionButton = screen.getByText("沢山の意見があっていいと思う");
    fireEvent.click(optionButton);

    expect(mockOnUpdate).toHaveBeenCalledWith({
      basic_values: {
        opinion_diversity: ["new_perspective", "many_opinions"],
      },
    });

    // Unselect logic would need another test pass or re-render
  });

  it("toggles off single-select options when clicked again", () => {
    const data = { basic_values: { peace_preference: "yes" } };
    render(<StepBasicValuesPC data={data} onUpdate={mockOnUpdate} />);

    // Click "yes" button again
    const yesButton = screen.getAllByText("はい")[0];
    fireEvent.click(yesButton);

    expect(mockOnUpdate).toHaveBeenCalledWith({
      basic_values: {
        peace_preference: undefined,
      },
    });
  });
});
