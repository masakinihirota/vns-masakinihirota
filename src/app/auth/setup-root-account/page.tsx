import { ensureRootAccountAndRedirect } from "@/lib/auth/setup-root-account";
import { Suspense } from "react";

/**
 * OAuth コールバック後のセットアップページ
 *
 * @description
 * Better Auth の OAuth フロー完了後にリダイレクトされるページ。
 * rootAccount が存在しない場合は自動作成し、/home へリダイレクト。
 *
 * このページは実装中のアニメーション画面を表示し、
 * バックグラウンドで ensureRootAccountAndRedirect() を実行する。
 */

async function SetupContent() {
  // rootAccount を自動作成し、/home へリダイレクト
  const result = await ensureRootAccountAndRedirect();

  // エラー時の表示
  if (!result.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 to-slate-800">
        <div className="max-w-md w-full mx-auto px-6">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 backdrop-blur">
            <h2 className="text-xl font-semibold text-red-400 mb-2">
              セットアップエラー
            </h2>
            <p className="text-slate-300 text-sm">
              {result.message || "セットアップに失敗しました"}
            </p>
            <a
              href="/home"
              className="mt-4 inline-block text-sm text-blue-400 hover:text-blue-300 underline"
            >
              ホームに戻る
            </a>
          </div>
        </div>
      </div>
    );
  }

  // サーバーアクション内で redirect が実行される（このコードには到達しない）
  return null;
}

export default function SetupRootAccountPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 to-slate-800">
      <div className="max-w-md w-full mx-auto px-6">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-8 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            {/* ローディングアニメーション */}
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-2 border-slate-700/50 border-t-blue-400 animate-spin" />
            </div>

            <h1 className="text-xl font-semibold text-slate-100 text-center">
              アカウントを準備中
            </h1>
            <p className="text-sm text-slate-400 text-center">
              幽霊の仮面プロフィールを作成しています...
            </p>
          </div>
        </div>
      </div>

      {/* バックグラウンドで rootAccount をセットアップ */}
      <Suspense fallback={null}>
        <SetupContent />
      </Suspense>
    </div>
  );
}
