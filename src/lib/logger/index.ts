/**
 * Logger Module
 *
 * @description
 * アプリケーション全体で使用する構造化ロガー
 *
 * @usage
 * import { logger } from "@/lib/logger";
 *
 * // 基本的な使い方
 * logger.info("User login successful");
 * logger.error("Database connection failed", error);
 *
 * // コンテキスト付き
 * const userLogger = logger.withContext({ userId: "123" });
 * userLogger.info("Profile updated");
 *
 * // Server Actions でのコンテキスト設定
 * import { runWithLogContext } from "@/lib/logger";
 *
 * export async function myAction() {
 *   await runWithLogContext(
 *     { userId: session.user.id, requestId: generateRequestId() },
 *     async () => {
 *       logger.info("Action started"); // コンテキストが自動付与
 *     }
 *   );
 * }
 */

import { createLogger } from "./logger";
import { consoleTransport, jsonTransport, sentryTransport } from "./transports";

// 環境に応じたトランスポートを選択
const transports =
  process.env.NODE_ENV === "production"
    ? [jsonTransport, sentryTransport] // 本番: JSON形式 + Sentry
    : [consoleTransport]; // 開発: 読みやすいコンソール出力

/**
 * デフォルトロガー
 */
export const logger = createLogger(transports);

// Re-export utilities
export { createLogger } from "./logger";
export {
  extendLogContext,
  generateRequestId,
  getLogContext,
  runWithLogContext,
} from "./context";
export type { LogContext, LogEntry, Logger, LogLevel, LogTransport } from "./types";
export {
  consoleTransport,
  createExternalTransport,
  createFileTransport,
  errorOnlyTransport,
  jsonTransport,
} from "./transports";
