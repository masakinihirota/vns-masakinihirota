"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { StepBasicValuesPC } from "./steps/step-basic-values-pc";
import { StepConfirmationPC } from "./steps/step-confirmation-pc";
import { StepDeclarationsPC } from "./steps/step-declarations-pc";
import { Step1ResidencePC } from "./steps/step1-residence-pc";
import { Step2HoursPC } from "./steps/step2-hours-pc";
import { Step3IdentityPC } from "./steps/step3-identity-pc";
import { Step4LanguagePC } from "./steps/step4-language-pc";
// Reusing some types or logic if needed, but managing state locally for now or using useOnboarding hook if adapted.
// Given strict PC requirements, local state management might be cleaner for this new flow,
// but using useOnboarding hook from logic is better for consistency if types match.
// However, useOnboarding has specific state handling (e.g. cultural sphere reset) that we replicated in components or want to control here.
// Let's use local state for the orchestrator to keep it simple and bound to the new UI structure,
// using the hook logic as reference or utility.
// Actually, mapping data back to RootAccount structure at the end.

interface OnboardingPCFormProps {
  userId: string;
}

export function OnboardingPCForm({ userId }: OnboardingPCFormProps) {
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
      router.push("/beginning-country");
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
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg h-full sticky top-4">
          <h1 className="text-xl font-bold mb-8 text-slate-900 dark:text-white">
            アカウント作成
          </h1>

          <div className="space-y-6 relative">
            {/* Connection Line */}
            <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-800 -z-10" />

            {[1, 2, 3, 4, 5, 6, 7].map((step) => (
              <button
                key={step}
                onClick={() => setCurrentStep(step)}
                className="flex items-center gap-4 w-full text-left group"
              >
                <div
                  className={`
                                    w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all
                                    ${currentStep >= step
                      ? "bg-indigo-600 text-white shadow-md ring-4 ring-indigo-50 dark:ring-indigo-900/30"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
                    }
                                `}
                >
                  {step}
                </div>
                <span
                  className={`
                                    text-sm font-medium transition-colors
                                    ${currentStep === step ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300"}
                                `}
                >
                  {step === 1 && "3つの誓い"}
                  {step === 2 && "10の基本価値観"}
                  {step === 3 && "居住地・文化圏"}
                  {step === 4 && "活動時間"}
                  {step === 5 && "アイデンティティ"}
                  {step === 6 && "言語設定"}
                  {step === 7 && "確認"}
                </span>
              </button>
            ))}
          </div>

          {/* Guide Character */}
          <div className="hidden md:block mt-8 border-t border-slate-100 dark:border-slate-800 pt-6 text-center">
            <div className="relative w-28 h-28 mx-auto mb-3">
              <Image
                src="/images/characters/schrodinger-guide.png"
                alt="シュレディンガーちゃん"
                fill
                className="object-contain drop-shadow-lg scale-110"
              />
            </div>
            <div className="bg-indigo-50 dark:bg-slate-800 p-3 rounded-xl text-xs text-indigo-900 dark:text-indigo-200 relative border border-indigo-100 dark:border-slate-700">
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-indigo-50 dark:bg-slate-800 rotate-45 border-l border-t border-indigo-100 dark:border-slate-700" />
              <p className="font-bold leading-relaxed">
                {currentStep === 1 && (
                  <>
                    VNSへようこそ！
                    <br />
                    まずは私たちの
                    <br />
                    大切な約束を確認してね。
                  </>
                )}
                {currentStep === 2 && (
                  <>
                    あなたの価値観を
                    <br />
                    教えてね。
                    <br />
                    正解はないから安心してね！
                  </>
                )}
                {currentStep === 3 && (
                  <>
                    まずは住んでいる場所と
                    <br />
                    文化圏を教えてね。
                    <br />
                    すべてはここから始まるよ！
                  </>
                )}
                {currentStep === 4 && (
                  <>
                    いつ活動しているの？
                    <br />
                    一緒に働いたり遊んだりする
                    <br />
                    時間を教えてね！
                  </>
                )}
                {currentStep === 5 && (
                  <>
                    生まれた世代と
                    <br />
                    星座を教えてね！
                  </>
                )}
                {currentStep === 6 && (
                  <>
                    何語で話すのが得意？
                    <br />
                    AI翻訳を使えば世界中の人と
                    <br />
                    お話しできるよ✨
                  </>
                )}
                {currentStep === 7 && (
                  <>
                    最後に設定内容を
                    <br />
                    確認してね。
                    <br />
                    準備はＯＫ？
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
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
                  currentStep === 5 &&
                  (formData.is_minor === true ||
                    formData.is_minor === undefined)
                }
                className={`
                  px-8 py-2.5 rounded-lg font-medium transition-all transform
                  ${currentStep === 5 &&
                    (formData.is_minor === true ||
                      formData.is_minor === undefined)
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
