/**
 * Toast コンテナ
 *
 * @description
 * ページ上部に複数の Toast メッセージを表示するコンテナ
 * レイアウトに1回だけ配置する
 *
 * @usage
 * // layout.tsx
 * <html>
 *   <body>
 *     <ToastContainer />
 *     {children}
 *   </body>
 * </html>
 */

"use client";

import { useEffect, useState } from "react";
import { Toast } from "@/components/ui/toast";
import { globalToastStore, ToastMessage } from "@/lib/toast-store";

export function ToastContainer() {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    useEffect(() => {
        // リスナーを登録
        const unsubscribe = globalToastStore.subscribe((messages) => {
            setToasts(messages);
        });

        return unsubscribe;
    }, []);

    const handleRemove = (id: string) => {
        globalToastStore.remove(id);
    };

    return (
        <div
            className="pointer-events-none fixed right-0 top-0 z-50 flex flex-col gap-2 p-4"
            role="region"
            aria-label="通知"
            aria-live="polite"
        >
            {toasts.map((toast) => (
                <div key={toast.id} className="pointer-events-auto">
                    <Toast toast={toast} onRemove={handleRemove} />
                </div>
            ))}
        </div>
    );
}
