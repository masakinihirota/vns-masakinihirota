import "vitest-axe/extend-expect";
import { render } from "@testing-library/react";
import React from "react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { Step4Values } from "./step4-values";
import { WizardFormData } from "./types";

describe("Step4Values Accessibility", () => {
  const mockFormData: WizardFormData = {
    role: "",
    type: "",
    purposes: [],
    customName: "",
    displayName: "",
    zodiac: "",
    nameSuggestions: [],
    ownWorks: [],
    favWorks: [],
    basicValues: {},
    valuesAnswer: "",
  };

  const mockSetFormData = () => {};

  it("アクセシビリティ違反がないこと（初期状態）", async () => {
    const { container } = render(
      <Step4Values
        formData={mockFormData}
        setFormData={mockSetFormData as any}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("オアシス宣言の警告表示時にアクセシビリティ違反がないこと", async () => {
    const formDataWithOasisReject: WizardFormData = {
      ...mockFormData,
      basicValues: {
        oasis: "知らない",
      },
    };

    const { container } = render(
      <Step4Values
        formData={formDataWithOasisReject}
        setFormData={mockSetFormData as any}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
