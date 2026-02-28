/**
 * Hono RPC + TanStack Query 統合カスタムフック
 *
 * @description
 * - Hono RPC Client と TanStack Query を統合
 * - 完全な型安全性を提供
 * - 自動的なキャッシング、リトライ、エラーハンドリング
 *
 * @example
 * ```typescript
 * // GET リクエスト
 * const { data, isLoading, error } = useApiQuery(['users', 'me'], async () => {
 *   const res = await client.users.me.$get();
 *   if (!res.ok) throw new Error('Failed to fetch user');
 *   return res.json();
 * });
 *
 * // POST リクエスト (Mutation)
 * const createUser = useApiMutation(async (input: CreateUserInput) => {
 *   const res = await client.admin.users.$post({ json: input });
 *   if (!res.ok) throw new Error('Failed to create user');
 *   return res.json();
 * }, {
 *   onSuccess: () => {
 *     queryClient.invalidateQueries({ queryKey: ['users'] });
 *   },
 * });
 * ```
 */

'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
  type QueryKey,
} from '@tanstack/react-query';
import { client as apiClient } from '@/lib/api/client';
import type { ApiSuccessResponse, ApiErrorResponse } from '@/lib/api/types';

/**
 * API レスポンス型のユニオン
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * API エラー型
 */
export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * API Query フック
 *
 * @description
 * - GET リクエスト用
 * - 自動的なキャッシング、リトライ
 *
 * @example
 * ```typescript
 * const { data, isLoading } = useApiQuery(['health'], async () => {
 *   const res = await client.health.$get();
 *   return handleApiResponse(res);
 * });
 * ```
 */
export function useApiQuery<TData = unknown, TError = ApiError>(
  queryKey: QueryKey,
  queryFn: () => Promise<ApiResponse<TData>>,
  options?: Omit<UseQueryOptions<ApiResponse<TData>, TError, TData>, 'queryKey' | 'queryFn'>
) {
  return useQuery<ApiResponse<TData>, TError, TData>({
    queryKey,
    queryFn,
    select: (data) => {
      if (!data.success) {
        throw new ApiError(
          data.error.code,
          data.error.message,
          data.error.status
        );
      }
      return data.data as TData;
    },
    ...options,
  });
}

/**
 * API Mutation フック
 *
 * @description
 * - POST, PUT, DELETE リクエスト用
 * - 自動的なエラーハンドリング
 *
 * @example
 * ```typescript
 * const createGroup = useApiMutation(
 *   async (input: CreateGroupInput) => {
 *     const res = await client.groups.$post({ json: input });
 *     return handleApiResponse(res);
 *   },
 *   {
 *     onSuccess: () => {
 *       queryClient.invalidateQueries({ queryKey: ['groups'] });
 *     },
 *   }
 * );
 *
 * createGroup.mutate({ name: 'My Group' });
 * ```
 */
export function useApiMutation<TData = unknown, TVariables = unknown, TError = ApiError>(
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>,
  options?: Omit<
    UseMutationOptions<TData, TError, TVariables>,
    'mutationFn'
  >
) {
  return useMutation<TData, TError, TVariables>({
    mutationFn: async (variables) => {
      const response = await mutationFn(variables);
      if (!response.success) {
        throw new ApiError(
          response.error.code,
          response.error.message,
          response.error.status
        );
      }
      return response.data as TData;
    },
    ...options,
  });
}

/**
 * Query Client フック
 *
 * @description
 * - キャッシュの無効化、手動更新に使用
 */
export { useQueryClient };

/**
 * RPC Client エクスポート
 */
export const client = apiClient;

/**
 * レスポンス処理ヘルパー
 *
 * @description
 * - Hono RPC Client の Response を ApiResponse に変換
 */
export async function handleApiResponse<T>(
  response: Response
): Promise<ApiResponse<T>> {
  if (!response.ok) {
    // ネットワークエラーや500エラー
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: `Request failed with status ${response.status}`,
        status: response.status,
      },
    };
  }

  try {
    const data = await response.json();
    return data as ApiResponse<T>;
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'PARSE_ERROR',
        message: 'Failed to parse response JSON',
      },
    };
  }
}
