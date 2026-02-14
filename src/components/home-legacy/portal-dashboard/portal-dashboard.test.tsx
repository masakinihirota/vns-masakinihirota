import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { PortalDashboard } from "./portal-dashboard";

// Lucide-reactのアイコンをモック
vi.mock("lucide-react", () => ({
  Badge: ({ children }: any) => <div>{children}</div>,
  Button: ({ children }: any) => <button>{children}</button>,
  Progress: () => <div>progress</div>,
  ArrowDown: () => <div>ArrowDown</div>,
  ArrowRight: () => <div>ArrowRight</div>,
  ArrowUp: () => <div>ArrowUp</div>,
  CheckCircle2: () => <div>CheckCircle2</div>,
  Circle: () => <div>Circle</div>,
  Globe: () => <div>Globe</div>,
  Handshake: () => <div>Handshake</div>,
  Home: () => <div>Home</div>,
  Layers: () => <div>Layers</div>,
  RotateCcw: () => <div>RotateCcw</div>,
  Search: () => <div>Search</div>,
  Settings: () => <div>Settings</div>,
  Sparkles: () => <div>Sparkles</div>,
  UserPlus: () => <div>UserPlus</div>,
  Zap: () => <div>Zap</div>,
  ChevronRight: () => <div>ChevronRight</div>,
  ChevronsUpDown: () => <div>ChevronsUpDown</div>,
  LogOut: () => <div>LogOut</div>,
  MoreHorizontal: () => <div>MoreHorizontal</div>,
  Pause: () => <div>Pause</div>,
  Play: () => <div>Play</div>,
}));

describe("PortalDashboard", () => {
  it("正常にレンダリングされる", () => {
    // Arrange & Act
    render(<PortalDashboard />);

    // Assert
    expect(screen.getByText(/VNS Roadmap/i)).toBeInTheDocument();
    expect(screen.getByText(/開発進捗管理/i)).toBeInTheDocument();
  });

  it("アクセシビリティ違反がない", async () => {
    // Arrange
    const { container } = render(<PortalDashboard />);

    // Act
    const results = await axe(container);

    // Assert
    expect(results).toHaveNoViolations();
  });
});
