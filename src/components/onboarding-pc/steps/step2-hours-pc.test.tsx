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
    },
    onUpdate: mockUpdate,
  };

  it("renders core activity hours title and initial times", () => {
    render(<Step2HoursPC {...defaultProps} />);
    expect(
      screen.getByText("アクティブ時間（コアタイム、連絡OKな時間帯）")
    ).toBeInTheDocument();
    expect(screen.getByText("第一活動時間")).toBeInTheDocument();
    // Check for displayed time range
    expect(screen.getByText(/09:00 ～ 18:00/)).toBeInTheDocument();
  });

  it("renders second core activity hours button", () => {
    render(<Step2HoursPC {...defaultProps} />);
    expect(screen.getByText("第二活動時間（任意）")).toBeInTheDocument();
    expect(screen.getByText("追加する")).toBeInTheDocument();
  });

  it("renders correctly with custom data", () => {
    render(
      <Step2HoursPC
        {...defaultProps}
        data={{
          core_activity_start: "10:00",
          core_activity_end: "19:00",
        }}
      />
    );
    expect(screen.getByText(/10:00 ～ 19:00/)).toBeInTheDocument();
  });
});
