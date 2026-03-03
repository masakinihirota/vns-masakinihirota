/**
 * Toast コンポーネント
 *
 * @description
 * 個々の Toast メッセージを表示するコンポーネント
 *
 * @design
 * - アニメーション: Slide in/out
 * - アイコン: type に応じたアイコン表示
 * - 自動削除: duration 後に自動消滅
 */

"use client";

import { useEffect, useState } from "react";
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { ToastMessage, ToastType } from "@/lib/toast-store";

interface ToastProps {
    toast: ToastMessage;
    onRemove: (id: string) => void;
}

/**
 * Toast タイプごとのスタイル定義
 */
const TOAST_STYLES: Record<
    ToastType,
    { bgColor: string; borderColor: string; textColor: string; icon: React.ReactNode; buttonColor: string }
> = {
    success: {
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        textColor: "text-green-800",
        icon: <CheckCircle className="h-5 w-5 text-green-600" />,
        buttonColor: "bg-green-600 hover:bg-green-700 text-white",
    },
    error: {
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        textColor: "text-red-800",
        icon: <AlertCircle className="h-5 w-5 text-red-600" />,
        buttonColor: "bg-red-600 hover:bg-red-700 text-white",
    },
    warning: {
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        textColor: "text-yellow-800",
        icon: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
        buttonColor: "bg-yellow-600 hover:bg-yellow-700 text-white",
    },
    info: {
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-800",
        icon: <Info className="h-5 w-5 text-blue-600" />,
        buttonColor: "bg-blue-600 hover:bg-blue-700 text-white",
    },
};

export function Toast({ toast, onRemove }: ToastProps) {
    const [isVisible, setIsVisible] = useState(true);
    const style = TOAST_STYLES[toast.type];

    useEffect(() => {
        // 永続トーストまたはduration=0の場合は自動削除しない
        if (toast.persistent || !toast.duration || toast.duration <= 0) return;

        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => onRemove(toast.id), 300); // アニメーション後に削除
        }, toast.duration - 300);

        return () => clearTimeout(timer);
    }, [toast.duration, toast.persistent, toast.id, onRemove]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onRemove(toast.id), 300); // アニメーション時間
    };

    const handleAction = () => {
        if (toast.action?.onClick) {
            toast.action.onClick();
            // アクション実行後は自動で閉じる
            handleClose();
        }
    };

    if (!isVisible) return null;

    return (
        <div
            className={`
        animate-slide-in-right
        flex min-w-[320px] max-w-md flex-col gap-2 rounded-lg border px-4 py-3 shadow-lg
        transition-all duration-300
        ${style.bgColor} ${style.borderColor} ${style.textColor}
      `}
            role="alert"
            aria-label={toast.message}
            aria-live={toast.type === "error" ? "assertive" : "polite"}
        >
            {/* メインコンテンツ */}
            <div className="flex items-start gap-3">
                <div className="shrink-0">{style.icon}</div>
                <p className="flex-1 text-sm font-medium leading-snug">{toast.message}</p>
                <button
                    onClick={handleClose}
                    className="shrink-0 opacity-60 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-1"
                    aria-label="閉じる"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            {/* アクションボタン */}
            {toast.action && (
                <div className="ml-8 flex justify-end">
                    <button
                        onClick={handleAction}
                        className={`rounded px-3 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${style.buttonColor}`}
                    >
                        {toast.action.label}
                    </button>
                </div>
            )}
        </div>
    );
}
