import {
  Sparkles,
  Info,
  AlertCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { BASIC_VALUE_QUESTIONS } from "./basic-values-data";
import { WizardFormData } from "./types";

interface Step4ValuesProps {
  formData: WizardFormData;
  setFormData: React.Dispatch<React.SetStateAction<WizardFormData>>;
}

export const Step4Values: React.FC<Step4ValuesProps> = ({
  formData,
  setFormData,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const currentQ = BASIC_VALUE_QUESTIONS[currentIdx];
  const totalSteps = BASIC_VALUE_QUESTIONS.length;
  const progress = ((currentIdx + 1) / totalSteps) * 100;

  const updateBasicValue = (questionId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      basicValues: {
        ...prev.basicValues,
        [questionId]: value,
      },
    }));
  };

  const nextQuestion = () => {
    if (currentIdx < totalSteps - 1) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const getTierColor = (tier?: number) => {
    switch (tier) {
      case 1:
        return "bg-red-100 text-red-700 border-red-200";
      case 2:
        return "bg-orange-100 text-orange-700 border-orange-200";
      case 3:
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const isCurrentAnswered = !!formData.basicValues[currentQ.id];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      {/* 導入メッセージ */}
      <div className="bg-teal-50 border border-teal-100 rounded-xl p-6">
        <h3 className="text-teal-900 font-bold flex items-center gap-2 mb-2">
          <Info className="w-5 h-5 text-teal-600" />
          価値観の登録: 基礎
        </h3>
        <p className="text-teal-800 text-sm leading-relaxed">
          あなたの思考回路の「土台」を確認する、VNSの根幹となる質問です。
          <br />
          これらの回答内容はシステム内で安全に管理され、マッチングの最も重要な指標となります。
        </p>
      </div>

      <section className="space-y-6">
        {/* 進捗バー */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-600" />
              価値観のお題（基礎）
            </h2>
            <span className="text-sm font-medium text-slate-500">
              質問 {currentIdx + 1} / {totalSteps}
            </span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-500 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 質問カード */}
        <div className="relative min-h-[400px]">
          <div
            key={currentQ.id}
            className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300"
          >
            {/* カテゴリー表示 */}
            <div className="flex items-center justify-between mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {currentQ.category}
              </div>
              {currentQ.id === "oasis" && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600 text-white rounded-full text-[11px] font-black uppercase tracking-widest animate-pulse shadow-lg shadow-red-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  最上位の誓い
                </div>
              )}
            </div>

            <div className="flex items-start justify-between mb-8">
              <div className="space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-2xl font-bold text-slate-900 leading-tight">
                    {currentQ.title}
                  </h3>
                  {currentQ.externalLink && (
                    <Link
                      href={currentQ.externalLink}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-teal-600 bg-teal-50 hover:bg-teal-100 rounded-full transition-all group"
                    >
                      詳しく読む
                      <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  )}
                  {currentQ.tier && currentQ.id !== "oasis" && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getTierColor(currentQ.tier)}`}
                    >
                      Tier {currentQ.tier}
                    </span>
                  )}
                </div>
                {currentQ.description && (
                  <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
                    {currentQ.description}
                  </p>
                )}
              </div>
            </div>

            {/* 選択肢 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {currentQ.options.map((opt) => {
                const isSelected = formData.basicValues[currentQ.id] === opt;
                const isPositiveOasis =
                  currentQ.id === "oasis" && opt === "守る";
                const isRejectOption =
                  opt === "同意できない（利用しない）" ||
                  opt === "守らない" ||
                  (currentQ.id === "oasis" &&
                    (opt === "知らない" || opt === "わからない"));

                return (
                  <button
                    key={opt}
                    onClick={() => updateBasicValue(currentQ.id, opt)}
                    className={`
                      relative px-6 py-4 rounded-2xl text-left text-sm font-bold border transition-all flex items-center justify-between
                      ${
                        isSelected
                          ? isPositiveOasis
                            ? "bg-teal-600 text-white border-teal-600 ring-4 ring-teal-500/20 shadow-xl"
                            : isRejectOption
                              ? "bg-red-600 text-white border-red-600 ring-4 ring-red-500/20 shadow-xl"
                              : "bg-teal-50 text-teal-700 border-teal-500 ring-2 ring-teal-500/20"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:border-teal-300 hover:bg-white"
                      }
                    `}
                  >
                    {opt}
                    {isSelected && (
                      <CheckCircle2
                        className={`w-5 h-5 ${isRejectOption || (currentQ.id === "oasis" && !isPositiveOasis) ? "text-white" : "text-teal-500"}`}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* バリデーション / 警告 */}
            {!currentQ.optional && !isCurrentAnswered && (
              <div className="mb-8 p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-center gap-3 text-orange-700 font-bold animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 animate-bounce" />
                <p className="text-sm">
                  コミュニティの安全を守るため、この項目への回答は必須です。
                </p>
              </div>
            )}

            {currentQ.id === "oasis" &&
              isCurrentAnswered &&
              formData.basicValues[currentQ.id] !== "守る" && (
                <div className="mb-8 p-6 bg-red-50 border-2 border-red-200 rounded-[2rem] flex items-start gap-4 animate-in zoom-in duration-500 shadow-lg shadow-red-500/5">
                  <div className="bg-red-100 p-3 rounded-2xl text-red-600">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                  <div className="space-y-3">
                    <p className="text-lg font-black text-red-700 tracking-tight">
                      【重要】一部の機能が永久に制限されます
                    </p>
                    <p className="text-sm text-red-600 leading-relaxed font-bold">
                      オアシス宣言を遵守いただけない場合、あなたの活動はサイト内を
                      <span className="underline decoration-2 underline-offset-4 decoration-red-400 mx-1">
                        見て回る（観測・ウォッチ）のみ
                      </span>
                      に制限されます。
                    </p>
                    <p className="text-[11px] text-red-500 leading-relaxed bg-white/50 p-3 rounded-xl">
                      ※
                      コミュニティへの書き込み、マーケットへの出品、アライアンスの形成、メッセージ送信などの相互作用を伴う機能は一切利用できません。
                    </p>
                    <Link
                      href="/help/oasis-declaration"
                      className="inline-flex items-center gap-2 text-xs font-black text-red-700 hover:underline pt-2"
                    >
                      なぜ制限されるのかを詳しく知る
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}

            {/* ナビゲーション */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <button
                onClick={prevQuestion}
                disabled={currentIdx === 0}
                className="flex items-center gap-2 px-4 py-2 text-slate-500 font-bold hover:text-teal-600 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                前へ
              </button>
              <button
                onClick={nextQuestion}
                disabled={
                  currentIdx === totalSteps - 1 ||
                  (!currentQ.optional && !isCurrentAnswered)
                }
                className={`
                  flex items-center gap-2 px-8 py-3 rounded-2xl font-black transition-all group
                  ${
                    currentIdx === totalSteps - 1 ||
                    (!currentQ.optional && !isCurrentAnswered)
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : currentQ.id === "oasis"
                        ? "bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-500/20 active:scale-95 translate-y-[-2px]"
                        : "bg-teal-600 text-white hover:bg-teal-700 shadow-lg shadow-teal-500/20 active:scale-95"
                  }
                `}
              >
                {currentQ.id === "oasis" ? "誓いを立てて次へ" : "次へ"}
                <ChevronRight
                  className={`w-5 h-5 ${currentIdx === totalSteps - 1 || (!currentQ.optional && !isCurrentAnswered) ? "" : "group-hover:translate-x-1 transition-transform"}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 自由記述は最後に表示 */}
        {currentIdx === totalSteps - 1 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <label className="block text-lg font-bold text-slate-800 mb-2">
              自由記述（補足など）
            </label>
            <p className="text-sm text-slate-500 mb-4">
              上記の質問への補足や、その他大切にしていることがあれば自由に記述してください（任意）。
            </p>
            <textarea
              rows={6}
              className="w-full p-6 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none resize-none leading-relaxed text-base transition-all bg-slate-50/50"
              placeholder="あなたの思いを綴ってください..."
              value={formData.valuesAnswer}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  valuesAnswer: e.target.value,
                }))
              }
            />
          </div>
        )}
      </section>
    </div>
  );
};
