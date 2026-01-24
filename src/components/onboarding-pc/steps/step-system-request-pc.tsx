import { ExternalLink } from "lucide-react";
import Link from "next/link";
import React from "react";

interface StepSystemRequestPCProps {
  data: any;
  onUpdate: (data: any) => void;
}

export const StepSystemRequestPC: React.FC<StepSystemRequestPCProps> = ({
  data,
  onUpdate,
}) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="text-2xl">⚙️</span>
          システム項目
        </h2>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          VNSの革新的なシステムについて理解し、参加を確認してください。
          <br />
          これらは、持続可能で公平なプラットフォームを実現するための仕組みです。
        </p>
      </div>

      <div className="space-y-4">
        {/* Open Data System */}
        <label className="group flex items-start gap-4 p-5 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-700 cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 transition-all shadow-sm hover:shadow-md has-[:checked]:border-indigo-500 dark:has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50 dark:has-[:checked]:bg-indigo-900/20">
          <div className="relative flex items-center mt-1">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={data.agreed_system_open_data}
              onChange={(e) =>
                onUpdate({ agreed_system_open_data: e.target.checked })
              }
            />
            <div className="w-6 h-6 border-2 border-slate-400 dark:border-slate-400 rounded bg-white dark:bg-slate-700 peer-checked:bg-indigo-600 dark:peer-checked:bg-indigo-500 peer-checked:border-indigo-600 dark:peer-checked:border-indigo-500 transition-colors flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                オープンデータ制度
                <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  同意
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              ユーザーが入力されたデータをマッチングやAIなどにVNS
              masakinihirotaで利用します。※特定の情報を除く
            </p>
          </div>
        </label>

        {/* Mediator System */}
        <label className="group flex items-start gap-4 p-5 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-700 cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 transition-all shadow-sm hover:shadow-md has-[:checked]:border-indigo-500 dark:has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50 dark:has-[:checked]:bg-indigo-900/20">
          <div className="relative flex items-center mt-1">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={data.agreed_system_mediator}
              onChange={(e) =>
                onUpdate({ agreed_system_mediator: e.target.checked })
              }
            />
            <div className="w-6 h-6 border-2 border-slate-400 dark:border-slate-400 rounded bg-white dark:bg-slate-700 peer-checked:bg-indigo-600 dark:peer-checked:bg-indigo-500 peer-checked:border-indigo-600 dark:peer-checked:border-indigo-500 transition-colors flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                メディエーター(Mediator:中立な立場の仲裁者)制度
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              ユーザーによる自治を行います。コミュニティの秩序を維持するための監視、不適切な投稿の削除、警告や利用制限などの管理活動を行います。
            </p>
          </div>
        </label>

        {/* User-Driven Ad Selection */}
        <label className="group flex items-start gap-4 p-5 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-700 cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 transition-all shadow-sm hover:shadow-md has-[:checked]:border-indigo-500 dark:has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50 dark:has-[:checked]:bg-indigo-900/20">
          <div className="relative flex items-center mt-1">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={data.agreed_system_ad}
              onChange={(e) => onUpdate({ agreed_system_ad: e.target.checked })}
            />
            <div className="w-6 h-6 border-2 border-slate-400 dark:border-slate-400 rounded bg-white dark:bg-slate-700 peer-checked:bg-indigo-600 dark:peer-checked:bg-indigo-500 peer-checked:border-indigo-600 dark:peer-checked:border-indigo-500 transition-colors flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                ユーザー主導による広告表示選択制度
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              広告表示の仕方をユーザー自身が決めることができます。
              <br />
              ※これは自分自身の広告は対象外です
            </p>
          </div>
        </label>

        {/* Creator First System */}
        <label className="group flex items-start gap-4 p-5 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-700 cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 transition-all shadow-sm hover:shadow-md has-[:checked]:border-indigo-500 dark:has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50 dark:has-[:checked]:bg-indigo-900/20">
          <div className="relative flex items-center mt-1">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={data.agreed_system_creator}
              onChange={(e) =>
                onUpdate({ agreed_system_creator: e.target.checked })
              }
            />
            <div className="w-6 h-6 border-2 border-slate-400 dark:border-slate-400 rounded bg-white dark:bg-slate-700 peer-checked:bg-indigo-600 dark:peer-checked:bg-indigo-500 peer-checked:border-indigo-600 dark:peer-checked:border-indigo-500 transition-colors flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                クリエーターファースト制度
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              作品発表者を優先して扱う制度です。
            </p>
          </div>
        </label>
      </div>
    </div>
  );
};
