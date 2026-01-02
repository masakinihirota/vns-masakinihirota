import { Globe, Bot, User } from "lucide-react";
import React from "react";
import { LANGUAGE_OPTIONS } from "../../onboarding/onboarding.logic";

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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 ml-1">
            {LANGUAGE_OPTIONS.map((lang) => (
              <label
                key={`native-${lang}`}
                className={`
                                flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md
                                ${
                                  (nativeLanguages || []).includes(lang)
                                    ? "border-indigo-500 bg-white dark:bg-indigo-900/30 ring-2 ring-indigo-500 shadow-sm"
                                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300"
                                }
                            `}
              >
                <input
                  type="checkbox"
                  value={lang}
                  checked={(nativeLanguages || []).includes(lang)}
                  onChange={() => handleNativeToggle(lang)}
                  className="h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                />
                <span
                  className={`text-sm font-medium ${(nativeLanguages || []).includes(lang) ? "text-indigo-700 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300"}`}
                >
                  {lang}
                </span>
              </label>
            ))}
          </div>
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 ml-1">
            {LANGUAGE_OPTIONS.map((lang) => (
              <label
                key={`avail-${lang}`}
                className={`
                            flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md
                            ${
                              (availableLanguages || []).includes(lang)
                                ? "border-emerald-500 bg-white dark:bg-emerald-900/30 ring-2 ring-emerald-500 shadow-sm"
                                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-emerald-300"
                            }
                        `}
              >
                <input
                  type="checkbox"
                  value={lang}
                  checked={(availableLanguages || []).includes(lang)}
                  onChange={() => handleAvailableToggle(lang)}
                  className="h-5 w-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                />
                <span
                  className={`text-sm font-medium ${(availableLanguages || []).includes(lang) ? "text-emerald-700 dark:text-emerald-300" : "text-slate-700 dark:text-slate-300"}`}
                >
                  {lang}
                </span>
              </label>
            ))}
          </div>
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
