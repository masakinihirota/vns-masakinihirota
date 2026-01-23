import { Shield, Users, CheckCircle2, Info } from "lucide-react";
import React from "react";
import { USER_TYPES } from "../user-profile-creation.constants";

interface Step1RoleTypeProps {
  formData: {
    type: string;
    [key: string]: any;
  };
  updateForm: (key: string, value: any) => void;
}

export const Step1RoleType = ({ formData, updateForm }: Step1RoleTypeProps) => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. Role Section */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <Shield className="w-6 h-6 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            1. 役割 (Role)
          </h2>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-slate-900 dark:to-slate-800 border border-indigo-100 dark:border-slate-700 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              Fixed
            </span>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              リーダー (Leader)
            </h3>
          </div>

          <div className="prose prose-sm prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed bg-white/50 dark:bg-black/20 p-4 rounded-lg border border-indigo-50/50 dark:border-indigo-900/50">
            <p className="font-medium text-indigo-900 dark:text-indigo-400 mb-2">
              VNS masakinihirotaでは各ユーザーがリーダー役を担います。
            </p>
            <p>
              VNS
              masakinihirotaにおけるリーダーは、価値観を共有する最小単位である「組織（グループ）」の創設者かつ運営責任者です。
              主な役割は、組織の目的やルールの設定、メンバーの招待、役割の任命です。また、リーダーはコミュニティの文化を守り、価値観の合う居場所を維持する調整役として役割を担ってもらいます。
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
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            2. プロフィールのタイプ (Profile type)
          </h2>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-lg p-4 mb-6 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-700 dark:text-blue-400 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
            <strong>仮面（プロフィール）について</strong>
            <br />
            VNS masakinihirotaでは、プロフィールを「仮面」と定義しています。
            本来の自分（ルートアカウント）とは別に、対人関係や目的に応じた「仮面」を作成し、使い分けます。プロフィールを使い分けることで目的別にマッチングをしやすくします。
          </p>
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
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-200 dark:ring-blue-800 ring-offset-1 dark:ring-offset-slate-900"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-700"
                }
              `}
            >
              <div className="flex items-start justify-between mb-2">
                <div
                  className={`p-2 rounded-lg ${
                    formData.type === t.id
                      ? "bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-200"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {t.icon}
                </div>
                {formData.type === t.id && (
                  <CheckCircle2 className="w-6 h-6 text-blue-500" />
                )}
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">
                {t.title}
              </h3>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                {t.subtitle}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500 leading-normal">
                {t.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
