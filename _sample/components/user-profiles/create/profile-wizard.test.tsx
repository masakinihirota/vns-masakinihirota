import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { ProfileWizard } from "./profile-wizard";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, ...properties }: React.ComponentPropsWithoutRef<"div">) => (
      <div className={className} {...properties}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("ProfileWizard", () => {
  it("renders the initial step correctly", () => {
    render(<ProfileWizard />);

    // Check for title
    expect(screen.getByText("Identity")).toBeInTheDocument();

    // Check for Identity step content
    expect(screen.getByText("表示名")).toBeInTheDocument();
    expect(screen.getByText("肩書き / ロール")).toBeInTheDocument();
  });
});
