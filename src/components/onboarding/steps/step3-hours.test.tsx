import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll } from "vitest";
import { Step3Hours } from "./step3-hours";

// ResizeObserver mock
beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

// Mock Radix UI Slider
vi.mock("@radix-ui/react-slider", () => ({
  Root: ({ children, ...props }: any) => (
    <div data-testid="slider-root" {...props}>
      {children}
    </div>
  ),
  Track: ({ children, ...props }: any) => (
    <div data-testid="slider-track" {...props}>
      {children}
    </div>
  ),
  Range: ({ ...props }: any) => <div data-testid="slider-range" {...props} />,
  Thumb: ({ ...props }: any) => <div data-testid="slider-thumb" {...props} />,
}));

describe("Step3Hours", () => {
  it("活動時間がレンダリングされること", () => {
    const mockUpdate = vi.fn();
    render(<Step3Hours data={{}} onUpdate={mockUpdate} />);

    expect(screen.getByText(/コア活動時間/)).toBeInTheDocument();
  });
});
