/**
 * Logger Types
 *
 * @description
 * 構造化ロギングシステムの型定義
 */

export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

export interface LogContext {
  /** ユーザーID（認証済みの場合） */
  userId?: string;
  /** ユーザーロール */
  userRole?: string;
  /** リクエストID（トレーシング用） */
  requestId?: string;
  /** セッションID */
  sessionId?: string;
  /** IPアドレス */
  ipAddress?: string;
  /** ユーザーエージェント */
  userAgent?: string;
  /** リクエストパス */
  path?: string;
  /** HTTPメソッド */
  method?: string;
  /** 追加のカスタムフィールド */
  [key: string]: unknown;
}

export interface LogEntry {
  /** タイムスタンプ（ISO 8601形式） */
  timestamp: string;
  /** ログレベル */
  level: LogLevel;
  /** メッセージ */
  message: string;
  /** コンテキスト情報 */
  context?: LogContext;
  /** エラーオブジェクト */
  error?: {
    name: string;
    message: string;
    stack?: string;
    code?: string;
    digest?: string;
  };
  /** 環境情報 */
  env: {
    nodeEnv: string;
    appVersion?: string;
  };
  /** 追加のメタデータ */
  metadata?: Record<string, unknown>;
}

export interface Logger {
  debug(message: string, metadata?: Record<string, unknown>): void;
  info(message: string, metadata?: Record<string, unknown>): void;
  warn(message: string, metadata?: Record<string, unknown>): void;
  error(message: string, error?: Error, metadata?: Record<string, unknown>): void;
  fatal(message: string, error?: Error, metadata?: Record<string, unknown>): void;

  /** コンテキストを設定した新しいロガーを返す */
  withContext(context: Partial<LogContext>): Logger;
}

export type LogTransport = (entry: LogEntry) => void | Promise<void>;
