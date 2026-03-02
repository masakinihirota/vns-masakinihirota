/**
 * Global Error Boundary
 *
 * @description
 * アプリケーション全体のルートレベルエラーをキャッチ
 * - layout.tsx のエラーも捕捉
 * - 本番環境での予期しないエラーに対応
 *
 * @security
 * エラー詳細は開発環境のみ表示し、本番環境では一般的なメッセージのみ
 */

"use client";

import { logger } from "@/lib/logger";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

interface GlobalErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
    useEffect(() => {
        // 致命的エラーとしてログに記録
        logger.fatal("Global error boundary caught an error", error, {
            digest: error.digest,
            errorName: error.name,
        });

        // 開発環境でのみコンソールに詳細を表示
        if (process.env.NODE_ENV === "development") {
            logger.debug("[Global Error Boundary]", {
                message: error.message,
                stack: error.stack,
                digest: error.digest,
            });
        }
    }, [error]);

    return (
        <html lang="ja">
            <body>
                <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-red-50 to-red-100 p-4">
                    <div className="w-full max-w-md rounded-lg border border-red-300 bg-white p-8 shadow-xl">
                        {/* エラーアイコン */}
                        <div className="mb-6 flex justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                                <AlertCircle className="h-8 w-8 text-red-600" />
                            </div>
                        </div>

                        {/* エラータイトル */}
                        <h1 className="mb-3 text-center text-2xl font-bold text-slate-900">
                            システムエラーが発生しました
                        </h1>

                        {/* エラーメッセージ */}
                        <p className="mb-6 text-center text-slate-600">
                            申し訳ございません。予期しない問題が発生しました。
                            <br />
                            この問題は記録され、確認されます。
                        </p>

                        {/* 詳細情報（開発環境のみ） */}
                        {process.env.NODE_ENV === "development" && (
                            <details className="mb-6 rounded bg-red-50 p-4">
                                <summary className="cursor-pointer font-mono text-sm font-medium text-red-800">
                                    開発者向け詳細情報
                                </summary>
                                <div className="mt-3 space-y-2 font-mono text-xs text-red-700">
                                    <div>
                                        <strong>エラー名:</strong> {error.name}
                                    </div>
                                    <div>
                                        <strong>メッセージ:</strong> {error.message}
                                    </div>
                                    {error.digest && (
                                        <div>
                                            <strong>Digest:</strong> {error.digest}
                                        </div>
                                    )}
                                    {error.stack && (
                                        <div className="mt-2">
                                            <strong>スタックトレース:</strong>
                                            <pre className="mt-1 max-h-60 overflow-auto whitespace-pre-wrap wrap-break-word rounded bg-red-100 p-2 text-red-900">
                                                {error.stack}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            </details>
                        )}

                        {/* アクションボタン */}
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={reset}
                                className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                <RefreshCw className="h-4 w-4" />
                                もう一度試す
                            </button>

                            <Link
                                href="/"
                                className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                            >
                                <Home className="h-4 w-4" />
                                ホームに戻る
                            </Link>
                        </div>

                        {/* サポート情報 */}
                        <div className="mt-8 border-t border-slate-200 pt-6">
                            <p className="text-center text-sm text-slate-600">
                                問題が解決しない場合は、お手数ですが
                                <br />
                                サポートまでお問い合わせください
                            </p>
                            {error.digest && (
                                <p className="mt-3 text-center font-mono text-xs text-slate-500">
                                    エラーID: {error.digest}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* フッター */}
                    <p className="mt-8 text-center text-sm text-slate-500">
                        ご不便をおかけして申し訳ございません
                    </p>
                </div>
            </body>
        </html>
    );
}
