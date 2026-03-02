import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";

const requireRoleMock = vi.fn(({ children }) => children);

vi.mock("@/lib/auth-guard", () => ({
  RequireRole: (props: { role: string; children: ReactNode }) => {
    requireRoleMock(props);
    return <>{props.children}</>;
  },
}));

vi.mock("@/lib/db/admin-queries", () => ({
  getAdminDashboardStats: vi.fn(),
}));

import { getAdminDashboardStats } from "@/lib/db/admin-queries";
import AdminPage from "./page";

describe("admin page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("platform_admin ガードでレンダリングされる", async () => {
    vi.mocked(getAdminDashboardStats).mockResolvedValue({
      unresolvedReports: 2,
      pendingApprovals: 5,
      adminLogCount24h: 11,
    });

    const ui = await AdminPage({
      params: Promise.resolve({}),
      searchParams: Promise.resolve({}),
    });

    const { container } = render(ui);

    const results = await axe(container);
    expect(results).toHaveNoViolations();

    expect(requireRoleMock).toHaveBeenCalled();
    expect(requireRoleMock.mock.calls[0][0].role).toBe("platform_admin");
    expect(screen.getByTestId("unresolved-reports-count")).toHaveTextContent("2");
    expect(screen.getByTestId("pending-approvals-count")).toHaveTextContent("5");
    expect(screen.getByTestId("admin-logs-count")).toHaveTextContent("11");
  });

  it("統計取得が失敗してもページ表示は継続できる", async () => {
    vi.mocked(getAdminDashboardStats).mockResolvedValue({
      unresolvedReports: 0,
      pendingApprovals: 0,
      adminLogCount24h: 0,
    });

    const ui = await AdminPage({
      params: Promise.resolve({}),
      searchParams: Promise.resolve({}),
    });

    const { container } = render(ui);

    const results = await axe(container);
    expect(results).toHaveNoViolations();

    expect(screen.getByTestId("unresolved-reports-count")).toHaveTextContent("0");
    expect(screen.getByTestId("pending-approvals-count")).toHaveTextContent("0");
    expect(screen.getByTestId("admin-logs-count")).toHaveTextContent("0");
  });
});
