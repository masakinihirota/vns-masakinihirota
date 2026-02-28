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
const TOAST_STYLES: Record<ToastType, { bgColor: string; borderColor: string; textColor: string; icon: React.ReactNode }> = {
    success: {
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        textColor: "text-green-800",
        icon: <CheckCircle className="h-5 w-5 text-green-600" />,
    },
    error: {
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        textColor: "text-red-800",
        icon: <AlertCircle className="h-5 w-5 text-red-600" />,
    },
    warning: {
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        textColor: "text-yellow-800",
        icon: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
    },
    info: {
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-800",
        icon: <Info className="h-5 w-5 text-blue-600" />,
    },
};

export function Toast({ toast, onRemove }: ToastProps) {
    const [isVisible, setIsVisible] = useState(true);
    const style = TOAST_STYLES[toast.type];

    useEffect(() => {
        if (!toast.duration || toast.duration <= 0) return;

        const timer = setTimeout(() => {
            setIsVisible(false);
        }, toast.duration);

        return () => clearTimeout(timer);
    }, [toast.duration]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onRemove(toast.id), 300); // アニメーション時間
    };

    if (!isVisible) return null;

    return (
        <div
            className={`
        animate-slide-in-right
        flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium
        transition-all duration-300
        ${style.bgColor} ${style.borderColor} ${style.textColor}
      `}
            role="alert"
            aria-label={toast.message}
        >
            <div className="flex-shrink-0">{style.icon}</div>
            <p className="flex-1">{toast.message}</p>
            <button
                onClick={handleClose}
                className="flex-shrink-0 opacity-60 transition-opacity hover:opacity-100"
                aria-label="閉じる"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}
