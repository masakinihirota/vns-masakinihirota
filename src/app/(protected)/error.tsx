/**
 * エラー境界：保護ルート用
 *
 * @description
 * (protected) ルートグループ内で発生したエラーをキャッチして表示
 * 例: /admin, /home, /user など
 *
 * @security
 * - platform_admin のみがアクセス可能な管理画面で発生したエラー
 * - 認証済みユーザーのみが見るページのエラー
 */

"use client";

import { ErrorBoundary } from "@/components/error-boundary";

export default function ProtectedError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return <ErrorBoundary error={error} reset={reset} />;
}
