import { render, screen, fireEvent } from "@testing-library/react";
import { Onboarding } from "./onboarding";
import { describe, it, expect } from "vitest";

describe("Onboarding UI", () => {
  it("renders the onboarding form", () => {
    render(<Onboarding />);
    expect(screen.getByText("ルートアカウント作成")).toBeInTheDocument();
    expect(screen.getByText("Step 1")).toBeInTheDocument();
  });

  it("selects an area when clicked", () => {
    render(<Onboarding />);
    const area1 = screen.getByText("エリア 1");
    fireEvent.click(area1);
    // Use a specific class that is on the container to find it
    const card = area1.closest(".cursor-pointer");
    expect(card).toHaveClass("border-yellow-400");
  });

  it("disables submit button initially", () => {
    render(<Onboarding />);
    const submitButton = screen.getByRole("button", { name: "アカウントを作成する" });
    expect(submitButton).toBeDisabled();
  });
});
