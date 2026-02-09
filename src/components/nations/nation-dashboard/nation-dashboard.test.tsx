import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { NationDashboard } from "./nation-dashboard";

// Mock props
const defaultProps = {
  activeTab: "plaza" as const,
  onTabChange: () => {},
  isScrolled: false,
};

describe("NationDashboard Accessibility", () => {
  it("should have no accessibility violations in Plaza view", async () => {
    const { container } = render(
      <NationDashboard {...defaultProps} activeTab="plaza" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations in Market view", async () => {
    const { container } = render(
      <NationDashboard {...defaultProps} activeTab="market" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations in Bank view", async () => {
    const { container } = render(
      <NationDashboard {...defaultProps} activeTab="bank" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations in Castle view", async () => {
    const { container } = render(
      <NationDashboard {...defaultProps} activeTab="castle" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations in Gate view", async () => {
    const { container } = render(
      <NationDashboard {...defaultProps} activeTab="gate" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
