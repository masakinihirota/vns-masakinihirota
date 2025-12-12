import { render, screen } from "@testing-library/react";
import { WorkRegistration } from "./work-registration";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { workSchema, initialFormValues, WorkFormValues } from "./work-registration.logic";
import { describe, it, expect, vi } from "vitest";

// Wrapper component to provide form context
const TestWrapper = () => {
  const form = useForm<WorkFormValues>({
    resolver: zodResolver(workSchema) as Resolver<WorkFormValues>,
    defaultValues: initialFormValues,
  });

  return (
    <WorkRegistration
      form={form}
      onSubmit={vi.fn()}
      isSubmitting={false}
      onFillDummyData={vi.fn()}
    />
  );
};

describe("WorkRegistration", () => {
  it("renders the form fields", () => {
    render(<TestWrapper />);

    expect(screen.getByRole("heading", { name: "作品登録" })).toBeDefined();
    expect(screen.getByLabelText("タイトル")).toBeDefined();
    expect(screen.getByLabelText("説明")).toBeDefined();
    // Select component might be harder to query by label directly without userEvent, but we check presence
    expect(screen.getByText("ステータス")).toBeDefined();
    expect(screen.getByRole("button", { name: "登録する" })).toBeDefined();
  });
});
