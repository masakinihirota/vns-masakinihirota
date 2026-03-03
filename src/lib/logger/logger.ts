/**
 * Logger Implementation
 *
 * @description
 * 構造化ロギングの実装
 * - JSON出力対応
 * - スタックトレース記録
 * - コンテキスト情報の自動付与
 * - 複数のトランスポート対応
 */

import { getLogContext } from "./context";
import { LogContext, LogEntry, Logger, LogLevel, LogTransport } from "./types";

class LoggerImpl implements Logger {
  private transports: LogTransport[];
  private additionalContext: Partial<LogContext>;

  constructor(
    transports: LogTransport[],
    additionalContext: Partial<LogContext> = {}
  ) {
    this.transports = transports;
    this.additionalContext = additionalContext;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    error?: Error,
    metadata?: Record<string, unknown>
  ): LogEntry {
    // AsyncLocalStorage からコンテキストを取得
    const asyncContext = getLogContext();

    // コンテキストをマージ（優先度: additional > async）
    const mergedContext: LogContext = {
      ...asyncContext,
      ...this.additionalContext,
    };

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: Object.keys(mergedContext).length > 0 ? mergedContext : undefined,
      env: {
        nodeEnv: process.env.NODE_ENV || "development",
        appVersion: process.env.NEXT_PUBLIC_APP_VERSION,
      },
      metadata,
    };

    // エラー情報を追加
    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: (error as any).code,
        digest: (error as any).digest,
      };
    }

    return entry;
  }

  private log(
    level: LogLevel,
    message: string,
    error?: Error,
    metadata?: Record<string, unknown>
  ): void {
    const entry = this.createLogEntry(level, message, error, metadata);

    // すべてのトランスポートに送信
    this.transports.forEach((transport) => {
      try {
        const result = transport(entry);
        // Promise を返す場合は非同期で処理（エラーハンドリング付き）
        if (result instanceof Promise) {
          result.catch((err) => {
            console.error("Transport error:", err);
          });
        }
      } catch (err) {
        console.error("Transport error:", err);
      }
    });
  }

  debug(message: string, metadata?: Record<string, unknown>): void {
    this.log("debug", message, undefined, metadata);
  }

  info(message: string, metadata?: Record<string, unknown>): void {
    this.log("info", message, undefined, metadata);
  }

  warn(message: string, metadata?: Record<string, unknown>): void {
    this.log("warn", message, undefined, metadata);
  }

  error(message: string, error?: Error, metadata?: Record<string, unknown>): void {
    this.log("error", message, error, metadata);
  }

  fatal(message: string, error?: Error, metadata?: Record<string, unknown>): void {
    this.log("fatal", message, error, metadata);
  }

  withContext(context: Partial<LogContext>): Logger {
    return new LoggerImpl(this.transports, {
      ...this.additionalContext,
      ...context,
    });
  }
}

/**
 * ロガーインスタンスを作成
 */
export function createLogger(
  transports: LogTransport[],
  context?: Partial<LogContext>
): Logger {
  return new LoggerImpl(transports, context);
}
