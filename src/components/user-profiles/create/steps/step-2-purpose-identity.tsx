import {
  Trophy,
  Info,
  Smile,
  Sparkles,
  User,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import React from "react";
import { getZodiacSymbol } from "@/lib/anonymous-name-generator";
import { PURPOSES } from "../user-profile-creation.constants";

interface Step2PurposeIdentityProps {
  formData: {
    purposes: string[];
    zodiac: string;
    displayName: string;
    nameCandidates: string[];
  };
  togglePurpose: (id: string) => void;
  updateForm: (key: string, value: any) => void;
  handleUndoCandidates: () => void;
  historyIndex: number;
  handleGenerateCandidates: (zodiac: string) => void;
}

export const Step2PurposeIdentity = ({
  formData,
  togglePurpose,
  updateForm,
  handleUndoCandidates,
  historyIndex,
  handleGenerateCandidates,
}: Step2PurposeIdentityProps) => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 3. Purpose Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-green-100 p-2 rounded-lg">
            <Trophy className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            3. プロフィールの活動目的
          </h2>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/50 rounded-lg p-4 mb-6 flex items-start gap-3">
          <Info className="w-5 h-5 text-green-700 dark:text-green-400 shrink-0 mt-0.5" />
          <p className="text-sm text-green-800 dark:text-green-200 leading-relaxed">
            <strong>目的を選ぶ理由</strong>
            <br />
            このプロフィールの主な活動目的を選択してください。
            設定した目的に合わせて、同じ志を持つユーザーと優先的にマッチングされます。「仕事」「趣味」など、VNSでは目的ごとにプロフィール（仮面）を使い分けることが可能です。このプロフィールでは誰と何をして過ごしたいか、最適なものを選んでください。
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {PURPOSES.map((p) => {
            const isActive = formData.purposes.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => togglePurpose(p.id)}
                className={`
                  flex items-center gap-2 px-5 py-3 rounded-full font-medium transition-all text-sm
                  ${
                    isActive
                      ? "bg-green-600 text-white shadow-md transform scale-105"
                      : "bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }
                `}
              >
                {p.icon}
                {p.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Display Name Section (Constellation & Candidates) */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Smile className="w-6 h-6 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            4. 匿名表示名 (Identity)
          </h2>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
          {/* Zodiac Selection (Read Only) */}
          <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
              <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                あなたの星座 (Root Account Info)
              </h3>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/50 rounded-xl p-6 flex flex-col items-center justify-center text-center">
              <div className="text-4xl mb-2 text-purple-600 dark:text-purple-400">
                {getZodiacSymbol(formData.zodiac)}
              </div>
              <h4 className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-1">
                {formData.zodiac}
              </h4>
              <p className="text-xs text-purple-500">
                ルートアカウントで設定された星座です
              </p>
            </div>
          </div>

          {/* Candidates Selection */}
          {formData.zodiac && (
            <div className="animate-in fade-in slide-in-from-top-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-500" />
                  候補から選択してください
                </h3>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleUndoCandidates}
                    disabled={historyIndex <= 0}
                    className={`
                      flex items-center gap-1 text-xs font-medium transition-colors px-3 py-2 rounded-md
                      ${
                        historyIndex > 0
                          ? "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200"
                          : "text-slate-300 dark:text-slate-600 cursor-not-allowed"
                      }
                    `}
                    title="前の候補に戻る"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    戻す
                  </button>

                  <button
                    onClick={() => handleGenerateCandidates(formData.zodiac)}
                    className="flex items-center gap-2 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-200 px-5 py-2.5 rounded-full transition-all hover:scale-105 active:scale-95"
                  >
                    <RefreshCw className="w-4 h-4" />
                    更新して別の候補を見る
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 mb-4">
                <div className="flex flex-col gap-3">
                  {formData.nameCandidates.map((candidate) => (
                    <label
                      key={candidate}
                      className={`
                      flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all bg-white dark:bg-slate-800
                      ${
                        formData.displayName === candidate
                          ? "border-purple-500 shadow-md transform scale-[1.01]"
                          : "border-slate-100 dark:border-slate-700 hover:border-purple-200 dark:hover:border-purple-500/50"
                      }
                    `}
                    >
                      <input
                        type="radio"
                        name="displayName"
                        value={candidate}
                        checked={formData.displayName === candidate}
                        onChange={(e) =>
                          updateForm("displayName", e.target.value)
                        }
                        className="w-5 h-5 text-purple-600 border-slate-300 focus:ring-purple-500 mr-4"
                      />
                      <span
                        className={`font-bold text-lg ${
                          formData.displayName === candidate
                            ? "text-purple-700 dark:text-purple-300"
                            : "text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {candidate}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
