/**
 * Error Handler Middleware
 *
 * @description
 * - すべてのエラーを統一フォーマットでキャッチ
 * - 本番環境と開発環境でエラーメッセージを切り替え
 * - Zod バリデーションエラーのハンドリング
 */

import type { ErrorHandler } from 'hono';
import type { ApiErrorResponse, ErrorCode } from '../types';

/**
 * Hono のグローバルエラーハンドラー
 *
 * @design
 * - すべての未処理エラーをキャッチして統一フォーマットで返却
 * - 本番環境ではエラー詳細を隠蔽してセキュリティを確保
 * - 開発環境では詳細なエラーメッセージを表示してデバッグを支援
 *
 * @security
 * - スタックトレース、データベースクエリ、内部IDは含めない
 * - 本番環境では汎用的なエラーメッセージのみ表示
 */
export const errorHandler: ErrorHandler = (err, c) => {
  console.error('[API Error]', {
    message: err.message,
    name: err.name,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  // Zod バリデーションエラー
  if (err.name === 'ZodError') {
    const response: ApiErrorResponse = {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: (err as any).flatten?.() || { issues: (err as any).issues },
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
    };

    const response: ApiErrorResponse = {
      success: false,
      error: {
        code: errorCode,
        message: err.message,
        details: (err as any).details,
      },
    };
    const status = statusMap[errorCode] || 500;
    return c.json(response, status as any);
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
  details?: Record<string, any>
): Error & { code: ErrorCode; details?: Record<string, any> } {
  const error = new Error(message) as Error & {
    code: ErrorCode;
    details?: Record<string, any>;
  };
  error.code = code;
  error.details = details;
  return error;
}
