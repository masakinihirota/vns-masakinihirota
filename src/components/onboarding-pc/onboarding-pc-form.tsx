"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { StepBasicValuesPC } from "./steps/step-basic-values-pc";
import { StepConfirmationPC } from "./steps/step-confirmation-pc";
import { StepDeclarationsPC } from "./steps/step-declarations-pc";
import { Step1ResidencePC } from "./steps/step1-residence-pc";
import { Step2HoursPC } from "./steps/step2-hours-pc";
import { Step3IdentityPC } from "./steps/step3-identity-pc";
import { Step4LanguagePC } from "./steps/step4-language-pc";
import { OnboardingSidebar } from "./ui/onboarding-sidebar";
// Reusing some types or logic if needed, but managing state locally for now or using useOnboarding hook if adapted.
// Given strict PC requirements, local state management might be cleaner for this new flow,
// but using useOnboarding hook from logic is better for consistency if types match.
// However, useOnboarding has specific state handling (e.g. cultural sphere reset) that we replicated in components or want to control here.
// Let's use local state for the orchestrator to keep it simple and bound to the new UI structure,
// using the hook logic as reference or utility.
// Actually, mapping data back to RootAccount structure at the end.

interface OnboardingPCFormProps {
  userId: string;
  initialData?: {
    constellation?: string;
  };
}

export function OnboardingPCForm({
  userId,
  initialData,
}: OnboardingPCFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    // Initial state matching fields
    activity_area_id: null, // Default or null
    core_activity_start: "09:00",
    core_activity_end: "18:00",
    core_activity_2_start: undefined,
    core_activity_2_end: undefined,
    holidayActivityStart: "09:00",
    holidayActivityEnd: "18:00",
    holidayActivity2Start: undefined,
    holidayActivity2End: undefined,
    uses_ai_translation: false,
    display_id: `user-${userId.substring(0, 8)}`, // Mock display ID
    nativeLanguages: [],
    amazon_associate_tag: "",
    is_minor: undefined, // Added minor check state
    basic_values: {}, // Added basic values
    // Declarations
    agreed_oasis: false,
    agreed_human: false,
    agreed_honesty: false,
    // Pre-fill from initialData
    zodiac_sign: initialData?.constellation,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = (data: any) => {
    setFormData((prev: any) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    // Validation for Step 5 (Identity) - Block minors
    if (currentStep === 5) {
      if (formData.is_minor === true) {
        alert("未成年の方はご利用いただけません。");
        return;
      }
      if (formData.is_minor === undefined) {
        // Optionally force selection, though UI might handle it or default is undefined
        // For now, let's enforce selection if we want strictness, or just let them pass if we don't block.
        // But the requirement implies we must ask.
        // As per implementation plan, disable button or block here.
        // Let's block if undefined for better UX, or just if check is true.
        // Let's enforce selection:
        if (formData.is_minor === undefined) {
          alert("未成年かどうかの確認を選択してください。");
          return;
        }
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 7));
  };
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // TODO: Transform formData to RootAccount structure and call API
    // Mapping:
    // location = `${formData.selectedCountry} ${formData.selectedRegion || ""}`.trim()

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert("PCオンボーディング完了！ (デモ)");
      alert("PCオンボーディング完了！ (デモ)");
      alert("PCオンボーディング完了！ (デモ)");
      // Redirect to Home, checks there will route to Mode Selection next
      router.push("/home");
    } catch (e) {
      console.error(e);
      alert("エラーが発生しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepDeclarationsPC data={formData} onUpdate={handleUpdate} />;
      case 2:
        return <StepBasicValuesPC data={formData} onUpdate={handleUpdate} />;
      case 3:
        return <Step1ResidencePC data={formData} onUpdate={handleUpdate} />;
      case 4:
        return <Step2HoursPC data={formData} onUpdate={handleUpdate} />;
      case 5:
        return <Step3IdentityPC data={formData} onUpdate={handleUpdate} />;
      case 6:
        return <Step4LanguagePC data={formData} onUpdate={handleUpdate} />;
      case 7:
        return (
          <StepConfirmationPC
            data={formData}
            onBack={prevStep}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-8 min-h-[600px]">
      {/* Sidebar / Progress */}
      <div className="w-full md:w-64 flex-shrink-0">
        <OnboardingSidebar
          currentStep={currentStep}
          onStepClick={setCurrentStep}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20">
        <div className="h-full flex flex-col">
          <div className="flex-1">{renderStep()}</div>

          <div className="mt-12 flex justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
            {currentStep > 1 ? (
              <button
                onClick={prevStep}
                className="px-6 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors bg-white dark:bg-transparent"
              >
                戻る
              </button>
            ) : (
              <div />
            )}

            {currentStep < 7 ? (
              <button
                onClick={nextStep}
                disabled={
                  (currentStep === 1 && !formData.agreed_oasis) ||
                  (currentStep === 5 &&
                    (formData.is_minor === true ||
                      formData.is_minor === undefined))
                }
                className={`
                  px-8 py-2.5 rounded-lg font-medium transition-all transform
                  ${
                    (currentStep === 1 && !formData.agreed_oasis) ||
                    (currentStep === 5 &&
                      (formData.is_minor === true ||
                        formData.is_minor === undefined))
                      ? "bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed shadow-none"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 hover:-translate-y-0.5"
                  }
                `}
              >
                {currentStep === 6 ? "確認画面へ" : "次へ"}
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-2.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "処理中..." : "設定完了"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
