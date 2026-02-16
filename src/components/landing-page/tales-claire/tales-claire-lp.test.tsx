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

// Mock IdentitySection
vi.mock("./identity-section", () => ({
  IdentitySection: () => (
    <div role="region" aria-label="Identity Section">
      Mock Identity
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
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("VNS");
    expect(heading).toHaveTextContent("masakinihirota");
    expect(screen.getByText(/昨日僕が感動した作品を/i)).toBeInTheDocument();
    expect(
      screen.getByText(/まっさきにひろった の名前の由来/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/インターネットという情報の洪水の中から/i)
    ).toBeInTheDocument();
  });

  it("should have no accessibility violations", async () => {
    const { container } = render(<TalesClaireLP />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
