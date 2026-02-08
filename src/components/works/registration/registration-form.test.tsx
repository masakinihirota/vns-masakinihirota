import { zodResolver } from "@hookform/resolvers/zod";
import { render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { RegistrationForm } from "./registration-form";
import { registrationFormSchema } from "./schema";

// Mock hooks
vi.mock("./use-work-registration", () => ({
  useWorkRegistration: () => {
    // Use real useForm to make FormField work properly
    const form = useForm({
      resolver: zodResolver(registrationFormSchema),
      defaultValues: {
        work: {
          isNew: true,
          isAiGenerated: false,
          isPurchasable: true,
        },
        entry: {
          status: "expecting",
        },
      },
    });
    return {
      form,
      onSubmit: vi.fn((e) => e.preventDefault()),
      isLoading: false,
      error: null,
    };
  },
}));

vi.mock("./use-ai-autocomplete", () => ({
  useAiAutocomplete: () => ({
    suggest: vi.fn(),
    isSuggesting: false,
    suggestion: null,
    applySuggestion: vi.fn(),
    discardSuggestion: vi.fn(),
  }),
}));

// Mock useRouter
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

// Mock useTheme
vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light", setTheme: vi.fn() }),
}));

describe("RegistrationForm", () => {
  it("renders correctly", () => {
    render(<RegistrationForm />);
    expect(screen.getByText("作品登録")).toBeInTheDocument();
    expect(screen.getByText("作品情報")).toBeInTheDocument();
    expect(screen.getByText("あなたのステータス")).toBeInTheDocument();
    expect(screen.getByLabelText("タイトル")).toBeInTheDocument();
  });

  it("should have no accessibility violations", async () => {
    const { container } = render(<RegistrationForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
