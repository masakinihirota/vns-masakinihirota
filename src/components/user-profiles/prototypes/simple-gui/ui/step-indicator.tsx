import { CheckCircle2 } from "lucide-react";
import React from "react";
import { Step } from "../simple-gui.types";

interface StepIndicatorProps {
  currentStep: number;
  steps: Step[];
  onStepClick: (stepId: number) => void;
}

export const StepIndicator = ({
  currentStep,
  steps,
  onStepClick,
}: StepIndicatorProps) => {
  return (
    <div className="w-64 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full shrink-0 pt-10 px-6 hidden md:flex">
      <div className="mb-10">
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
          プロフィールの作成
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          New User Registration
        </p>
      </div>
      <div className="space-y-8 relative">
        {/* Connection Line */}
        <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-700 -z-10" />

        {steps.map((step, index) => {
          const isActive = currentStep === index + 1;
          const isCompleted = currentStep > index + 1;

          return (
            <div
              key={step.id}
              className="flex items-start group cursor-pointer"
              onClick={() => onStepClick(step.id)}
            >
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0 transition-colors duration-300 z-10
                  ${
                    isActive
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : isCompleted
                        ? "bg-green-500 border-green-500 text-white"
                        : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-500 group-hover:border-indigo-300 dark:group-hover:border-indigo-500 group-hover:text-indigo-400"
                  }
                `}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div className="ml-4 pt-1">
                <p
                  className={`text-sm font-semibold transition-colors ${
                    isActive
                      ? "text-indigo-600"
                      : isCompleted
                        ? "text-green-600 dark:text-green-400"
                        : "text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200"
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
