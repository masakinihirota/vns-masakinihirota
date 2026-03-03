/**
 * Application Error Classes
 *
 * @description
 * ドメイン別のエラークラス体系
 * - エラーの種類を明確に分類
 * - セキュリティイベントの記録
 * - ユーザーフレンドリーなメッセージ対応
 */

import { logger } from "@/lib/logger";

/**
 * エラーコード定義
 */
export const ErrorCodes = {
  // 認証エラー (1000-1999)
  AUTH_INVALID_CREDENTIALS: "AUTH_1001",
  AUTH_SESSION_EXPIRED: "AUTH_1002",
  AUTH_TOKEN_INVALID: "AUTH_1003",
  AUTH_OAUTH_FAILED: "AUTH_1004",
  AUTH_EMAIL_NOT_VERIFIED: "AUTH_1005",

  // 認可エラー (2000-2999)
  AUTHZ_INSUFFICIENT_PERMISSIONS: "AUTHZ_2001",
  AUTHZ_RESOURCE_FORBIDDEN: "AUTHZ_2002",
  AUTHZ_ROLE_REQUIRED: "AUTHZ_2003",
  AUTHZ_ADMIN_ONLY: "AUTHZ_2004",

  // バリデーションエラー (3000-3999)
  VALIDATION_INVALID_INPUT: "VAL_3001",
  VALIDATION_REQUIRED_FIELD: "VAL_3002",
  VALIDATION_INVALID_FORMAT: "VAL_3003",
  VALIDATION_OUT_OF_RANGE: "VAL_3004",

  // リソースエラー (4000-4999)
  RESOURCE_NOT_FOUND: "RES_4001",
  RESOURCE_ALREADY_EXISTS: "RES_4002",
  RESOURCE_CONFLICT: "RES_4003",

  // データベースエラー (5000-5999)
  DB_CONNECTION_FAILED: "DB_5001",
  DB_QUERY_FAILED: "DB_5002",
  DB_TRANSACTION_FAILED: "DB_5003",
  DB_CONSTRAINT_VIOLATION: "DB_5004",

  // 外部サービスエラー (6000-6999)
  EXTERNAL_SERVICE_UNAVAILABLE: "EXT_6001",
  EXTERNAL_API_ERROR: "EXT_6002",
  EXTERNAL_TIMEOUT: "EXT_6003",

  // システムエラー (9000-9999)
  SYSTEM_INTERNAL_ERROR: "SYS_9001",
  SYSTEM_NOT_IMPLEMENTED: "SYS_9002",
  SYSTEM_CONFIGURATION_ERROR: "SYS_9003",
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

/**
 * アプリケーションエラー基底クラス
 */
export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly context?: Record<string, unknown>;
  public readonly timestamp: string;

  constructor(
    message: string,
    code: ErrorCode,
    statusCode: number = 500,
    isOperational: boolean = true,
    context?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.context = context;
    this.timestamp = new Date().toISOString();

    // スタックトレースを保持
    Error.captureStackTrace(this, this.constructor);

    // エラーログを記録
    this.logError();
  }

  private logError(): void {
    const logContext = {
      errorCode: this.code,
      statusCode: this.statusCode,
      isOperational: this.isOperational,
      ...this.context,
    };

    if (this.isOperational) {
      logger.warn(this.message, logContext);
    } else {
      logger.error(this.message, this, logContext);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
      context: this.context,
    };
  }
}

/**
 * 認証エラー
 * ユーザーの認証に失敗した場合
 */
export class AuthenticationError extends AppError {
  constructor(
    message: string = "認証に失敗しました",
    code: ErrorCode = ErrorCodes.AUTH_INVALID_CREDENTIALS,
    context?: Record<string, unknown>
  ) {
    super(message, code, 401, true, context);

    // セキュリティイベントとして記録
    logger.warn("[SECURITY_EVENT] Authentication failed", {
      event: "authentication_failed",
      code,
      ...context,
    });
  }
}

/**
 * 認可エラー
 * ユーザーが権限を持たないリソースにアクセスしようとした場合
 */
export class AuthorizationError extends AppError {
  constructor(
    message: string = "アクセス権限がありません",
    code: ErrorCode = ErrorCodes.AUTHZ_INSUFFICIENT_PERMISSIONS,
    context?: Record<string, unknown>
  ) {
    super(message, code, 403, true, context);

    // セキュリティイベントとして記録（不正アクセス試行）
    logger.error("[SECURITY_EVENT] Authorization failed - Unauthorized access attempt", undefined, {
      event: "authorization_failed",
      severity: "high",
      code,
      ...context,
    });
  }
}

/**
 * バリデーションエラー
 * 入力値の検証に失敗した場合
 */
export class ValidationError extends AppError {
  public readonly fields?: Record<string, string[]>;

  constructor(
    message: string = "入力内容に誤りがあります",
    fields?: Record<string, string[]>,
    context?: Record<string, unknown>
  ) {
    super(message, ErrorCodes.VALIDATION_INVALID_INPUT, 400, true, {
      fields,
      ...context,
    });
    this.fields = fields;
  }
}

/**
 * リソース未検出エラー
 * 要求されたリソースが見つからない場合
 */
export class NotFoundError extends AppError {
  constructor(
    resource: string = "リソース",
    context?: Record<string, unknown>
  ) {
    super(
      `${resource}が見つかりません`,
      ErrorCodes.RESOURCE_NOT_FOUND,
      404,
      true,
      { resource, ...context }
    );
  }
}

/**
 * リソース競合エラー
 * リソースが既に存在する、または競合状態にある場合
 */
export class ConflictError extends AppError {
  constructor(
    message: string = "リソースが競合しています",
    context?: Record<string, unknown>
  ) {
    super(message, ErrorCodes.RESOURCE_CONFLICT, 409, true, context);
  }
}

/**
 * データベースエラー
 * データベース操作に失敗した場合
 */
export class DatabaseError extends AppError {
  constructor(
    message: string = "データベース操作に失敗しました",
    code: ErrorCode = ErrorCodes.DB_QUERY_FAILED,
    context?: Record<string, unknown>
  ) {
    super(message, code, 500, false, context);
  }
}

/**
 * 外部サービスエラー
 * 外部APIやサービスとの連携に失敗した場合
 */
export class ExternalServiceError extends AppError {
  constructor(
    serviceName: string,
    message: string = "外部サービスとの通信に失敗しました",
    code: ErrorCode = ErrorCodes.EXTERNAL_SERVICE_UNAVAILABLE,
    context?: Record<string, unknown>
  ) {
    super(message, code, 503, true, { serviceName, ...context });
  }
}

/**
 * システムエラー
 * 予期しないシステムレベルのエラー
 */
export class SystemError extends AppError {
  constructor(
    message: string = "システムエラーが発生しました",
    context?: Record<string, unknown>
  ) {
    super(message, ErrorCodes.SYSTEM_INTERNAL_ERROR, 500, false, context);
  }
}

/**
 * エラーがAppErrorのインスタンスかチェック
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * エラーをAppErrorに変換
 */
export function toAppError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new SystemError(error.message, {
      originalError: error.name,
      stack: error.stack,
    });
  }

  return new SystemError("不明なエラーが発生しました", {
    originalError: String(error),
  });
}
