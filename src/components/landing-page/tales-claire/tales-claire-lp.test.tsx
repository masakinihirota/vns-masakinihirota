import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { axe } from "vitest-axe";
import { TalesClaireLP } from "./tales-claire-lp";

// Mock InspirationSection
vi.mock("./inspiration-section", () => ({
  InspirationSection: () => (
    <div role="region" aria-label="Inspiration Section">
      Mock Inspiration
    </div>
  ),
}));

// Mock Canvas API
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  clearRect: vi.fn(),
  createRadialGradient: vi.fn(() => ({
    addColorStop: vi.fn(),
  })),
  fillRect: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  fillStyle: "",
  fill: vi.fn(),
})) as any;

describe("TalesClaireLP", () => {
  it("should render successfully", () => {
    render(<TalesClaireLP />);
    expect(screen.getByText("VNS masakinihirota")).toBeInTheDocument();
    expect(screen.getByText(/昨日僕が感動した作品を/i)).toBeInTheDocument();
  });

  it("should have no accessibility violations", async () => {
    const { container } = render(<TalesClaireLP />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
