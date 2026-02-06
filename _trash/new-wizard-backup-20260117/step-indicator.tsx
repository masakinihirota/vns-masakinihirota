import { CheckCircle2 } from "lucide-react";
import React from "react";
import { Step } from "./types";

interface StepIndicatorProps {
  currentStep: number;
  steps: readonly Step[];
  onStepClick?: (stepNumber: number) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  steps,
  onStepClick,
}) => {
  return (
    <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col h-full fixed left-0 top-0 pt-10 px-6 z-10 hidden md:flex">
      <div className="mb-10">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">
          VNS Profile
        </h1>
        <p className="text-xs text-slate-500 mt-1">New User Registration</p>
      </div>
      <div className="space-y-8 relative">
        {/* Connection Line */}
        <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-slate-200 -z-10" />

        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep === stepNumber;
          const isCompleted = currentStep > stepNumber;
          const isClickable = stepNumber < currentStep;

          return (
            <div
              key={step.id}
              className={`flex items-start group ${isClickable ? "cursor-pointer" : ""}`}
              onClick={() => isClickable && onStepClick?.(stepNumber)}
            >
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0 transition-all duration-300 z-10
                  ${
                    isActive
                      ? "bg-indigo-600 border-indigo-600 text-white ring-4 ring-indigo-50"
                      : isCompleted
                        ? "bg-green-500 border-green-500 text-white group-hover:bg-green-600 group-hover:border-green-600"
                        : "bg-white border-slate-300 text-slate-400"
                  }
                `}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 transition-transform group-hover:scale-110" />
                ) : (
                  <span>{stepNumber}</span>
                )}
              </div>
              <div className="ml-4 pt-1">
                <p
                  className={`text-sm font-semibold transition-colors ${isActive ? "text-indigo-600" : isCompleted ? "text-green-600 group-hover:text-green-700" : "text-slate-500"}`}
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
