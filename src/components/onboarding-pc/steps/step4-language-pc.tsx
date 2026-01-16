import { Globe, Bot, User, Check, ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";

const LanguageList = ({
  languages,
  selected,
  onToggle,
  colorClass,
}: {
  languages: readonly string[];
  selected: string[];
  onToggle: (lang: string) => void;
  colorClass: "indigo" | "emerald";
}) => {
  const [showAll, setShowAll] = useState(false);

  // Show language if:
  // 1. It is a major language (index < 5)
  // 2. OR showAll is true
  // 3. OR it is selected
  const displayedLanguages = languages.filter((lang, index) => {
    const isMajor = index < 5;
    const isSelected = selected.includes(lang);
    return isMajor || showAll || isSelected;
  });

  // Calculate if there are any hidden languages remaining to show "Show More"
  // Used to toggle button visibility
  const hasHiddenLanguages = languages.some((lang, index) => {
    const isMajor = index < 5;
    const isSelected = selected.includes(lang);
    return !(isMajor || showAll || isSelected); // If it's NOT (major or showAll or selected), it's hidden.
  });

  // For "Show More" count, we just show total count of "Others" or similar?
  // User asked for "Close" to hide unselected ones.
  // We can stick to simple "Show All" toggle, but the list content is dynamic.

  const getStyles = (isSelected: boolean) => {
    if (colorClass === "indigo") {
      return isSelected
        ? "border-indigo-500 bg-white dark:bg-indigo-900/30 ring-2 ring-indigo-500 shadow-sm"
        : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-indigo-300 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20";
    } else {
      return isSelected
        ? "border-emerald-500 bg-white dark:bg-emerald-900/30 ring-2 ring-emerald-500 shadow-sm"
        : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-emerald-300 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20";
    }
  };

  const getTextColor = (isSelected: boolean) => {
    if (colorClass === "indigo") {
      return isSelected
        ? "text-indigo-700 dark:text-indigo-300"
        : "text-slate-700 dark:text-slate-300";
    } else {
      return isSelected
        ? "text-emerald-700 dark:text-emerald-300"
        : "text-slate-700 dark:text-slate-300";
    }
  };

  const getCheckColor = () => {
    return colorClass === "indigo" ? "text-indigo-600" : "text-emerald-600";
  };

  return (
    <div className="space-y-2 ml-1">
      {displayedLanguages.map((lang) => {
        const isSelected = selected.includes(lang);
        return (
          <div
            key={lang}
            onClick={() => onToggle(lang)}
            className={`
              flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200
              ${getStyles(isSelected)}
            `}
          >
            <div
              className={`
              flex-shrink-0 h-5 w-5 rounded border flex items-center justify-center transition-colors
              ${
                isSelected
                  ? colorClass === "indigo"
                    ? "border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-900/50"
                    : "border-emerald-500 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-900/50"
                  : "border-slate-400 dark:border-slate-400 bg-white dark:bg-slate-700"
              }
            `}
            >
              {isSelected && (
                <Check size={14} className={getCheckColor()} strokeWidth={3} />
              )}
            </div>
            <span className={`text-sm font-medium ${getTextColor(isSelected)}`}>
              {lang}
            </span>
          </div>
        );
      })}

      {!showAll && hasHiddenLanguages && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="w-full flex items-center justify-center gap-2 p-2 mt-2 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          <ChevronDown size={16} />
          もっと見る ({languages.length - displayedLanguages.length})
        </button>
      )}

      {showAll && (
        <button
          type="button"
          onClick={() => setShowAll(false)}
          className="w-full flex items-center justify-center gap-2 p-2 mt-2 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          <ChevronUp size={16} />
          閉じる
        </button>
      )}
    </div>
  );
};
import { LANGUAGE_OPTIONS } from "../onboarding.logic";

interface Step4LanguagePCProps {
  data: any;
  onUpdate: (data: any) => void;
}

export const Step4LanguagePC: React.FC<Step4LanguagePCProps> = ({
  data,
  onUpdate,
}) => {
  const { nativeLanguages, availableLanguages, uses_ai_translation } = data;

  const handleNativeToggle = (lang: string) => {
    const current = nativeLanguages || [];
    const updated = current.includes(lang)
      ? current.filter((l: string) => l !== lang)
      : [...current, lang];
    onUpdate({ nativeLanguages: updated });
  };

  const handleAvailableToggle = (lang: string) => {
    const current = availableLanguages || [];
    const updated = current.includes(lang)
      ? current.filter((l: string) => l !== lang)
      : [...current, lang];
    onUpdate({ availableLanguages: updated });
  };

  const handleAbilityChange = (useAi: boolean) => {
    onUpdate({ uses_ai_translation: useAi });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          言語設定
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          使用する言語と翻訳設定を行います。
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-8">
        {/* 1. Native Language */}
        <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30">
          <div className="mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
              <User
                size={20}
                className="text-indigo-600 dark:text-indigo-400"
              />
              母語 (複数選択可)
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 ml-7">
              あなたの第一言語を選択してください。複数選択可能です。
            </p>
          </div>
          <LanguageList
            languages={LANGUAGE_OPTIONS}
            selected={nativeLanguages || []}
            onToggle={handleNativeToggle}
            colorClass="indigo"
          />
        </div>

        {/* 2. Available Languages */}
        <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30">
          <div className="mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
              <Globe
                size={20}
                className="text-emerald-600 dark:text-emerald-400"
              />
              使用可能言語
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 ml-7">
              コミュニケーション可能なその他の言語を選択してください。
            </p>
          </div>
          <LanguageList
            languages={LANGUAGE_OPTIONS}
            selected={availableLanguages || []}
            onToggle={handleAvailableToggle}
            colorClass="emerald"
          />
        </div>

        {/* 3. Language Ability Type */}
        <div>
          <div className="block text-sm font-medium mb-4 text-slate-700 dark:text-slate-300">
            言語能力タイプ
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <label
              className={`
                        flex-1 p-4 border rounded-xl cursor-pointer transition-all
                        ${
                          uses_ai_translation === true
                            ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 shadow-sm"
                            : "border-slate-200 dark:border-slate-700"
                        }
                    `}
            >
              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  name="language_ability"
                  checked={uses_ai_translation === true}
                  onChange={() => handleAbilityChange(true)}
                  className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <Bot size={18} className="ml-2 text-indigo-500" />
                <span className="ml-2 font-bold text-slate-900 dark:text-white">
                  AI使用の力での言語能力
                </span>
              </div>
              <p className="text-xs text-slate-500 ml-6">
                AI翻訳や支援ツールを活用してコミュニケーションを行います。
              </p>
            </label>

            <label
              className={`
                        flex-1 p-4 border rounded-xl cursor-pointer transition-all
                        ${
                          uses_ai_translation === false
                            ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 shadow-sm"
                            : "border-slate-200 dark:border-slate-700"
                        }
                    `}
            >
              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  name="language_ability"
                  checked={uses_ai_translation === false}
                  onChange={() => handleAbilityChange(false)}
                  className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <User size={18} className="ml-2 text-indigo-500" />
                <span className="ml-2 font-bold text-slate-900 dark:text-white">
                  自分の力での言語能力
                </span>
              </div>
              <p className="text-xs text-slate-500 ml-6">
                自身の言語能力でコミュニケーションを行います。
              </p>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
