/**
 * エラー境界：管理画面専用
 *
 * @description
 * /admin ルート配下で発生したエラーをキャッチして表示
 * 管理画面固有のエラーハンドリング
 *
 * @security
 * - platform_admin ロールのみアクセス可能
 * - 管理機能＆ユーザーデータ編集時のエラー
 * - センシティブな情報はログのみに記録（UI には表示しない）
 */

"use client";

import { ErrorBoundary } from "@/components/error-boundary";

export default function AdminError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return <ErrorBoundary error={error} reset={reset} />;
}
