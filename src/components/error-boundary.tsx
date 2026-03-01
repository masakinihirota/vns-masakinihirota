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

import { globalToastStore } from "@/lib/toast-store";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // エラーログ出力（本番環境では外部サービスに送信）
    console.error("[Error Boundary]", {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      timestamp: new Date().toISOString(),
    });

    // 開発環境: コンソール出力
    if (process.env.NODE_ENV === "development") {
      globalToastStore.error("エラーが発生しました。詳細はコンソールを確認してください");
    }
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
          <details className="mb-6 rounded bg-slate-100 p-4">
            <summary className="cursor-pointer font-mono text-sm font-medium text-slate-700">
              詳細情報
            </summary>
            <div className="mt-3 font-mono text-xs text-slate-600">
              <p className="mb-2">
                <strong>メッセージ:</strong> {error.message}
              </p>
              {error.digest && (
                <p className="mb-2">
                  <strong>ID:</strong> {error.digest}
                </p>
              )}
              {error.stack && (
                <pre className="max-h-60 overflow-auto whitespace-pre-wrap break-words text-red-600">
                  {error.stack}
                </pre>
              )}
            </div>
          </details>
        )}

        {/* アクションボタン */}
        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
          >
            <RefreshCw className="h-4 w-4" />
            もう一度試す
          </button>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            <Home className="h-4 w-4" />
            ホームに戻る
          </Link>
        </div>

        {/* サポート情報 */}
        <p className="mt-8 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
          問題が解決しない場合は、
          <a
            href="mailto:support@example.com"
            className="ml-1 font-medium text-blue-600 hover:underline"
          >
            サポートにお問い合わせ
          </a>
          ください。
        </p>
      </div>
    </div>
  );
}
