import { fireEvent, render, screen } from "@testing-library/react";
import { User } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { TypeCard } from "./type-card";

describe("TypeCard", () => {
  const mockType = {
    id: "test-id",
    label: "テストタイプ",
    icon: User,
    description: "テストの説明文",
  };

  const mockOnSelect = vi.fn();

  it("名前と説明文が正しく表示されること", () => {
    render(
      <TypeCard type={mockType} isSelected={false} onSelect={mockOnSelect} />
    );

    expect(screen.getByText("テストタイプ")).toBeInTheDocument();
    expect(screen.getByText("テストの説明文")).toBeInTheDocument();
  });

  it("クリック時にonSelectが呼ばれること", () => {
    render(
      <TypeCard type={mockType} isSelected={false} onSelect={mockOnSelect} />
    );

    fireEvent.click(screen.getByRole("button"));
    expect(mockOnSelect).toHaveBeenCalledWith("test-id");
  });

  it("isSelectedがtrueの時に選択状態のデザインが適用されること", () => {
    render(
      <TypeCard type={mockType} isSelected={true} onSelect={mockOnSelect} />
    );

    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  it("アクセシビリティ違反がないこと", async () => {
    const { container } = render(
      <TypeCard type={mockType} isSelected={false} onSelect={mockOnSelect} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
