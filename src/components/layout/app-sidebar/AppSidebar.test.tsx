import "vitest-axe/extend-expect";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { AppSidebar } from "./AppSidebar";

// Lucide-reactのアイコンをモック
vi.mock("lucide-react", () => ({
  ChevronRight: () => <div>ChevronRight</div>,
  ChevronsUpDown: () => <div>ChevronsUpDown</div>,
  LogOut: () => <div>LogOut</div>,
  MoreHorizontal: () => <div>MoreHorizontal</div>,
  Pause: () => <div>Pause</div>,
  Play: () => <div>Play</div>,
}));

// Next.js のナビゲーションをモック
vi.mock("next/navigation", () => ({
  usePathname: () => "/home",
  useSearchParams: () => new URLSearchParams(),
}));

// SidebarProvider などの依存関係がある場合はモックが必要
vi.mock("@/components/ui/sidebar", () => ({
  Sidebar: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SidebarContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SidebarHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SidebarFooter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SidebarGroup: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SidebarGroupLabel: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SidebarGroupContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SidebarMenu: ({ children }: { children: React.ReactNode }) => (
    <ul>{children}</ul>
  ),
  SidebarMenuItem: ({ children }: { children: React.ReactNode }) => (
    <li>{children}</li>
  ),
  SidebarMenuButton: ({ children }: { children: React.ReactNode }) => (
    <button>{children}</button>
  ),
  SidebarMenuSub: ({ children }: { children: React.ReactNode }) => (
    <ul>{children}</ul>
  ),
  SidebarMenuSubItem: ({ children }: { children: React.ReactNode }) => (
    <li>{children}</li>
  ),
  SidebarMenuSubButton: ({ children }: { children: React.ReactNode }) => (
    <button>{children}</button>
  ),
  SidebarRail: () => <div>rail</div>,
  useSidebar: () => ({
    isMobile: false,
    state: "expanded",
    open: true,
    setOpen: vi.fn(),
  }),
}));

describe("AppSidebar", () => {
  it("正常にレンダリングされる", () => {
    // Arrange & Act
    const { container } = render(<AppSidebar />);

    // Assert
    expect(container).toBeTruthy();
  });

  it("アクセシビリティ違反がない", async () => {
    // Arrange
    const { container } = render(<AppSidebar />);

    // Act
    const results = await axe(container);

    // Assert
    // @ts-expect-error vitest-axe type augmentation is not picked up by oxlint
    expect(results).toHaveNoViolations();
  });
});
