import "vitest-axe/extend-expect";
import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { UserProfileWizard } from "./user-profile-wizard";

// Mock scrollIntoView since it's not implemented in jsdom
window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe("UserProfileWizard Accessibility", () => {
  it("should have no accessibility violations on Step 1 (Identity)", async () => {
    const { container } = render(<UserProfileWizard />);
    const results = await axe(container);
    (expect(results) as any).toHaveNoViolations();
  });

  // Note: Testing subsequent steps requires interaction or mocking internal state.
  // For now, we ensure the initial render (Step 1) is accessible.
  // Integration tests would cover the full flow.
});

describe("UserProfileWizard Rendering", () => {
  it("renders Step 1 initially", () => {
    render(<UserProfileWizard />);
    expect(screen.getByText("1. 役割 (Role)")).toBeInTheDocument();
    expect(screen.getByText("Identity & Attributes")).toBeInTheDocument();
  });
});
