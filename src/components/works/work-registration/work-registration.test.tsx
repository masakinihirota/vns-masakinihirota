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
      requiredPoints={100}
    />
  );
};

describe("WorkRegistration", () => {
  it("renders the form fields", () => {
    render(<TestWrapper />);

    expect(screen.getByRole("heading", { name: "作品を登録" })).toBeDefined();
    // Use regex for partial match or exact string if label includes *
    // "作品タイトル *"
    expect(screen.getByText(/作品タイトル/)).toBeDefined();
    expect(screen.getByText("カテゴリを選択")).toBeDefined();
    expect(screen.getByText("制作年代・時期")).toBeDefined();
    expect(screen.getByRole("button", { name: "この内容で登録する" })).toBeDefined();
  });
});
