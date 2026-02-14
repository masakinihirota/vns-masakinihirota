import { CheckCircle2, Info, Shield, Users } from "lucide-react";
import { useState } from "react";
import { USER_TYPES } from "../user-profile-creation.constants";
import { UserProfile } from "../user-profile-creation.types";

interface Step1RoleTypeProps {
  formData: UserProfile;
  updateForm: <K extends keyof UserProfile>(
    key: K,
    value: UserProfile[K]
  ) => void;
}

export const Step1RoleType = ({ formData, updateForm }: Step1RoleTypeProps) => {
  const [isLeaderConfirmed, setIsLeaderConfirmed] = useState(false);

  return (
    <div className="space-y-12 pb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
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

        <div
          className={`
            transition-all duration-500 ease-in-out border rounded-xl p-6 shadow-sm relative overflow-hidden
            ${isLeaderConfirmed
              ? "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900 shadow-indigo-200 dark:shadow-indigo-900/20"
              : "bg-gradient-to-br from-indigo-50 to-white dark:from-slate-900 dark:to-slate-800 border-indigo-100 dark:border-slate-700"
            }
          `}
        >
          {/* Confetti/Highlight Effect Background */}
          {isLeaderConfirmed && (
            <div className="absolute inset-0 bg-indigo-500/5 pointer-events-none animate-pulse" />
          )}

          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                リーダー (Leader)
              </h3>
            </div>
          </div>

          <div
            className={`
              prose prose-sm prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed bg-white/50 dark:bg-black/20 p-4 rounded-lg border border-indigo-50/50 dark:border-indigo-900/50 transition-all duration-500
              ${isLeaderConfirmed ? "opacity-80" : "opacity-100"}
            `}
          >
            <p className="font-medium text-indigo-900 dark:text-indigo-400 mb-2">
              VNS masakinihirotaでは各ユーザーがリーダー役を担います。
            </p>
            <p>
              VNS
              masakinihirotaにおけるリーダーは、価値観を共有する最小単位である「組織（グループ）」の創設者かつ運営責任者です。
              主な役割は、組織の目的やルールの設定、メンバーの招待、役割の任命です。また、リーダーはコミュニティの文化を守り、価値観の合う居場所を維持する調整役として役割を担ってもらいます。
            </p>
          </div>

          <div
            className={`
              mt-6 flex justify-start transition-all duration-500 transform
              ${isLeaderConfirmed ? "translate-y-0 opacity-100" : "translate-y-0 opacity-100"}
            `}
          >
            <label className="flex items-center gap-3 cursor-pointer group select-none bg-white/50 dark:bg-black/20 p-3 px-5 rounded-lg border border-transparent hover:bg-white/80 dark:hover:bg-slate-800/50 hover:shadow-sm transition-all">
              <div
                className={`
                  w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-300
                  ${isLeaderConfirmed
                    ? "bg-indigo-600 border-indigo-600"
                    : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 group-hover:border-indigo-400"
                  }
                `}
              >
                <CheckCircle2
                  className={`w-4 h-4 text-white transition-all duration-300 ${isLeaderConfirmed
                      ? "scale-100 opacity-100"
                      : "scale-50 opacity-0"
                    }`}
                />
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={isLeaderConfirmed}
                onChange={(e) => setIsLeaderConfirmed(e.target.checked)}
              />
              <span
                className={`
                  text-sm font-bold transition-colors duration-300
                  ${isLeaderConfirmed
                    ? "text-indigo-700 dark:text-indigo-300"
                    : "text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                  }
                `}
              >
                リーダーとして行動する
              </span>
              <span className="ml-2 text-xs font-bold text-red-500 bg-red-100 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded">
                必須
              </span>
            </label>
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
            本来の自分（ルートアカウント）とは別に、対人関係や目的に応じた「仮面」を作成し、使い分けます。プロフィールを使い分けることで目的別のマッチングがしやすくなります。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {USER_TYPES.filter((t) => !t.isSpecial).map((t) => (
            <div
              key={t.id}
              onClick={() => updateForm("type", t.id)}
              className={`
                cursor-pointer p-5 rounded-xl border-2 transition-all duration-200 hover:shadow-md
                ${formData.type === t.id
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-200 dark:ring-blue-800 ring-offset-1 dark:ring-offset-slate-900"
                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-700"
                }
              `}
            >
              <div className="flex items-start justify-between mb-2">
                <div
                  className={`p-2 rounded-lg ${formData.type === t.id
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

        {/* Special Types Section */}
        {USER_TYPES.some((t) => t.isSpecial) && (
          <div className="mt-8">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-slate-200 dark:bg-slate-700"></span>
              Special Profiles
              <span className="flex-1 h-[1px] bg-slate-200 dark:bg-slate-700"></span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {USER_TYPES.filter((t) => t.isSpecial).map((t) => (
                <div
                  key={t.id}
                  onClick={() => updateForm("type", t.id)}
                  className={`
                    cursor-pointer p-5 rounded-xl border-2 transition-all duration-200 hover:shadow-xl relative overflow-hidden group
                    ${formData.type === t.id
                      ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20 ring-2 ring-amber-200 dark:ring-amber-800 ring-offset-1 dark:ring-offset-slate-900"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-amber-300 dark:hover:border-amber-700"
                    }
                  `}
                >
                  {/* Decorative background for special types */}
                  <div className="absolute top-0 right-0 p-16 bg-gradient-to-bl from-amber-100/50 to-transparent dark:from-amber-900/20 rounded-bl-full pointer-events-none transition-opacity opacity-50 group-hover:opacity-100" />

                  <div className="flex items-start justify-between mb-2 relative z-10">
                    <div
                      className={`p-2 rounded-lg ${formData.type === t.id
                          ? "bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-100"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400"
                        }`}
                    >
                      {t.icon}
                    </div>
                    {formData.type === t.id && (
                      <CheckCircle2 className="w-6 h-6 text-amber-500" />
                    )}
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1 relative z-10">
                    {t.title}
                  </h3>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 relative z-10">
                    {t.subtitle}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 leading-normal relative z-10">
                    {t.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
