import { Star, Link as LinkIcon } from "lucide-react";
import React from "react";
import { BASIC_VALUE_QUESTIONS } from "./basic-values-data";
import { USER_TYPES, PURPOSES } from "./constants";
import { WizardFormData } from "./types";

interface Step5ConfirmProps {
  formData: WizardFormData;
}

export const Step5Confirm: React.FC<Step5ConfirmProps> = ({ formData }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">
          プロフィールの最終確認
        </h2>
        <p className="text-slate-500 text-sm">
          以下の内容で新しいプロフィールを「受肉」させます。
        </p>
      </div>

      <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden relative">
        <div className="h-40 bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700"></div>

        <div className="px-10 pb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end -mt-16 mb-10 gap-6">
            <div className="flex items-end gap-6">
              <div className="w-32 h-32 bg-white rounded-full border-8 border-white shadow-xl flex items-center justify-center text-5xl font-black text-indigo-700">
                {formData.displayName ? formData.displayName[0] : "G"}
              </div>
              <div className="pb-2">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                  {formData.displayName || "未設定"}
                </h1>
                <p className="text-indigo-600 font-bold uppercase tracking-widest text-sm">
                  {formData.role}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pb-2">
              {formData.purposes.map((pid) => {
                const p = PURPOSES.find((item) => item.id === pid);
                return p ? (
                  <span
                    key={pid}
                    className="px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-wider text-slate-600 border border-slate-200 shadow-sm"
                  >
                    {p.label}
                  </span>
                ) : null;
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* LEFT COLUMN: Values Questionnaire */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <div className="w-1 h-4 bg-teal-500 rounded-full"></div>
                  Basic Values (基礎の基礎)
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  {BASIC_VALUE_QUESTIONS.map((q) => (
                    <div
                      key={q.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group"
                    >
                      <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">
                        {q.title}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-teal-600 bg-teal-50 px-3 py-1 rounded-lg border border-teal-100">
                          {formData.basicValues[q.id] || "未回答"}
                        </span>
                      </div>
                    </div>
                  ))}
                  {formData.valuesAnswer && (
                    <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-100/50 mt-2">
                      <dt className="text-[10px] font-bold text-teal-600 uppercase mb-2">
                        Supplement (補足)
                      </dt>
                      <dd className="text-sm text-slate-700 italic border-l-2 border-teal-200 pl-3">
                        {formData.valuesAnswer}
                      </dd>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Bio & Works */}
            <div className="lg:col-span-5 space-y-8 border-l border-slate-100 pl-0 lg:pl-12">
              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <div className="w-1 h-4 bg-orange-500 rounded-full"></div>
                  Portfolio / Interests
                </h4>

                <div className="space-y-8">
                  <section>
                    <dt className="text-[10px] font-bold text-slate-400 uppercase mb-3">
                      Own Works
                    </dt>
                    {formData.ownWorks.length > 0 ? (
                      <ul className="space-y-4">
                        {formData.ownWorks.map((w) => (
                          <li key={w.id} className="flex flex-col group">
                            <span className="text-sm font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
                              {w.title}
                            </span>
                            {w.url && (
                              <a
                                href={w.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-500 flex items-center gap-1 hover:underline mt-1"
                              >
                                <LinkIcon className="w-3 h-3" />
                                {w.url}
                              </a>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        No works registered
                      </span>
                    )}
                  </section>

                  <section>
                    <dt className="text-[10px] font-bold text-slate-400 uppercase mb-3">
                      Favorite Content
                    </dt>
                    {formData.favWorks.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {formData.favWorks.map((w) => (
                          <span
                            key={w.id}
                            className={`text-[10px] px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-bold transition-all ${w.isBest ? "bg-yellow-50 border-yellow-200 text-yellow-800 shadow-sm shadow-yellow-100 select-none" : "bg-white border-slate-200 text-slate-500"}`}
                          >
                            {w.isBest && (
                              <Star className="w-3 h-3 fill-current text-yellow-500" />
                            )}
                            <span className="opacity-60 font-black text-[8px] uppercase">
                              {w.category}
                            </span>
                            <span>{w.title}</span>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        No favorites selected
                      </span>
                    )}
                  </section>
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 mt-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-black text-indigo-700">
                    Identity Type:
                  </span>
                  <span className="text-xs font-bold text-slate-600">
                    {USER_TYPES.find((t) => t.id === formData.type)?.title}
                  </span>
                </div>
                <p className="text-[10px] text-indigo-400 leading-relaxed italic">
                  このプロフィールは、あなたの最初の「仮面」としてVNSネットワークに刻まれます。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
