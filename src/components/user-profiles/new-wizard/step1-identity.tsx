import {
  Shield,
  Users,
  Trophy,
  Smile,
  Info,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import React from "react";
import { USER_TYPES, PURPOSES } from "./constants";
import { WizardFormData } from "./types";

interface Step1IdentityProps {
  formData: WizardFormData;
  updateForm: <K extends keyof WizardFormData>(
    key: K,
    value: WizardFormData[K]
  ) => void;
  togglePurpose: (id: string) => void;
  refreshSuggestions: () => void;
}

export const Step1Identity: React.FC<Step1IdentityProps> = ({
  formData,
  updateForm,
  togglePurpose,
  refreshSuggestions,
}) => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. Role Section */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <Shield className="w-6 h-6 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">1. 役割 (Role)</h2>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              役割:固定
            </span>
            <h3 className="text-lg font-bold text-slate-800">
              リーダー (Leader)
            </h3>
          </div>

          <div className="prose prose-sm prose-slate max-w-none text-slate-600 leading-relaxed bg-white/50 p-4 rounded-lg border border-indigo-50/50">
            <p className="font-medium text-indigo-900 mb-2">
              なぜVNS masakinihirotaに「リーダー」が必要なのか？
            </p>
            <p>
              VNS
              masakinihirotaは徹底したユーザー主導のプラットフォームであり、運営はあくまでサポートに徹します。そのため、コミュニティの意思決定を行う「責任者」をユーザーの中から定める必要があります。
              <br />
              リーダーは「組織」および「国」の運営責任者として、「オアシス宣言」に基づく秩序維持を行います。調停者（Mediator）では解決できない問題に対する最終決定権や、ペナルティの執行権限を持つ重要な役割です。
            </p>
          </div>
        </div>
      </section>

      {/* 2. Type Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">
            2. タイプ (Type)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {USER_TYPES.map((t) => (
            <div
              key={t.id}
              onClick={() => updateForm("type", t.id)}
              className={`
                cursor-pointer p-5 rounded-xl border-2 transition-all duration-200 hover:shadow-md
                ${
                  formData.type === t.id
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200 ring-offset-1"
                    : "border-slate-200 bg-white hover:border-blue-300"
                }
              `}
            >
              <div className="flex items-start justify-between mb-2">
                <div
                  className={`p-2 rounded-lg ${formData.type === t.id ? "bg-blue-200 text-blue-700" : "bg-slate-100 text-slate-500"}`}
                >
                  {t.icon}
                </div>
                {formData.type === t.id && (
                  <CheckCircle2 className="w-6 h-6 text-blue-500" />
                )}
              </div>
              <h3 className="font-bold text-slate-800 mb-1">{t.title}</h3>
              <p className="text-sm font-medium text-slate-600 mb-2">
                {t.subtitle}
              </p>
              <p className="text-xs text-slate-500 leading-normal">
                {t.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Purpose Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-green-100 p-2 rounded-lg">
            <Trophy className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">
            3. 目的 (Purpose)
          </h2>
        </div>

        <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-6 flex items-start gap-3">
          <Info className="w-5 h-5 text-green-700 shrink-0 mt-0.5" />
          <p className="text-sm text-green-800 leading-relaxed">
            <strong>なぜ目的を選ぶのですか？</strong>
            <br />
            このプロフィールをどのような目的で主に使用するか選択してください
            ここで選択した「目的」に応じて、システム内でのマッチング精度が向上し、あなたにおすすめされる機能やコンテンツが最適化されます。
            <br />
            （※複数選択可能）。
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {PURPOSES.map((p) => (
            <button
              key={p.id}
              onClick={() => togglePurpose(p.id)}
              className={`
                flex items-center gap-2 px-5 py-3 rounded-full font-medium transition-all text-sm
                ${
                  formData.purposes.includes(p.id)
                    ? "bg-green-600 text-white shadow-md transform scale-105"
                    : "bg-white border border-slate-300 text-slate-600 hover:bg-slate-50"
                }
              `}
            >
              {p.icon}
              {p.label}
            </button>
          ))}
        </div>
      </section>

      {/* 4. Display Name Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Smile className="w-6 h-6 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">
            4. 匿名表示名 (Identity)
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-2xl">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <h3 className="font-bold text-slate-700">
                  星座匿名ネームの選択
                </h3>
              </div>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                あなたの星座に基づいた匿名の名前候補です。3つの中から選ぶか、更新ボタンで新しい候補を表示できます。
              </p>

              <div className="grid grid-cols-1 gap-3 mb-6">
                {formData.nameSuggestions.map((name, i) => (
                  <button
                    key={`${name}-${i}`}
                    onClick={() => updateForm("displayName", name)}
                    className={`
                                            flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left
                                            ${
                                              formData.displayName === name
                                                ? "border-purple-500 bg-purple-50 text-purple-900 ring-2 ring-purple-100"
                                                : "border-slate-100 bg-slate-50 text-slate-600 hover:border-purple-200 hover:bg-white"
                                            }
                                        `}
                  >
                    <span className="font-bold">{name}</span>
                    {formData.displayName === name && (
                      <CheckCircle2 className="w-5 h-5 text-purple-500" />
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={refreshSuggestions}
                className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-bold text-sm bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-lg transition-colors w-full justify-center md:w-auto"
              >
                <Sparkles className="w-4 h-4" />
                他の候補を表示する
              </button>
            </div>

            <div className="md:w-64 bg-slate-50 rounded-xl p-5 border border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                現在の選択
              </h4>
              <div className="text-lg font-bold text-slate-800 break-words leading-tight bg-white p-3 rounded-lg border border-slate-200 shadow-sm min-h-[60px] flex items-center">
                {formData.displayName || "未選択"}
              </div>
              <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                <Shield className="w-3 h-3" />
                価値観オアシスの匿名IDとして使用されます
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
