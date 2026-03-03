/**
 * Logger Context Management
 *
 * @description
 * AsyncLocalStorage を使用したリクエストスコープのコンテキスト管理
 * 各リクエストごとにユーザー情報やリクエストIDを保持
 *
 * @note
 * このモジュールはサーバーサイド専用です
 */

import { LogContext } from "./types";

// サーバーサイド専用: async_hooksはNode.js環境でのみ利用可能
let asyncLocalStorage: {
  getStore: () => LogContext | undefined;
  run: <T>(context: LogContext, fn: () => T | Promise<T>) => T | Promise<T>;
} | null = null;

if (typeof window === "undefined") {
  // サーバーサイドでのみインポート
  try {
    const asyncHooks = require("async_hooks");
    asyncLocalStorage = new asyncHooks.AsyncLocalStorage();
  } catch (error) {
    console.warn("async_hooks not available, context tracking disabled");
  }
}

/**
 * 現在のコンテキストを取得
 */
export function getLogContext(): LogContext | undefined {
  if (!asyncLocalStorage) {
    return undefined;
  }
  return asyncLocalStorage.getStore();
}

/**
 * コンテキストを設定して関数を実行
 *
 * @example
 * await runWithLogContext({ userId: "123", requestId: "req-456" }, async () => {
 *   logger.info("User action"); // コンテキストが自動的に含まれる
 * });
 */
export async function runWithLogContext<T>(
  context: LogContext,
  fn: () => T | Promise<T>
): Promise<T> {
  if (!asyncLocalStorage) {
    return await Promise.resolve(fn());
  }
  return asyncLocalStorage.run(context, fn);
}

/**
 * 既存のコンテキストに情報を追加
 */
export function extendLogContext(additionalContext: Partial<LogContext>): void {
  if (!asyncLocalStorage) {
    return;
  }

  const currentContext = asyncLocalStorage.getStore();
  if (currentContext) {
    Object.assign(currentContext, additionalContext);
  }
}

/**
 * リクエストIDを生成
 */
export function generateRequestId(): string {
  return `req-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}
