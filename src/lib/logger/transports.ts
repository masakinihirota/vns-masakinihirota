/**
 * Log Transports
 *
 * @description
 * ログの出力先を定義
 * - Console Transport: 開発環境用
 * - JSON Transport: 本番環境用（CloudWatch等への出力）
 * - Sentry Transport: 本番環境でのエラー・致命的エラーの監視
 */

import { LogEntry, LogTransport } from "./types";

/**
 * Sentryが利用可能かチェック
 * 開発環境ではインポートを避けるため、遅延初期化を行う
 */
let sentryModule: any = null;
const initSentry = () => {
  if (sentryModule) return;
  if (typeof window === "undefined" && process.env.NODE_ENV === "production") {
    try {
      sentryModule = require("@sentry/nextjs");
    } catch (error) {
      // Sentry がインストールされていない場合は gracefully skip
      console.warn("Sentry not available, continuing without error tracking");
    }
  }
};


/**
 * コンソール出力（開発環境用）
 * 色付き、読みやすいフォーマット
 */
export const consoleTransport: LogTransport = (entry: LogEntry) => {
  const { timestamp, level, message, context, error, metadata } = entry;

  // レベルごとの色
  const colors = {
    debug: "\x1b[36m", // Cyan
    info: "\x1b[32m",  // Green
    warn: "\x1b[33m",  // Yellow
    error: "\x1b[31m", // Red
    fatal: "\x1b[35m", // Magenta
  };
  const reset = "\x1b[0m";

  // タイムスタンプをローカル時刻に変換
  const localTime = new Date(timestamp).toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3,
  });

  // ベースメッセージ
  const baseMessage = `${colors[level]}[${level.toUpperCase()}]${reset} ${localTime} ${message}`;

  console.log(baseMessage);

  // コンテキスト情報
  if (context && Object.keys(context).length > 0) {
    console.log("  Context:", context);
  }

  // メタデータ
  if (metadata && Object.keys(metadata).length > 0) {
    console.log("  Metadata:", metadata);
  }

  // エラー情報
  if (error) {
    console.error("  Error:", {
      name: error.name,
      message: error.message,
      code: error.code,
      digest: error.digest,
    });
    if (error.stack) {
      console.error("  Stack:", error.stack);
    }
  }
};

/**
 * JSON出力（本番環境用）
 * CloudWatch Logs や Datadog などに送信可能な構造化ログ
 */
export const jsonTransport: LogTransport = (entry: LogEntry) => {
  // JSON形式で出力（パース可能なフォーマット）
  console.log(JSON.stringify(entry));
};

/**
 * Sentryへのトランスポート（本番環境用）
 * error・fatal レベルのログを Sentry にキャプチャャーする
 *
 * @description
 * 以下の条件で Sentry にエラーがキャプチャーされます：
 * - NODE_ENV === "production"
 * - NEXT_PUBLIC_SENTRY_DSN が設定されている
 * - ログレベルが error または fatal
 *
 * @note
 * このトランスポートは以下の情報を Sentry に送信します：
 * - エラーメッセージ
 * - コンテキスト情報（userId, requestId など）
 * - メタデータ
 * - スタックトレース
 * - 環境情報
 */
export const sentryTransport: LogTransport = (entry: LogEntry) => {
  // 本番環境かつ Sentry が利用可能な場合のみ処理
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    // Sentry DSN が設定されていない場合はスキップ（警告はコンソールに）
    return;
  }

  // エラー・致命的エラーのみ送信
  if (entry.level !== "error" && entry.level !== "fatal") {
    return;
  }

  try {
    initSentry();

    if (!sentryModule) {
      return;
    }

    // エラーメッセージとレベルを確定
    const sentryLevel = entry.level === "fatal" ? "fatal" : "error";
    const message = entry.message || "Unknown error";

    // Sentry にキャプチャー
    sentryModule.captureMessage(message, {
      level: sentryLevel,
      contexts: {
        // コンテキスト情報を送信
        app: {
          userId: entry.context?.userId,
          requestId: entry.context?.requestId,
          path: entry.context?.path,
        },
      },
      extra: {
        // 詳細な情報を extra に含める
        context: entry.context,
        metadata: entry.metadata,
        error: entry.error,
        env: entry.env,
      },
      tags: {
        // タグで分類
        environment: process.env.NODE_ENV,
        logLevel: entry.level,
      },
    });
  } catch (error) {
    // Sentry 送信失敗時は再度エラーを起こさず、gracefully skip
    console.error(
      "[Logger] Failed to send log to Sentry:",
      error instanceof Error ? error.message : String(error)
    );
  }
};

/**
 * エラーのみコンソール出力（本番環境でのエラー確認用）
 */
export const errorOnlyTransport: LogTransport = (entry: LogEntry) => {
  if (entry.level === "error" || entry.level === "fatal") {
    console.error(JSON.stringify(entry));
  }
};

/**
 * ファイル出力用トランスポート（将来の拡張用）
 *
 * @todo
 * - ログローテーション
 * - 非同期書き込み
 * - バッファリング
 */
export const createFileTransport = (filePath: string): LogTransport => {
  return async (entry: LogEntry) => {
    // TODO: ファイルシステムへの書き込み実装
    // 現在は未実装（将来の拡張用プレースホルダー）
    console.warn("File transport is not yet implemented:", filePath, entry);
  };
};

/**
 * 外部サービス送信用トランスポート（将来の拡張用）
 *
 * @example
 * const sentryTransport = createExternalTransport(async (entry) => {
 *   await Sentry.captureMessage(entry.message, {
 *     level: entry.level,
 *     extra: { context: entry.context, metadata: entry.metadata },
 *   });
 * });
 */
export const createExternalTransport = (
  sendFn: (entry: LogEntry) => Promise<void>
): LogTransport => {
  return async (entry: LogEntry) => {
    try {
      await sendFn(entry);
    } catch (error) {
      // 外部送信失敗時はコンソールにフォールバック
      console.error("Failed to send log to external service:", error);
      console.error("Original log entry:", entry);
    }
  };
};
