import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { HeroSection } from "./hero-section";
import { SiteMissionSection } from "./site-mission-section";

describe("HeroSection Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<HeroSection />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("SiteMissionSection Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<SiteMissionSection />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
