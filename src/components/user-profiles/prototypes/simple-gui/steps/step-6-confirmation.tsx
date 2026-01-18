import { Star } from "lucide-react";
import React from "react";
import { getZodiacSymbol } from "@/lib/anonymous-name-generator";
import { USER_TYPES, PURPOSES, VALUE_QUESTIONS } from "../simple-gui.constants";
import { FavWork } from "../simple-gui.types";

interface Step6ConfirmationProps {
  formData: {
    displayName: string;
    role: string;
    purposes: string[];
    type: string;
    zodiac: string;
    valuesAnswer: string;
    ownWorks: { id: number; title: string; url: string }[];
    favWorks: FavWork[];
  };
  valueSelections: Record<string, string[]>;
  valueTiers: Record<string, number>;
  addedQuestionIds: string[];
  removedQuestionIds: string[];
}

export const Step6Confirmation = ({
  formData,
  valueSelections,
  valueTiers,
  addedQuestionIds,
  removedQuestionIds,
}: Step6ConfirmationProps) => {
  // Replicate Step 5 Logic for Counting
  const registeredValues = VALUE_QUESTIONS.filter((q) => {
    // If manually removed, exclude (even if purpose-related or answered)
    if (removedQuestionIds.includes(q.id)) return false;

    // If manually added, include
    if (addedQuestionIds.includes(q.id)) return true;

    // 1. Explicitly interacted with (Answered or Tiered)
    const hasInteraction =
      (valueSelections[q.id]?.length || 0) > 0 || (valueTiers[q.id] || 0) > 0;
    if (hasInteraction) return true;

    // 2. Related to selected Purpose (Auto-register)
    if (
      q.relatedPurposes &&
      q.relatedPurposes.some((p) => formData.purposes.includes(p))
    ) {
      return true;
    }

    return false;
  });

  const registeredCount = registeredValues.length;

  // Also calculate answered count for detail view if needed (optional, keeping it here just in case)
  const answeredCount = Object.entries(valueSelections || {}).filter(
    ([qId, choices]) =>
      choices && choices.length > 0 && !removedQuestionIds.includes(qId)
  ).length;
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          プロフィールの最終確認
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          以下の内容でプロフィールを作成します。よろしければ作成ボタンを押してください。
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden relative">
        {/* Cover-like Header */}
        <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600"></div>

        <div className="px-8 pb-8">
          <div className="flex justify-between items-end -mt-12 mb-6">
            <div className="flex items-end gap-6">
              <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full border-4 border-white dark:border-slate-700 shadow-lg flex items-center justify-center text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                {getZodiacSymbol(formData.zodiac) ||
                  (formData.displayName ? formData.displayName[0] : "G")}
              </div>
              <div className="pb-1">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                  {formData.displayName || "未設定"}
                </h1>
                <p className="text-indigo-600 dark:text-indigo-400 font-medium">
                  {formData.role}
                </p>
              </div>
            </div>
            <div className="flex gap-2 mb-1">
              {formData.purposes.map((pid) => {
                const p = PURPOSES.find((item) => item.id === pid);
                return p ? (
                  <span
                    key={pid}
                    className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    {p.label}
                  </span>
                ) : null;
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-100 dark:border-slate-800 pt-8">
            <div>
              <h4 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
                Identity
              </h4>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                    プロフィールのタイプ
                  </dt>
                  <dd className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    {USER_TYPES.find((t) => t.id === formData.type)?.title}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                    星座
                  </dt>
                  <dd className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    {formData.zodiac || "未選択"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                    価値観
                  </dt>
                  <dd className="text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg text-sm flex items-center gap-2">
                    <span className="font-bold text-lg text-indigo-600 dark:text-indigo-400">
                      {registeredCount}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      個の価値観を登録済
                    </span>
                    <span className="text-xs text-slate-400 ml-1">
                      (回答: {answeredCount})
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
                Portfolio / Favorites
              </h4>
              <div className="space-y-6">
                <div>
                  <dt className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                    自分の作品
                  </dt>
                  {formData.ownWorks.length > 0 ? (
                    <ul className="space-y-2">
                      {formData.ownWorks.map((w) => (
                        <li key={w.id} className="flex flex-col text-sm">
                          <span className="text-slate-700 dark:text-slate-300">
                            {w.title}
                          </span>
                          {w.url && (
                            <a
                              href={w.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-indigo-500 dark:text-indigo-400 hover:underline"
                            >
                              {w.url}
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-sm text-slate-400">なし</span>
                  )}
                </div>

                <div>
                  <dt className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                    好きな作品
                  </dt>
                  {formData.favWorks.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {formData.favWorks.map((w) => (
                        <span
                          key={w.id}
                          className={`text-sm px-3 py-1 rounded-full border ${
                            w.isBest
                              ? "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200"
                              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                          }`}
                        >
                          {w.isBest && (
                            <Star className="inline w-3 h-3 mr-1 -mt-0.5 fill-current" />
                          )}
                          {w.title}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400">なし</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
