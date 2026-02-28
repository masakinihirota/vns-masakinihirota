/**
 * useToast Hook
 *
 * @description
 * クライアント側で Toast メッセージを表示するためのカスタムフック
 *
 * @usage
 * "use client";
 * import { useToast } from "@/hooks/use-toast";
 *
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

import { globalToastStore } from "@/lib/toast-store";

export function useToast() {
  return {
    showToast: {
      success: (message: string, duration?: number) =>
        globalToastStore.success(message, duration),
      error: (message: string, duration?: number) =>
        globalToastStore.error(message, duration),
      warning: (message: string, duration?: number) =>
        globalToastStore.warning(message, duration),
      info: (message: string, duration?: number) =>
        globalToastStore.info(message, duration),
    },
  };
}
