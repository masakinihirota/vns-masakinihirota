/**
 * API レスポンス型定義
 *
 * @description
 * Server Actions と API Route が統一されたレスポンス形式を使用します。
 * クライアント側が一貫した方法でエラー処理を実装できます。
 */

import type { ErrorCode } from './error-codes';

/**
 * 成功レスポンス
 *
 * @example
 * {
 *   success: true,
 *   data: { groupId: "uuid", name: "My Group" }
 * }
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
}

/**
 * エラーレスポンス
 *
 * @example
 * {
 *   success: false,
 *   error: {
 *     code: 'INVALID_NAME',
 *     message: '名前は1～100文字である必要があります。'
 *   }
 * }
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    // デバッグ情報（本番環境では非表示）
    details?: Record<string, unknown>;
  };
}

/**
 * API レスポンス（成功またはエラー）
 */
export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * API リクエスト利用 create/update 型テンプレート
 *
 * @example
 * interface CreateGroupRequest {
 *   name: string;
 *   description?: string;
 *   public?: boolean;
 * }
 *
 * export async function createGroup(
 *   req: CreateGroupRequest
 * ): Promise<ApiResponse<{ groupId: string }>> {
 *   try {
 *     // バリデーション
 *     if (!req.name || req.name.length > 100) {
 *       return {
 *         success: false,
 *         error: {
 *           code: 'INVALID_NAME',
 *           message: '名前は1～100文字である必要があります。'
 *         }
 *       };
 *     }
 *
 *     // ビジネスロジック
 *     const group = await db.insert(groups).values({ ... });
 *
 *     return {
 *       success: true,
 *       data: { groupId: group.id }
 *     };
 *   } catch (error) {
 *     console.error('Create group failed', error);
 *     return {
 *       success: false,
 *       error: {
 *         code: 'INTERNAL_SERVER_ERROR',
 *         message: 'グループの作成に失敗しました。'
 *       }
 *     };
 *   }
 * }
 */

/**
 * ページネーション付きレスポンス
 */
export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

/**
 * API リスト取得レスポンス
 *
 * @example
 * {
 *   success: true,
 *   data: {
 *     items: [...],
 *     page: 1,
 *     pageSize: 20,
 *     totalCount: 42,
 *     totalPages: 3
 *   }
 * }
 */
export type ApiListResponse<T> = ApiSuccessResponse<PaginatedResponse<T>>;

/**
 * ヘルパー関数: 成功レスポンスを構築
 *
 * @example
 * return successResponse({ groupId });
 */
export function successResponse<T>(data: T): ApiSuccessResponse<T> {
  return {
    success: true,
    data,
  };
}

/**
 * ヘルパー関数: エラーレスポンスを構築
 *
 * @example
 * return errorResponse('INVALID_NAME', '名前が無効です');
 */
export function errorResponse(
  code: ErrorCode,
  message: string,
  details?: Record<string, unknown>
): ApiErrorResponse {
  return {
    success: false,
    error: {
      code,
      message,
      ...(process.env.NODE_ENV === 'development' && details && { details }),
    },
  };
}

/**
 * ヘルパー関数: ページネーション付きリスト レスポンサーを構築
 *
 * @example
 * const items = await db.select().from(groups).limit(20).offset(0);
 * const totalCount = await getGroupCount();
 * return successResponse(
 *   listResponse(items, 1, 20, totalCount)
 * );
 */
export function listResponse<T>(
  items: T[],
  page: number,
  pageSize: number,
  totalCount: number
): PaginatedResponse<T> {
  const totalPages = Math.ceil(totalCount / pageSize);
  return {
    items,
    page,
    pageSize,
    totalCount,
    totalPages,
  };
}
