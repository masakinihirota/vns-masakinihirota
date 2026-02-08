import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import * as axeMatchers from "vitest-axe/matchers";
import { WorkRegistrationForm } from "./work-registration-form";

expect.extend(axeMatchers);

// Mocking heavy components or those with external dependencies if needed
vi.mock("./features/search-screen", () => ({
  SearchScreen: ({
    onManualCreate,
  }: {
    onManualCreate: (title?: string, category?: "manga" | "anime") => void;
  }) => (
    <div data-testid="search-screen">
      <button onClick={() => onManualCreate("Test", "manga")}>
        Manual Create
      </button>
    </div>
  ),
}));

describe("WorkRegistrationForm", () => {
  it("初期表示が検索画面であること", () => {
    render(<WorkRegistrationForm />);
    expect(screen.getByTestId("search-screen")).toBeInTheDocument();
  });

  it("アクセシビリティ違反がないこと", async () => {
    const { container } = render(<WorkRegistrationForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
