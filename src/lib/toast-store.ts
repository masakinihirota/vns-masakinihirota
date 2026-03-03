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

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number; // ミリ秒。0 で自動削除しない
  action?: ToastAction; // アクションボタン（リトライなど）
  persistent?: boolean; // 手動で閉じるまで消えない
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
  add(
    message: string,
    options: Partial<Omit<ToastMessage, "id" | "message">> = {}
  ): string {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const toast: ToastMessage = {
      id,
      message,
      type: options.type ?? "info",
      duration: options.persistent ? 0 : (options.duration ?? 4000),
      action: options.action,
      persistent: options.persistent,
    };

    this.toasts.set(id, toast);
    this.notify();

    // 自動削除
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => this.remove(id), toast.duration);
    }

    return id;
  }

  /**
   * 成功メッセージ
   */
  success(
    message: string,
    options: Partial<Omit<ToastMessage, "id" | "message" | "type">> = {}
  ): string {
    return this.add(message, {
      type: "success",
      duration: options.duration ?? 3000,
      ...options,
    });
  }

  /**
   * エラーメッセージ
   * デフォルトでは自動削除しない（ユーザーが確認するまで表示）
   */
  error(
    message: string,
    options: Partial<Omit<ToastMessage, "id" | "message" | "type">> = {}
  ): string {
    return this.add(message, {
      type: "error",
      duration: options.persistent ? 0 : (options.duration ?? 0), // エラーはデフォルトで永続
      ...options,
    });
  }

  /**
   * お試し機能エラー専用
   * LocalStorageの問題など、お試し機能特有のエラーを優しく通知
   */
  trialError(
    feature: string = "お試し機能",
    reason?: string,
    action?: ToastAction
  ): string {
    const reasonText = reason
      ? `（理由: ${reason}）`
      : "（ブラウザ設定により保存できませんでした）";

    return this.error(
      `${feature}が一時的に利用できません${reasonText}`,
      {
        persistent: true,
        action: action || {
          label: "詳しく見る",
          onClick: () => {
            // TODO: ヘルプページへのリンク
            window.open("/help/trial-features", "_blank");
          },
        },
      }
    );
  }

  /**
   * 警告メッセージ
   */
  warning(
    message: string,
    options: Partial<Omit<ToastMessage, "id" | "message" | "type">> = {}
  ): string {
    return this.add(message, {
      type: "warning",
      duration: options.duration ?? 4000,
      ...options,
    });
  }

  /**
   * 情報メッセージ
   */
  info(
    message: string,
    options: Partial<Omit<ToastMessage, "id" | "message" | "type">> = {}
  ): string {
    return this.add(message, {
      type: "info",
      duration: options.duration ?? 3000,
      ...options,
    });
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
