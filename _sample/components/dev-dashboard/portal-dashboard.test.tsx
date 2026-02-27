import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";

import { renderWithWait } from "@/lib/test-utils";

import { PortalDashboard } from "./portal-dashboard";

// Lucide-react アイコンのモック
vi.mock("lucide-react", async () => {
  const actual = await vi.importActual("lucide-react");
  return {
    ...actual,
    Home: () => <div data-testid="home-icon" />,
    Settings: () => <div data-testid="settings-icon" />,
  };
});

// モックデータで初期化されるように localStorage をモック
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(globalThis, "localStorage", {
  value: mockLocalStorage,
});

// window.confirm のモック
globalThis.confirm = vi.fn(() => true);

// window.matchMedia のモック
Object.defineProperty(globalThis, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe("PortalDashboard Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = await renderWithWait(<PortalDashboard />);

    // Wait for the dashboard to load using an ASCII string
    await waitFor(() => expect(screen.getByText(/Roadmap/i)).toBeInTheDocument());

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("PortalDashboard Rendering", () => {
  it("should display title and progress bar", async () => {
    await renderWithWait(<PortalDashboard />);

    await waitFor(() => {
      // Use getAllByText for multiple matching elements and check the first one
      const roadmapElements = screen.getAllByText(/Roadmap/i);
      expect(roadmapElements.length).toBeGreaterThan(0);

      expect(screen.getByText(/Done:/i)).toBeInTheDocument();
      expect(screen.getByText(/Focus:/i)).toBeInTheDocument();
    });
  });

  it("should display route paths", async () => {
    await renderWithWait(<PortalDashboard />);

    await waitFor(() => {
      // Use route paths as they are ASCII and environment-stable
      expect(screen.getByText("/home")).toBeInTheDocument();
      expect(screen.getByText("/matching")).toBeInTheDocument();
      expect(screen.getByText("/profile")).toBeInTheDocument();
    });
  });
});
