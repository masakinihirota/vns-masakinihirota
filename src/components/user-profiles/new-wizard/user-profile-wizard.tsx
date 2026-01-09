import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import React, { useState } from "react";
import { BASIC_VALUE_QUESTIONS } from "./basic-values-data";
import {
  STEPS,
  ZODIAC_DATA,
  NAME_ADJECTIVES,
  NAME_CONCEPTS,
} from "./constants";
import { StepIndicator } from "./step-indicator";
import { Step1Identity } from "./step1-identity";
import { Step2OwnWorks } from "./step2-own-works";
import { Step3FavWorks } from "./step3-fav-works";
import { Step4Values } from "./step4-values";
import { Step5Confirm } from "./step5-confirm";
import { WizardFormData } from "./types";

const generateNameSuggestions = (
  zodiacJp: string,
  zodiacEn: string,
  count: number,
  exclude: string[] = []
): string[] => {
  const suggestions: string[] = [];

  // (Patterns are adj-concept) or we can just compare full names

  while (suggestions.length < count) {
    const adj =
      NAME_ADJECTIVES[Math.floor(Math.random() * NAME_ADJECTIVES.length)];
    const concept =
      NAME_CONCEPTS[Math.floor(Math.random() * NAME_CONCEPTS.length)];
    const newName = `${adj}${concept}の${zodiacJp} (${zodiacEn})`;

    if (!exclude.includes(newName) && !suggestions.includes(newName)) {
      suggestions.push(newName);
    }

    // Safety break if we run out of combinations (unlikely here but good practice)
    if (suggestions.length < count && adj.length * concept.length < count * 2) {
      // Basic fallback if needed, but we have enough tokens
    }
  }
  return suggestions;
};

export const UserProfileWizard: React.FC = () => {
  const defaultZodiac = ZODIAC_DATA[0]; // Example: Aries
  const initialSuggestions = generateNameSuggestions(
    defaultZodiac.jp,
    defaultZodiac.en,
    3
  );

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<WizardFormData>({
    role: "Leader", // Fixed
    type: "SELF",
    purposes: [],
    customName: "", // 新規追加
    displayName: initialSuggestions[0], // Pre-pick first one
    zodiac: defaultZodiac.jp,
    nameSuggestions: initialSuggestions,
    ownWorks: [],
    favWorks: [],
    valuesAnswer: "",
    basicValues: {}, // New structured storage
  });

  const refreshSuggestions = () => {
    const zodiacInfo =
      ZODIAC_DATA.find((z) => z.jp === formData.zodiac) || defaultZodiac;
    // Exclude current suggestions from next batch
    const newSuggestions = generateNameSuggestions(
      zodiacInfo.jp,
      zodiacInfo.en,
      3,
      formData.nameSuggestions
    );
    setFormData((prev) => ({
      ...prev,
      nameSuggestions: newSuggestions,
    }));
  };

  const updateForm = <K extends keyof WizardFormData>(
    key: K,
    value: WizardFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const togglePurpose = (id: string) => {
    setFormData((prev) => {
      const exists = prev.purposes.includes(id);
      return {
        ...prev,
        purposes: exists
          ? prev.purposes.filter((p) => p !== id)
          : [...prev.purposes, id],
      };
    });
  };

  const addOwnWork = () => {
    setFormData((prev) => ({
      ...prev,
      ownWorks: [...prev.ownWorks, { id: Date.now(), title: "", url: "" }],
    }));
  };

  const updateOwnWork = (id: number, field: "title" | "url", value: string) => {
    setFormData((prev) => ({
      ...prev,
      ownWorks: prev.ownWorks.map((w) =>
        w.id === id ? { ...w, [field]: value } : w
      ),
    }));
  };

  const removeOwnWork = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      ownWorks: prev.ownWorks.filter((w) => w.id !== id),
    }));
  };

  const addFavWork = (
    isManual: boolean,
    data: {
      category: string;
      selectedTitle: string;
      title: string;
      genres?: string[];
    }
  ) => {
    const newWork = {
      id: Date.now(),
      title: isManual ? data.title : data.selectedTitle,
      category: data.category,
      isBest: false,
      manualAdded: isManual,
      genres: data.genres,
    };
    setFormData((prev) => ({ ...prev, favWorks: [...prev.favWorks, newWork] }));
  };

  const toggleBestWork = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      favWorks: prev.favWorks.map((w) => ({
        ...w,
        isBest: w.id === id ? !w.isBest : false,
      })),
    }));
  };

  const removeFavWork = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      favWorks: prev.favWorks.filter((w) => w.id !== id),
    }));
  };

  // Basic validation for Step 4
  const isStepComplete = () => {
    if (currentStep === 4) {
      // Are all required "Basic of Basics" questions answered?
      const allAnswered = BASIC_VALUE_QUESTIONS.every(
        (q) => !!formData.basicValues[q.id]
      );
      // Specifically check for Oasis Declaration agreement
      const isOasisAgreed =
        formData.basicValues["oasis"] === "同意して遵守する";
      return allAnswered && isOasisAgreed;
    }
    return true;
  };

  return (
    <div className="fixed inset-0 z-[50] flex h-screen bg-white font-sans text-slate-800 overflow-hidden">
      <StepIndicator
        currentStep={currentStep}
        steps={STEPS}
        onStepClick={setCurrentStep}
      />

      <main className="flex-1 ml-0 md:ml-64 flex flex-col h-full relative">
        <div className="flex-1 overflow-y-auto px-6 md:px-12 py-12 scroll-smooth">
          <div className="max-w-5xl mx-auto pb-24">
            {currentStep === 1 && (
              <Step1Identity
                formData={formData}
                updateForm={updateForm}
                togglePurpose={togglePurpose}
                refreshSuggestions={refreshSuggestions}
              />
            )}
            {currentStep === 2 && (
              <Step2OwnWorks
                ownWorks={formData.ownWorks}
                addOwnWork={addOwnWork}
                updateOwnWork={updateOwnWork}
                removeOwnWork={removeOwnWork}
              />
            )}
            {currentStep === 3 && (
              <Step3FavWorks
                favWorks={formData.favWorks}
                addFavWork={addFavWork}
                toggleBestWork={toggleBestWork}
                removeFavWork={removeFavWork}
              />
            )}
            {currentStep === 4 && (
              <Step4Values formData={formData} setFormData={setFormData} />
            )}
            {currentStep === 5 && <Step5Confirm formData={formData} />}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 px-6 md:px-12 py-4 z-20">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${currentStep === 1 ? "text-slate-300 cursor-not-allowed" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
            >
              <ArrowLeft className="w-5 h-5" />
              戻る
            </button>

            {currentStep < 5 ? (
              <button
                onClick={() =>
                  isStepComplete() &&
                  setCurrentStep((prev) => Math.min(5, prev + 1))
                }
                className={`flex items-center gap-2 px-8 py-3 rounded-lg font-bold transition-all hover:scale-105 active:scale-95 ${isStepComplete() ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
              >
                次へ進む
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => alert("プロフィールを作成しました！")}
                className="flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 shadow-lg shadow-green-200 transition-all hover:scale-105 active:scale-95"
              >
                <CheckCircle2 className="w-5 h-5" />
                プロフィールを作成する
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
