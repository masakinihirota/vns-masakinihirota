import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import { RootAccount, RootAccountOverview } from "./root-account-overview";

describe("RootAccountOverview", () => {
  const mockRootAccount: RootAccount = {
    id: "test-root-id",
    status: "active",
    points: 1000,
    createdAt: new Date("2024-01-01T00:00:00Z"),
    lastRotatedAt: new Date("2024-01-02T00:00:00Z"),
  };

  it("renders root account details correctly", () => {
    render(<RootAccountOverview rootAccount={mockRootAccount} />);

    expect(screen.getByText("1,000 pt")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Created: 2024/01/01")).toBeInTheDocument(); // Assuming simple format
  });

  it("renders suspended status correctly", () => {
    const suspendedAccount: RootAccount = {
      ...mockRootAccount,
      status: "suspended",
    };
    render(<RootAccountOverview rootAccount={suspendedAccount} />);
    expect(screen.getByText("Suspended")).toBeInTheDocument();
  });

  it("should have no accessibility violations", async () => {
    const { container } = render(<RootAccountOverview rootAccount={mockRootAccount} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
