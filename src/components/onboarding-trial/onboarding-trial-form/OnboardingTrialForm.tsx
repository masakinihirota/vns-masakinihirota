"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
// Reuse existing components where possible
import { Step1ResidencePC } from "@/components/onboarding-pc/steps/step1-residence-pc";
import { Step2HoursPC } from "@/components/onboarding-pc/steps/step2-hours-pc";
import { Step4LanguagePC } from "@/components/onboarding-pc/steps/step4-language-pc";
import { OnboardingSidebarTrial } from "@/components/onboarding-trial/ui/onboarding-sidebar-trial";
import { TrialStorage, type TrialRootAccount } from "@/lib/trial-storage";
import { StepConfirmationTrial } from "../steps/step-confirmation-trial";
// New components for trial
import { StepDeclarationsTrial } from "../steps/step-declarations-trial";
import { Step3IdentityTrial } from "../steps/step3-identity-trial";

type TrialFormData = Omit<TrialRootAccount, "display_name" | "created_at"> & {
  is_trial: boolean;
};

export function OnboardingTrialForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<TrialFormData>({
    // Initial state
    activity_area_id: null,
    core_activity_start: "09:00",
    core_activity_end: "18:00",
    holidayActivityStart: "09:00",
    holidayActivityEnd: "18:00",
    uses_ai_translation: false,
    display_id: `trial-${Math.random().toString(36).substring(2, 10)}`,
    nativeLanguages: [],
    // Declarations - Only Oasis
    agreed_oasis: false,
    // Identity
    zodiac_sign: "",
    birth_generation: "",
    // Trial specific
    is_trial: true,
    week_schedule: {
      mon: "BUSY",
      tue: "BUSY",
      wed: "BUSY",
      thu: "BUSY",
      fri: "BUSY",
      sat: "MATCH",
      sun: "MATCH",
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = (data: Partial<TrialFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 6));
  };
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const constellationName = `${formData.zodiac_sign || "Star"}-${Math.floor(Math.random() * 1000)}`;

      const trialRootAccount: TrialRootAccount = {
        display_id: formData.display_id,
        display_name: constellationName,
        activity_area_id: formData.activity_area_id,
        core_activity_start: formData.core_activity_start,
        core_activity_end: formData.core_activity_end,
        holidayActivityStart: formData.holidayActivityStart,
        holidayActivityEnd: formData.holidayActivityEnd,
        uses_ai_translation: formData.uses_ai_translation,
        nativeLanguages: formData.nativeLanguages,
        agreed_oasis: formData.agreed_oasis,
        zodiac_sign: formData.zodiac_sign,
        birth_generation: formData.birth_generation,
        week_schedule: formData.week_schedule,
        created_at: new Date().toISOString(),
      };

      // Save to localStorage using utility
      TrialStorage.setRootAccount(trialRootAccount);

      toast.success("体験版登録完了！", {
        description: `あなたの星座名: ${constellationName}`,
      });

      // Redirect to Beginning Country
      router.push("/onboarding-trial/choice");
    } catch (e) {
      console.error("Trial registration failed:", e);
      toast.error("エラーが発生しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepDeclarationsTrial data={formData} onUpdate={handleUpdate} />
        );
      case 2:
        return <Step1ResidencePC data={formData} onUpdate={handleUpdate} />;
      case 3:
        return (
          <Step2HoursPC
            data={formData}
            onUpdate={handleUpdate}
            weekSchedulerProps={{
              labels: { MATCH: "自由行動時間" },
              labelClassName: "text-[18px]",
            }}
            holidayLabel="自由行動時間"
          />
        );
      case 4:
        return <Step3IdentityTrial data={formData} onUpdate={handleUpdate} />;
      case 5:
        return <Step4LanguagePC data={formData} onUpdate={handleUpdate} />;
      case 6:
        return (
          <StepConfirmationTrial
            data={formData}
            onBack={prevStep}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  // Custom Sidebar Steps for visual consistency (6 steps instead of 8)
  // For now, allow OnboardingSidebar to handle it, or we might need a custom definition if it hardcodes steps.
  // Let's check OnboardingSidebar implementation later.
  // If it hardcodes 8 steps, it might look weird.
  // Assuming OnboardingSidebar takes steps as props or is flexible...
  // Wait, I checked `OnboardingSidebar` in file list but not content.
  // If `OnboardingPCForm` uses it, and now I have fewer steps.
  // Let's proceed and check visual later. If needed I'll make `OnboardingSidebarTrial`.

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-8 min-h-[600px]">
      {/* Sidebar / Progress */}
      <div className="w-full md:w-64 flex-shrink-0">
        {/* TODO: Check if OnboardingSidebar supports custom steps. If not, create Trial version. */}
        {/* For now, just wrapping it. */}
        <OnboardingSidebarTrial // Changed component name
          currentStep={currentStep}
          onStepClick={(step) => {
            // Block jumping ahead logic if needed, or just allow
            setCurrentStep(step);
          }}
          // Passing totalSteps if supported, otherwise it might default to 8
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20">
        <div className="h-full flex flex-col">
          <div className="mb-4 text-right">
            <span className="text-xs text-indigo-500 font-bold px-2 py-1 bg-indigo-50 dark:bg-indigo-900/20 rounded-full border border-indigo-100 dark:border-indigo-800">
              お試し体験モード
            </span>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
            {renderStep()}
          </div>

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

            {currentStep < 6 ? (
              <button
                onClick={nextStep}
                disabled={currentStep === 1 && !formData.agreed_oasis}
                className={`
                  px-8 py-2.5 rounded-lg font-medium transition-all transform
                  ${
                    currentStep === 1 && !formData.agreed_oasis
                      ? "bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed shadow-none"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 hover:-translate-y-0.5"
                  }
                `}
              >
                {currentStep === 5 ? "確認画面へ" : "次へ"}
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-2.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "処理中..." : "利用開始"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
