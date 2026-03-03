/**
 * useToast Hook
 *
 * @description
 * クライアント側で Toast メッセージを表示するためのカスタムフック
 *
 * @usage
 * "use client";
 * import { useToast } from "@/hooks/use-toast";
 * export function MyComponent() {
 *   const { showToast } = useToast();
 *
 *   const handleSave = async () => {
 *     try {
 *       await saveData();
 *       showToast.success("保存しました");
 *     } catch (error) {
 *       showToast.error("保存に失敗しました");
 *     }
 *   };
 *
 *   return <button onClick={handleSave}>保存</button>;
 * }
 */

"use client";

import { useMemo } from "react";
import { globalToastStore, type ToastAction } from "@/lib/toast-store";

export function useToast() {
  return useMemo(
    () => ({
    showToast: {
      success: (message: string, duration?: number) =>
        globalToastStore.success(message, { duration }),
      error: (
        message: string,
        options?: {
          duration?: number;
          action?: ToastAction;
          persistent?: boolean;
        }
      ) =>
        globalToastStore.error(message, options),
      warning: (message: string, duration?: number) =>
        globalToastStore.warning(message, { duration }),
      info: (message: string, duration?: number) =>
        globalToastStore.info(message, { duration }),
      trialError: (feature?: string, reason?: string, action?: ToastAction) =>
        globalToastStore.trialError(feature, reason, action),
    },
    }),
    []
  );
}
