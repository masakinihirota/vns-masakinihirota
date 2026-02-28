/**
 * Toast通知システム
 *
 * @description
 * アプリケーション全体でユーザーフィードバックを表示するための
 * シンプルで軽量なToast通知実装
 *
 * @usage
 * // クライアント側
 * import { useToast } from "@/hooks/use-toast";
 * const { showToast } = useToast();
 * showToast("保存しました", { type: "success", duration: 3000 });
 */

import { ReactNode } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number; // ミリ秒。0 で自動削除しない
}

/**
 * Toast管理ストア（クライアント側）
 * 実際の実装では Zustand または Context API を使用
 */
export class ToastStore {
  private toasts: Map<string, ToastMessage> = new Map();
  private listeners: Set<(toasts: ToastMessage[]) => void> = new Set();

  /**
   * Toast を追加
   */
  add(message: string, options: Partial<Omit<ToastMessage, "id">> = {}): string {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const toast: ToastMessage = {
      id,
      message,
      type: options.type ?? "info",
      duration: options.duration ?? 4000,
    };

    this.toasts.set(id, toast);
    this.notify();

    // 自動削除
    if (toast.duration! > 0) {
      setTimeout(() => this.remove(id), toast.duration);
    }

    return id;
  }

  /**
   * 成功メッセージ
   */
  success(message: string, duration: number = 3000): string {
    return this.add(message, { type: "success", duration });
  }

  /**
   * エラーメッセージ
   */
  error(message: string, duration: number = 5000): string {
    return this.add(message, { type: "error", duration });
  }

  /**
   * 警告メッセージ
   */
  warning(message: string, duration: number = 4000): string {
    return this.add(message, { type: "warning", duration });
  }

  /**
   * 情報メッセージ
   */
  info(message: string, duration: number = 3000): string {
    return this.add(message, { type: "info", duration });
  }

  /**
   * Toast を削除
   */
  remove(id: string): void {
    this.toasts.delete(id);
    this.notify();
  }

  /**
   * すべて削除
   */
  clear(): void {
    this.toasts.clear();
    this.notify();
  }

  /**
   * すべての Toast を取得
   */
  getAll(): ToastMessage[] {
    return Array.from(this.toasts.values());
  }

  /**
   * リスナーを登録
   */
  subscribe(listener: (toasts: ToastMessage[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * リスナーに通知
   */
  private notify(): void {
    this.listeners.forEach((listener) => listener(this.getAll()));
  }
}

/**
 * グローバル Toast インスタンス
 */
export const globalToastStore = new ToastStore();
