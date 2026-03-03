/**
 * Error Handler Middleware
 *
 * @description
 * - すべてのエラーを統一フォーマットでキャッチ
 * - 本番環境と開発環境でエラーメッセージを切り替え
 * - Zod バリデーションエラーのハンドリング
 * - カスタムエラークラスの型安全なハンドリング
 */

import type { ErrorHandler } from 'hono';
import { HTTPException } from 'hono/http-exception';
import {
  GroupNotFoundError,
  NationNotFoundError,
  PermissionDeniedError,
  UserAlreadyExistsError,
  UserNotFoundError,
  ValidationError
} from '../errors';
import { logger } from '@/lib/logger';
import type { ApiErrorResponse, ErrorCode } from '../types/response';

/**
 * Hono のグローバルエラーハンドラー
 *
 * @design
 * - すべての未処理エラーをキャッチして統一フォーマットで返却
 * - 本番環境ではエラー詳細を隠蔽してセキュリティを確保
 * - 開発環境では詳細なエラーメッセージを表示してデバッグを支援
 * - カスタムエラークラスを型安全にハンドリング
 *
 * @security
 * - スタックトレース、データベースクエリ、内部IDは含めない
 * - 本番環境では汎用的なエラーメッセージのみ表示
 */
export const errorHandler: ErrorHandler = (err, c) => {
  logger.error('[API Error]', {
    message: err.message,
    name: err.name,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  // HTTPException (from Hono validation, etc.)
  if (err instanceof HTTPException) {
    const response: ApiErrorResponse = {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: err.message || 'Request error',
      },
    };
    return c.json(response, err.status);
  }

  // Custom error classes (type-safe handling)
  if (err instanceof UserAlreadyExistsError) {
    const response: ApiErrorResponse = {
      success: false,
      error: {
        code: 'CONFLICT',
        message: 'Email already in use',
      },
    };
    return c.json(response, 409);
  }

  if (
    err instanceof UserNotFoundError ||
    err instanceof GroupNotFoundError ||
    err instanceof NationNotFoundError
  ) {
    const response: ApiErrorResponse = {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Resource not found',
      },
    };
    return c.json(response, 404);
  }

  if (err instanceof ValidationError) {
    const response: ApiErrorResponse = {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: { details: err.message },
      },
    };
    return c.json(response, 400);
  }

  if (err instanceof PermissionDeniedError) {
    const response: ApiErrorResponse = {
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'Permission denied',
      },
    };
    return c.json(response, 403);
  }

  // Zod バリデーションエラー
  if (err.name === 'ZodError') {
    const zodError = err as { flatten?: () => unknown };
    const details = zodError.flatten?.() || { fieldErrors: {}, formErrors: [] };
    const response: ApiErrorResponse = {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: details as Record<string, unknown>,
      },
    };
    return c.json(response, 400);
  }

  // HTTP エラー（既知のエラーコード付き）
  if ('code' in err && typeof err.code === 'string') {
    const errorCode = err.code as ErrorCode;
    const statusMap: Record<ErrorCode, number> = {
      VALIDATION_ERROR: 400,
      UNAUTHORIZED: 401,
      FORBIDDEN: 403,
      NOT_FOUND: 404,
      CONFLICT: 409,
      INTERNAL_ERROR: 500,
      PARSE_ERROR: 400,
    };

    const customError = err as { code: ErrorCode; message: string; details?: Record<string, unknown> };
    const response: ApiErrorResponse = {
      success: false,
      error: {
        code: errorCode,
        message: customError.message,
        details: customError.details,
      },
    };
    const status = (statusMap[errorCode] || 500) as Parameters<typeof c.json>[1];
    return c.json(response, status);
  }

  // デフォルトエラー（予期しないエラー）
  const response: ApiErrorResponse = {
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message:
        process.env.NODE_ENV === 'production'
          ? 'An unexpected error occurred'
          : err.message,
    },
  };
  return c.json(response, 500);
};

/**
 * カスタムエラーを作成するヘルパー関数
 *
 * @example
 * throw createApiError('UNAUTHORIZED', 'Authentication required');
 */
export function createApiError(
  code: ErrorCode,
  message: string,
  details?: Record<string, unknown>
): Error & { code: ErrorCode; details?: Record<string, unknown> } {
  const error = new Error(message) as Error & {
    code: ErrorCode;
    details?: Record<string, unknown>;
  };
  error.code = code;
  error.details = details;
  return error;
}
