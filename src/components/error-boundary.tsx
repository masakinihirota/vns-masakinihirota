/**
 * Error Boundary コンポーネント
 *
 * @description
 * Next.js 13+ の app router で投げられたエラーをキャッチして、
 * ユーザーフレンドリーなエラーページを表示
 *
 * @usage
 * // error.tsx
 * import { ErrorBoundary } from "@/components/error-boundary";
 *
 * export default function RootError({
 *   error,
 *   reset,
 * }: {
 *   error: Error;
 *   reset: () => void;
 * }) {
 *   return <ErrorBoundary error={error} reset={reset} />;
 * }
 */

"use client";

import { logger } from "@/lib/logger";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // エラーログを構造化ロガーで記録
    logger.error("Error boundary caught an error", error, {
      digest: error.digest,
      errorName: error.name,
    });
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md rounded-lg border border-red-200 bg-white p-8 shadow-lg">
        {/* エラーアイコン */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
        </div>

        {/* エラータイトル */}
        <h1 className="mb-2 text-center text-2xl font-semibold text-slate-900">
          エラーが発生しました
        </h1>

        {/* エラーメッセージ */}
        <p className="mb-6 text-center text-slate-600">
          申し訳ございません。予期しないエラーが発生しました。
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
                  <pre className="mt-1 max-h-60 overflow-auto whitespace-pre-wrap break-words rounded bg-red-100 p-2 text-red-900">
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
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
    </div>
  );
}
