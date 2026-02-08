"use client";

import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { RegistrationFormValues } from "./schema";

export function useAiAutocomplete(form: UseFormReturn<RegistrationFormValues>) {
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestion, setSuggestion] = useState<Partial<RegistrationFormValues> | null>(null);

  const suggest = async (title: string) => {
    if (!title) return;
    setIsSuggesting(true);
    setSuggestion(null);

    // Mock API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock suggestion data based on title
    // In real implementation, this would call an API route
    const mockData: Partial<RegistrationFormValues> = {
      work: {
        title: title,
        author: "AI Suggested Author",
        publisher: "AI Suggested Publisher",
        summary: `「${title}」のAI生成あらすじです。これはモックデータです。`,
        category: "manga",
        scale: "one_cour",
        releaseYear: "2024",
        isPurchasable: true,
        tags: "AI, Manga, Mock",
        isNew: true,
        isAiGenerated: true,
        officialUrl: "https://example.com",
      },
    };

    setSuggestion(mockData);
    setIsSuggesting(false);
  };

  const applySuggestion = () => {
    if (suggestion && suggestion.work) {
      // Loop through keys and setValue
      (Object.keys(suggestion.work) as Array<keyof typeof suggestion.work>).forEach((key) => {
        const value = suggestion.work?.[key];
        if (value !== undefined) {
          // @ts-ignore
          form.setValue(`work.${key}`, value, { shouldDirty: true, shouldValidate: true });
        }
      });
    }
    setSuggestion(null);
  };

  const discardSuggestion = () => {
    setSuggestion(null);
  };

  return {
    suggest,
    isSuggesting,
    suggestion,
    applySuggestion,
    discardSuggestion,
  };
}
