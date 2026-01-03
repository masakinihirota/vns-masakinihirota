import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import * as matchers from "vitest-axe";
import { ProfileEdit } from "./profile-edit";
import { createInitialProfile } from "./profile-edit.logic";

// @ts-ignore
expect.extend(matchers);

describe("ProfileEdit Component", () => {
  const mockProps = {
    mode: "view" as const,
    page: "profile" as const,
    profile: createInitialProfile(),
    myWorks: [],
    evaluations: [],
    values: [],
    selectedCategory: "すべて",
    viewMode: "simple" as const,
    onSetPage: vi.fn(),
    onSetSelectedCategory: vi.fn(),
    onSetViewMode: vi.fn(),
    onAddWork: vi.fn(),
    onAddEvaluation: vi.fn(),
    onAddValue: vi.fn(),
    onDeleteEvaluation: vi.fn(),
  };

  it("should render profile name", () => {
    render(<ProfileEdit {...mockProps} />);
    expect(screen.getByText("New User")).toBeInTheDocument();
  });

  it("should have no accessibility violations", async () => {
    const { container } = render(<ProfileEdit {...mockProps} />);
    const results = await axe(container);

    (expect(results) as any).toHaveNoViolations();
  });
});
