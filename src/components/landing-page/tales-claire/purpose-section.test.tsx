import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { PurposeSection } from "./purpose-section";

describe("PurposeSection", () => {
  it("should render successfully with all purposes", () => {
    render(<PurposeSection />);

    expect(
      screen.getByText("価値観サイト masakinihirotaの機能")
    ).toBeInTheDocument();
    expect(screen.getByText("安心で安全な場所を提供する")).toBeInTheDocument();
    expect(
      screen.getByText("スキルを登録して仕事を獲得したり、他者に教えたりする")
    ).toBeInTheDocument();
  });

  it("should have no accessibility violations", async () => {
    const { container } = render(<PurposeSection />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
