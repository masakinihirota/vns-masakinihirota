import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { WeekSchedule } from "./types";
import { WeekScheduler } from "./week-scheduler";

describe("WeekScheduler", () => {
  const initialSchedule: WeekSchedule = {
    mon: "BUSY",
    tue: "BUSY",
    wed: "BUSY",
    thu: "BUSY",
    fri: "BUSY",
    sat: "MATCH",
    sun: "MATCH",
  };

  it("should have no accessibility violations", async () => {
    const { container } = render(
      <WeekScheduler value={initialSchedule} onChange={() => {}} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders all days", () => {
    render(<WeekScheduler value={initialSchedule} onChange={() => {}} />);
    expect(screen.getByText("月")).toBeInTheDocument();
    expect(screen.getByText("日")).toBeInTheDocument();
  });

  it("calls onChange with updated status when a day is clicked", () => {
    const handleChange = vi.fn();
    render(<WeekScheduler value={initialSchedule} onChange={handleChange} />);

    const mondayButtons = screen.getAllByRole("button");
    const mondayButton = mondayButtons[0]; // Monday is first index

    fireEvent.click(mondayButton);

    expect(handleChange).toHaveBeenCalledWith({
      ...initialSchedule,
      mon: "MATCH",
    });
  });

  it("does not call onChange when readOnly is true", () => {
    const handleChange = vi.fn();
    render(
      <WeekScheduler value={initialSchedule} onChange={handleChange} readOnly />
    );

    const mondayButtons = screen.getAllByRole("button");
    const mondayButton = mondayButtons[0];

    fireEvent.click(mondayButton);

    expect(handleChange).not.toHaveBeenCalled();
  });

  it("hides legend when readOnly is true", () => {
    render(
      <WeekScheduler value={initialSchedule} onChange={() => {}} readOnly />
    );
    expect(screen.queryByText("ステータス凡例")).not.toBeInTheDocument();
  });
});
