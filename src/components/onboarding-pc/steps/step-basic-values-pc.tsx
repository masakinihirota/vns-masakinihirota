"use client";

import {
  BASIC_VALUES_QUESTIONS,
  BasicValueQuestionId,
} from "../onboarding.logic";

interface OnboardingData {
  basic_values?: Record<string, string | string[] | undefined>;
  [key: string]: unknown;
}

interface StepBasicValuesPCProps {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
}

export function StepBasicValuesPC({ data, onUpdate }: StepBasicValuesPCProps) {
  const handleChange = (id: BasicValueQuestionId, value: string) => {
    // データ構造: basic_values: { [questionId]: value | string[] }
    const currentValues = data.basic_values || {};
    const question = BASIC_VALUES_QUESTIONS.find((q) => q.id === id);

    let newValue: string | string[] | undefined;

    if (question?.multiple) {
      const currentArray: string[] = Array.isArray(currentValues[id])
        ? currentValues[id]
        : [];
      if (currentArray.includes(value)) {
        newValue = currentArray.filter((v) => v !== value);
      } else {
        newValue = [...currentArray, value];
      }
    } else {
      // Allow toggle off for single selection
      if (currentValues[id] === value) {
        newValue = undefined; // or remove key, using undefined works with our validation filter
      } else {
        newValue = value;
      }
    }

    onUpdate({
      basic_values: {
        ...currentValues,
        [id]: newValue,
      },
    });
  };

  const selectedValues = data.basic_values || {};

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent inline-block">
          10の基本価値観
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
          あなたの価値観について教えてください。
          <br />
          正しい答えはありません。正直にお答えください。
        </p>
      </div>

      <div className="grid gap-8">
        {BASIC_VALUES_QUESTIONS.map((question) => {
          // Categorize colors or styles optionally, but keeping it clean for now.
          return (
            <div
              key={question.id}
              className="bg-white/50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-teal-200 dark:hover:border-teal-800 transition-colors"
            >
              <h3 className="text-md font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500">
                  {question.category}
                </span>
                {question.title}
                {question.multiple && (
                  <span className="text-xs text-teal-600 dark:text-teal-400 ml-auto border border-teal-200 dark:border-teal-800 px-2 py-0.5 rounded">
                    複数選択可
                  </span>
                )}
              </h3>

              <div
                className={`flex gap-3 ${question.id === "opinion_diversity" ? "flex-col" : "flex-wrap"
                  }`}
              >
                {question.options.map((option) => {
                  const val = selectedValues[question.id];
                  const isSelected = question.multiple
                    ? Array.isArray(val) && val.includes(option.value)
                    : val === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleChange(question.id, option.value)}
                      className={`
                        px-4 py-2 rounded-lg text-sm transition-all border text-left
                        ${isSelected
                          ? "bg-teal-500 text-white border-teal-500 shadow-md shadow-teal-500/20"
                          : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-700 hover:bg-teal-50 dark:hover:bg-teal-900/30"
                        }
                      `}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
