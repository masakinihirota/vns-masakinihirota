import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { MandalaChart } from "./mandala-chart";
import { createNewChart } from "./mandala-chart.logic";

describe("MandalaChart UI", () => {
  const mockCharts = [createNewChart("Test Chart")];
  const defaultProps = {
    charts: mockCharts,
    activeIndex: 0,
    viewMode: "full" as const,
    focusIndex: 4,
    editingCell: null,
    isSidebarOpen: false,
    saveStatus: "saved" as const,
    canUndo: false,
    canRedo: false,
    onUpdateTitle: vi.fn(),
    onAddChart: vi.fn(),
    onDeleteChart: vi.fn(),
    onUpdateCell: vi.fn(),
    onChangeActiveIndex: vi.fn(),
    onChangeViewMode: vi.fn(),
    onChangeFocusIndex: vi.fn(),
    onSetEditingCell: vi.fn(),
    onToggleSidebar: vi.fn(),
    onUndo: vi.fn(),
    onRedo: vi.fn(),
    onExport: vi.fn(),
  };

  it("should render successfully", () => {
    render(<MandalaChart {...defaultProps} />);
    expect(screen.getByDisplayValue("Test Chart")).toBeInTheDocument();
    // Should verify SVG icons exist or key elements
    // We can check for a few grid positions labels (rendered in full mode)
    expect(screen.getByText("左上")).toBeInTheDocument();
    expect(screen.getByText("中央")).toBeInTheDocument();
  });

  it("should have no accessibility violations", async () => {
    const { container } = render(<MandalaChart {...defaultProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should switch mode when button clicked", () => {
    render(<MandalaChart {...defaultProps} />);
    const focusButton = screen.getByText("集中");
    fireEvent.click(focusButton);
    expect(defaultProps.onChangeViewMode).toHaveBeenCalledWith("focus");
  });
});
