import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Step2HoursPC } from "./step2-hours-pc";

// Mock ResizeObserver for Radix UI
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe("Step2HoursPC", () => {
  const mockUpdate = vi.fn();
  const defaultProps = {
    data: {
      core_activity_start: "09:00",
      core_activity_end: "18:00",
      holidayActivityStart: "09:00",
      holidayActivityEnd: "18:00",
    },
    onUpdate: mockUpdate,
  };

  it("renders core activity hours title and initial times", () => {
    render(<Step2HoursPC {...defaultProps} />);
    expect(
      screen.getByText("アクティブ時間（コアタイム、連絡OKな時間帯）")
    ).toBeInTheDocument();

    // Check for Work Section
    expect(
      screen.getByText("仕事用 (Weekday) （第一活動時間）")
    ).toBeInTheDocument();

    // Check for Holiday Section
    expect(
      screen.getByText("休日用 (Holiday) （第一活動時間）")
    ).toBeInTheDocument();
  });

  it("renders second core activity hours button for both sections", () => {
    render(<Step2HoursPC {...defaultProps} />);
    const addButtons = screen.getAllByText("追加する");
    expect(addButtons).toHaveLength(2); // One for Work, one for Holiday

    expect(screen.getAllByText("第二活動時間（任意）")).toHaveLength(2);
  });

  it("renders correctly with custom data", () => {
    render(
      <Step2HoursPC
        {...defaultProps}
        data={{
          core_activity_start: "10:00",
          core_activity_end: "19:00",
          holidayActivityStart: "11:00",
          holidayActivityEnd: "20:00",
        }}
      />
    );
    // Work
    expect(screen.getByText(/10:00 ～ 19:00/)).toBeInTheDocument();
    // Holiday
    expect(screen.getByText(/11:00 ～ 20:00/)).toBeInTheDocument();
  });
});
