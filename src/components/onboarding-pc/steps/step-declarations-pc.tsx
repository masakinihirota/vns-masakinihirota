import { ExternalLink } from "lucide-react";
import Link from "next/link";
import React from "react";

interface StepDeclarationsPCProps {
  data: any;
  onUpdate: (data: any) => void;
}

export const StepDeclarationsPC: React.FC<StepDeclarationsPCProps> = ({
  data,
  onUpdate,
}) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="text-2xl">📜</span>
          3つの誓い
        </h2>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          VNSに参加するにあたり、以下の3つの宣言を尊重してくれますか？
          <br />
          これらは、私たちが互いに安心して共存するための大切な約束です。
        </p>
      </div>

      <div className="space-y-4">
        {/* Oasis Declaration */}
        <label className="group flex items-start gap-4 p-5 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-700 cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 transition-all shadow-sm hover:shadow-md">
          <div className="relative flex items-center mt-1">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={data.agreed_oasis}
              onChange={(e) => onUpdate({ agreed_oasis: e.target.checked })}
            />
            <div className="w-6 h-6 border-2 border-slate-300 dark:border-slate-500 rounded bg-white dark:bg-slate-700 peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-colors flex items-center justify-center">
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
                オアシス宣言を守る
              </div>
              <Link
                href="/help/oasis-declaration"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-indigo-500 transition-colors"
                title="オアシス宣言を詳しく読む"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              ヘイト発言や誹謗中傷を行わず、安心・安全なコミュニティを作ります。
            </p>
          </div>
        </label>

        {/* Human Declaration */}
        <label className="group flex items-start gap-4 p-5 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-700 cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 transition-all shadow-sm hover:shadow-md">
          <div className="relative flex items-center mt-1">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={data.agreed_human}
              onChange={(e) => onUpdate({ agreed_human: e.target.checked })}
            />
            <div className="w-6 h-6 border-2 border-slate-300 dark:border-slate-500 rounded bg-white dark:bg-slate-700 peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-colors flex items-center justify-center">
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
                人間宣言を守る
              </div>
              {/* Human Declaration Link - Placeholder or specific if known */}
              <Link
                href="/help/human-declaration" // Assuming this might exist or will exist
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-indigo-500 transition-colors"
                title="人間宣言を詳しく読む"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              人間は必ず間違えます、完璧さを求めず、間違いを許容し、再挑戦する姿勢を尊重します。
            </p>
          </div>
        </label>

        {/* Honesty Declaration */}
        <label className="group flex items-start gap-4 p-5 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-700 cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 transition-all shadow-sm hover:shadow-md">
          <div className="relative flex items-center mt-1">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={data.agreed_honesty}
              onChange={(e) => onUpdate({ agreed_honesty: e.target.checked })}
            />
            <div className="w-6 h-6 border-2 border-slate-300 dark:border-slate-500 rounded bg-white dark:bg-slate-700 peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-colors flex items-center justify-center">
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
                正直宣言を守る
              </div>
              {/* Honesty Declaration Link - Placeholder */}
              {/* Not linking Honesty declaration for now as no obvious path, or maybe same help? */}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              自分自身を偽らず、誠実な対話を心がけます。
            </p>
          </div>
        </label>
      </div>
    </div>
  );
};
