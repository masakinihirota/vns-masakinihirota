"use client";

import { useEffect } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

/**
 * ログアウト画面コンポーネント
 *
 * セッション削除完了を表示し、手動でログインページまたはトップページへ移動
 */
export default function LogoutPage() {
    const { data: session, isPending } = useSession();

    // セッション状態をチェック（まだセッションが残っている場合は警告）
    const hasSession = !isPending && !!session?.user;

    useEffect(() => {
        if (hasSession) {
            console.warn("[Logout] Session still exists after logout");
        }
    }, [hasSession]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 px-4">
            <div className="w-full max-w-md">
                {/* ロゴ */}
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                        <svg
                            className="w-8 h-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                        </svg>
                    </div>
                </div>

                {/* チェックマーク または 警告アイコン */}
                <div className="flex justify-center mb-6">
                    <div className="animate-in fade-in duration-500">
                        {hasSession ? (
                            <AlertCircle
                                size={64}
                                className="text-orange-500 dark:text-orange-400"
                                strokeWidth={1.5}
                            />
                        ) : (
                            <CheckCircle2
                                size={64}
                                className="text-emerald-500 dark:text-emerald-400"
                                strokeWidth={1.5}
                            />
                        )}
                    </div>
                </div>

                {/* メッセージ */}
                <div className="text-center mb-8 space-y-4">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                        {hasSession ? "⚠️ ログアウト処理中" : "✓ ログアウトしました"}
                    </h1>

                    <div className="space-y-2 text-slate-600 dark:text-slate-400">
                        {hasSession ? (
                            <>
                                <p className="text-base">
                                    セッションがまだ残っています。
                                </p>
                                <p className="text-base">
                                    ブラウザをリロードするか、再度ログアウトしてください。
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-base">
                                    セッションが削除されました。
                                </p>
                                <p className="text-base">
                                    ブラウザストレージも保持されています。
                                </p>
                            </>
                        )}
                    </div>
                </div>

                {/* ボタン */}
                <div className="space-y-3">
                    {/* セッションが残っている場合: リロードボタン */}
                    {hasSession && (
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full block py-3 px-4 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-semibold rounded-lg transition-colors duration-200 text-center shadow-sm hover:shadow-md"
                        >
                            ページをリロード
                            <br />
                            <span className="text-sm font-normal">セッションを確認</span>
                        </button>
                    )}

                    {/* プライマリボタン: ログインページへ */}
                    <Link
                        href="/login"
                        className="w-full block py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-lg transition-colors duration-200 text-center shadow-sm hover:shadow-md"
                    >
                        ログインページへ
                        <br />
                        <span className="text-sm font-normal">
                            手動で移動
                        </span>
                    </Link>

                    {/* セカンダリボタン */}
                    <Link
                        href="/"
                        className="w-full block py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold rounded-lg transition-colors duration-200 text-center border border-slate-200 dark:border-slate-700 shadow-sm"
                    >
                        トップページへ
                        <br />
                        <span className="text-sm font-normal">戻る</span>
                    </Link>
                </div>

                {/* フッター */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-600">
                        ご利用ありがとうございました。
                    </p>
                </div>
            </div>
        </div>
    );
}
