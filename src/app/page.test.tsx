import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import RootLandingPage from "./page";

vi.mock("@/components/landing-page", () => ({
  LandingPage: () => <main aria-label="landing-page">Mock LandingPage</main>,
}));

describe("RootLandingPage", () => {
  it("/ で LandingPage を表示すること", () => {
    render(<RootLandingPage />);
    expect(screen.getByLabelText("landing-page")).toBeInTheDocument();
  });
});
