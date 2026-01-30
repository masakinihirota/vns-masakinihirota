import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { WorkContinuousRating } from "./work-continuous-rating";
import { Rating } from "./work-continuous-rating.logic";

describe("WorkContinuousRating UI", () => {
  const defaultProps = {
    category: null,
    sessionSize: null,
    isLoading: false,
    isComplete: false,
    currentIndex: 0,
    sessionTotal: 0,
    currentTitle: "",
    announcement: "",
    ratings: {},
    showRatedItems: false,
    currentStatus: "Now" as const,
    onCategorySelect: vi.fn(),
    onSessionStart: vi.fn(),
    onRate: vi.fn(),
    onStatusChange: vi.fn(),
    onPrevious: vi.fn(),
    onNext: vi.fn(),
    onReset: vi.fn(),
    onExport: vi.fn(),
    onToggleRatedItems: vi.fn(),
    onToggleLike: vi.fn(),
  };

  it("should render category selection when category is null", async () => {
    const { container } = render(<WorkContinuousRating {...defaultProps} />);

    expect(screen.getByText("作品連続評価")).toBeInTheDocument();
    expect(screen.getByText("🎬 アニメ")).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should call onCategorySelect when category button is clicked", () => {
    render(<WorkContinuousRating {...defaultProps} />);

    fireEvent.click(screen.getByText("🎬 アニメ"));
    expect(defaultProps.onCategorySelect).toHaveBeenCalledWith("anime");
  });

  it("should render session size selection when sessionSize is null", async () => {
    const props = { ...defaultProps, category: "anime" as const };
    const { container } = render(<WorkContinuousRating {...props} />);

    expect(screen.getByText("今日は何件評価しますか？")).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should render rating screen with status selection when session is active", async () => {
    const props = {
      ...defaultProps,
      category: "anime" as const,
      sessionSize: 10,
      sessionTotal: 10,
      currentTitle: "Test Anime",
    };
    const { container } = render(<WorkContinuousRating {...props} />);

    expect(screen.getByText("Test Anime")).toBeInTheDocument();
    // Progress bar check
    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    // Status buttons check with new shortcuts
    // Visual hints removed as per user request
    // expect(screen.getByText(/\[1\]/i)).toBeInTheDocument();
    // expect(screen.getByText(/\[2\]/i)).toBeInTheDocument();
    // expect(screen.getByText(/\[3\]/i)).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should call onStatusChange when status button is clicked", () => {
    const props = {
      ...defaultProps,
      category: "anime" as const,
      sessionSize: 10,
      sessionTotal: 10,
      currentTitle: "Test Anime",
    };
    render(<WorkContinuousRating {...props} />);

    fireEvent.click(screen.getByRole("button", { name: /Future/i }));
    expect(defaultProps.onStatusChange).toHaveBeenCalledWith("Future");
  });

  it("should call onRate with correct value when rating button is clicked", () => {
    const props = {
      ...defaultProps,
      category: "anime" as const,
      sessionSize: 10,
      sessionTotal: 10,
      currentTitle: "Test Anime",
    };
    render(<WorkContinuousRating {...props} />);

    fireEvent.click(screen.getByRole("button", { name: /Tier1/i }));
    expect(defaultProps.onRate).toHaveBeenCalledWith("Tier1");
  });

  it("should identify selected rating visual state", () => {
    const props = {
      ...defaultProps,
      category: "anime" as const,
      sessionSize: 10,
      sessionTotal: 10,
      currentTitle: "Test Anime",
      ratings: {
        "Test Anime": {
          status: "Now",
          isLiked: true,
          tier: "Tier1",
          otherValue: null,
        } as Rating,
      },
    };
    const { unmount } = render(<WorkContinuousRating {...props} />);

    // Tier1 button should be pressed
    const tier1Button = screen.getByRole("button", { name: /Tier1/i });
    expect(tier1Button).toHaveAttribute("aria-pressed", "true");

    // Other buttons should not be pressed
    const tier2Button = screen.getByRole("button", { name: /Tier2/i });
    expect(tier2Button).toHaveAttribute("aria-pressed", "false");

    unmount();
  });

  it('should indentify "Watch Later" selected state', () => {
    const props = {
      ...defaultProps,
      category: "anime" as const,
      sessionSize: 10,
      sessionTotal: 10,
      currentTitle: "Test Anime 2",
      ratings: {
        "Test Anime 2": {
          status: "Future",
          isLiked: false,
          tier: "Tier1",
          otherValue: "後で見る",
        } as Rating,
      },
    };
    render(<WorkContinuousRating {...props} />);

    const watchLaterButton = screen.getByRole("button", { name: /後で見る/i });
    expect(watchLaterButton).toHaveAttribute("aria-pressed", "true");
  });

  it("should render completion screen when isComplete is true", async () => {
    const props = {
      ...defaultProps,
      category: "anime" as const,
      sessionSize: 10,
      isComplete: true,
      sessionTotal: 10,
    };
    const { container } = render(<WorkContinuousRating {...props} />);

    expect(screen.getByText("お疲れ様でした！")).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
