"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Step1Identity } from "./steps/step1-identity";
import { Step2Culture } from "./steps/step2-culture";
import { Step3Hours } from "./steps/step3-hours";

interface OnboardingFormProps {
  userId: string;
}

export function OnboardingForm({ userId }: OnboardingFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = (data: any) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // TODO: Call API to create root account
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("ルートアカウントを作成しました！");
      router.push("/root-accounts");
    } catch (error) {
      console.error("Submission error:", error);
      alert("エラーが発生しました。");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-slate-900 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
        ルートアカウント作成
      </h1>

      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className={`flex items-center ${step < 3 ? "flex-1" : ""}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${currentStep >= step
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                }`}
            >
              {step}
            </div>
            {step < 3 && (
              <div
                className={`h-1 flex-1 mx-2 ${currentStep > step
                    ? "bg-indigo-600"
                    : "bg-slate-200 dark:bg-slate-700"
                  }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="mb-8 min-h-[400px]">
        {currentStep === 1 && (
          <Step1Identity
            data={formData}
            onUpdate={handleUpdate}
            userId={userId}
          />
        )}
        {currentStep === 2 && (
          <Step2Culture data={formData} onUpdate={handleUpdate} />
        )}
        {currentStep === 3 && (
          <Step3Hours data={formData} onUpdate={handleUpdate} />
        )}
      </div>

      <div className="mt-8 flex justify-end gap-2">
        {currentStep > 1 && (
          <button
            onClick={prevStep}
            disabled={isSubmitting}
            className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
          >
            戻る
          </button>
        )}
        {currentStep < 3 ? (
          <button
            onClick={nextStep}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            次へ
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                送信中...
              </>
            ) : (
              "完了"
            )}
          </button>
        )}
      </div>
    </div>
  );
}
