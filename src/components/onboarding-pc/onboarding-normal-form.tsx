"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { StepBasicValuesPC } from "./steps/step-basic-values-pc";
import { StepConfirmationPC } from "./steps/step-confirmation-pc";
import { StepDeclarationsPC } from "./steps/step-declarations-pc";
import { StepSystemRequestPC } from "./steps/step-system-request-pc";
import { Step1ResidencePC } from "./steps/step1-residence-pc";
import { Step2HoursPC } from "./steps/step2-hours-pc";
import { Step3IdentityPC } from "./steps/step3-identity-pc";
import { Step4LanguagePC } from "./steps/step4-language-pc";
import { OnboardingNormalSidebar } from "./ui/onboarding-normal-sidebar";

interface OnboardingNormalFormProps {
  userId: string;
  initialData?: {
    constellation?: string;
  };
}

export function OnboardingNormalForm({
  userId,
  initialData,
}: OnboardingNormalFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    activity_area_id: null,
    core_activity_start: "09:00",
    core_activity_end: "18:00",
    core_activity_2_start: undefined,
    core_activity_2_end: undefined,
    holidayActivityStart: "09:00",
    holidayActivityEnd: "18:00",
    holidayActivity2Start: undefined,
    holidayActivity2End: undefined,
    uses_ai_translation: false,
    display_id: `user-${userId.substring(0, 8)}`,
    nativeLanguages: [],
    amazon_associate_tag: "",
    is_minor: undefined,
    basic_values: {},
    agreed_oasis: false,
    agreed_human: false,
    agreed_honesty: false,
    agreed_system_open_data: false,
    agreed_system_mediator: false,
    agreed_system_ad: false,
    agreed_system_creator: false,
    zodiac_sign: initialData?.constellation,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = (data: any) => {
    setFormData((prev: any) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep === 1 && !formData.agreed_oasis) return;
    if (currentStep === 5) {
      if (formData.is_minor === true) {
        toast.error("未成年の方はご利用いただけません。");
        return;
      }
      if (formData.is_minor === undefined) {
        toast.warning("未成年かどうかの確認を選択してください。");
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 8));
  };
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("オンボーディングが完了しました。");
      router.push("/onboarding-trial/choice");
    } catch (e) {
      console.error(e);
      toast.error("エラーが発生しました。");
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
        return <StepSystemRequestPC data={formData} onUpdate={handleUpdate} />;
      case 8:
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
      <div className="w-full md:w-64 flex-shrink-0">
        <OnboardingNormalSidebar
          currentStep={currentStep}
          onStepClick={setCurrentStep}
        />
      </div>

      <div className="flex-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20">
        <div className="h-full flex flex-col">
          <div className="mb-4 text-right">
            <button
              onClick={() => router.push("/onboarding-pc")}
              className="text-xs text-slate-400 hover:text-indigo-500 transition-colors flex items-center gap-1 ml-auto"
            >
              <span>ゲーミフィケーション版（キャラクターあり）で作成する</span>
              <ArrowRight className="w-4 h-4" />
            </button>
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

            {currentStep < 8 ? (
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
                                    ${(currentStep === 1 &&
                    !formData.agreed_oasis) ||
                    (currentStep === 5 &&
                      (formData.is_minor === true ||
                        formData.is_minor === undefined))
                    ? "bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed shadow-none"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 hover:-translate-y-0.5"
                  }
                                `}
              >
                {currentStep === 7 ? "確認画面へ" : "次へ"}
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
