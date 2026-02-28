/**
 * API レスポンス型定義
 *
 * @description
 * - Hono API の統一レスポンスフォーマット
 * - RPC Client での完全な型推論をサポート
 */

// ============================================================================
// Error Codes
// ============================================================================

export type ErrorCode =
  | 'VALIDATION_ERROR'  // 400: リクエストデータのバリデーションエラー
  | 'UNAUTHORIZED'      // 401: 認証が必要
  | 'FORBIDDEN'         // 403: 権限不足
  | 'NOT_FOUND'         // 404: リソースが見つからない
  | 'CONFLICT'          // 409: リソースの競合（例: 既に存在する）
  | 'INTERNAL_ERROR';   // 500: サーバー内部エラー

// ============================================================================
// Response Types
// ============================================================================

/**
 * 成功レスポンス
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

/**
 * エラーレスポンス
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: Record<string, any>;
  };
}

/**
 * Union型（型推論用）
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ============================================================================
// Type Guards
// ============================================================================

/**
 * 成功レスポンスかどうかを判定
 */
export function isSuccessResponse<T>(
  response: ApiResponse<T>
): response is ApiSuccessResponse<T> {
  return response.success === true;
}

/**
 * エラーレスポンスかどうかを判定
 */
export function isErrorResponse<T>(
  response: ApiResponse<T>
): response is ApiErrorResponse {
  return response.success === false;
}

// ============================================================================
// HTTP Status Code Mapping
// ============================================================================

/**
 * ErrorCode から HTTP ステータスコードへのマッピング
 */
export const ERROR_STATUS_MAP: Record<ErrorCode, number> = {
  VALIDATION_ERROR: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
} as const;
