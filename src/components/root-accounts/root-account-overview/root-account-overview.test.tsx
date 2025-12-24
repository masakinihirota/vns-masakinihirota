import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { RootAccountOverview, RootAccount } from "./root-account-overview";

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
});
