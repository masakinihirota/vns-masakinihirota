import { Sparkles, Info, AlertCircle, ExternalLink } from "lucide-react";
import React from "react";
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
  const updateBasicValue = (questionId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      basicValues: {
        ...prev.basicValues,
        [questionId]: value,
      },
    }));
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

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-teal-50 border border-teal-100 rounded-xl p-6">
        <h3 className="text-teal-900 font-bold flex items-center gap-2 mb-2">
          <Info className="w-5 h-5 text-teal-600" />
          価値観の登録: 基本中の基本
        </h3>
        <p className="text-teal-800 text-sm leading-relaxed">
          あなたの思考回路の「土台」を確認する、VNSの根幹となる質問です。
          <br />
          これらの回答内容はシステム内で安全に管理され、マッチングの最も重要な指標となります。
        </p>
      </div>

      <section className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="bg-teal-100 p-2 rounded-lg">
            <Sparkles className="w-6 h-6 text-teal-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">
            価値観のお題（基本）
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 max-w-4xl">
          {BASIC_VALUE_QUESTIONS.map((q) => (
            <div
              key={q.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-teal-200 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <h3 className="text-lg font-bold text-slate-800">
                      {q.title}
                    </h3>
                    {q.externalLink && (
                      <a
                        href={q.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-all"
                        title="用語集で詳しく見る"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {q.tier && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getTierColor(q.tier)}`}
                      >
                        Tier {q.tier}
                      </span>
                    )}
                  </div>
                  {q.description && (
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {q.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {q.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => updateBasicValue(q.id, opt)}
                    className={`
                      px-4 py-2 rounded-xl text-sm font-medium border transition-all
                      ${formData.basicValues[q.id] === opt
                        ? "bg-teal-600 text-white border-teal-600 shadow-md transform scale-105"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:border-teal-300 hover:bg-white"
                      }
                    `}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {!formData.basicValues[q.id] && (
                <p className="mt-3 text-[10px] text-orange-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  回答を選択してください（必須）
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 max-w-4xl">
          <label className="block text-sm font-bold text-slate-700 mb-2">
            自由記述（補足など）
          </label>
          <textarea
            rows={4}
            className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none resize-none leading-relaxed text-sm"
            placeholder="上記の質問への補足や、その他大切にしていることがあれば自由に記述してください..."
            value={formData.valuesAnswer}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, valuesAnswer: e.target.value }))
            }
          />
        </div>
      </section>
    </div>
  );
};
