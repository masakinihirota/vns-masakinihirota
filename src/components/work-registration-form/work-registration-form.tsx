"use client";

import { useState } from "react";
import { ConfirmationScreen } from "./features/confirmation-screen";
import { EntryForm } from "./features/entry-form";
import { SearchScreen } from "./features/search-screen";
import { Work, RegistrationFormValues } from "./schema";

export function WorkRegistrationForm() {
  const [view, setView] = useState<"search" | "entry" | "confirm">("search");
  const [formData, setFormData] = useState<Partial<RegistrationFormValues>>({});

  const handleSelectWork = (work: Work) => {
    setFormData({ work, entry: undefined });
    setView("entry");
  };

  const handleManualCreate = (title?: string, category?: "manga" | "anime") => {
    setFormData({
      work: {
        title: title || "",
        author: "",
        category: category || "manga",
        isNew: true,
        isAiGenerated: false,
        summary: "",
        publisher: "",
        scale: "one_week",
      },
      entry: undefined,
    });
    setView("entry");
  };

  const handleBackToSearch = () => {
    setView("search");
    setFormData({});
  };

  const handleConfirm = (data: RegistrationFormValues) => {
    setFormData(data);
    setView("confirm");
  };

  const handleBackToEntry = () => {
    setView("entry");
  };

  const handleRegister = async () => {
    // Actual API call would generally happen here or in a hook triggered here.
    // For now, simulating success.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert("登録完了（モック）");
    setView("search");
    setFormData({});
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-lg font-bold text-slate-800">
            作品登録 (New UI)
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {view === "search" && (
          <SearchScreen
            onSelect={handleSelectWork}
            onManualCreate={handleManualCreate}
          />
        )}
        {view === "entry" && (
          <EntryForm
            initialValues={formData}
            onBack={handleBackToSearch}
            onConfirm={handleConfirm}
          />
        )}
        {view === "confirm" && formData.work && formData.entry && (
          <ConfirmationScreen
            data={formData as RegistrationFormValues}
            onBack={handleBackToEntry}
            onRegister={handleRegister}
          />
        )}
      </main>
    </div>
  );
}
