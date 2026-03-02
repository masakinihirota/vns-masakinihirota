/**
 * Server Action Error Handler
 *
 * @description
 * Server Actions専用のエラーハンドリングラッパー
 * - エラーを安全にシリアライズしてクライアントに返す
 * - セキュリティイベントの記録
 * - ユーザーフレンドリーなメッセージの提供
 *
 * @usage
 * export async function myAction() {
 *   return withErrorHandling(async () => {
 *     // アクション実装
 *     return { success: true, data: result };
 *   });
 * }
 */

"use server";

import { getUserMessage } from "@/lib/errors";
import { isAppError, toAppError, AuthenticationError, AuthorizationError, ErrorCodes } from "@/lib/errors/app-error";
import { logger } from "@/lib/logger";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Server Actionの戻り値の型
 */
export type ActionResult<T = unknown> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: {
        message: string;
        code?: string;
        digest?: string;
      };
    };

/**
 * Server Actionをエラーハンドリングでラップ
 *
 * @example
 * export async function createPost(data: PostData) {
 *   return withErrorHandling(async () => {
 *     const post = await db.insert(posts).values(data);
 *     return post;
 *   });
 * }
 */
export async function withErrorHandling<T>(
  action: () => Promise<T>,
  options?: {
    /** カスタムエラーメッセージ（エラー時にユーザーに表示） */
    fallbackMessage?: string;
    /** エラー発生時にログに記録する追加コンテキスト */
    context?: Record<string, unknown>;
  }
): Promise<ActionResult<T>> {
  try {
    const result = await action();
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    // エラーをAppErrorに変換
    const appError = toAppError(error);

    // エラーログを記録
    logger.error(
      `Server action failed: ${appError.message}`,
      appError,
      {
        errorCode: appError.code,
        statusCode: appError.statusCode,
        ...options?.context,
      }
    );

    // クライアントに返すエラー情報を構築
    const userMessage = isAppError(error)
      ? getUserMessage(appError.code)
      : options?.fallbackMessage || "処理中にエラーが発生しました";

    return {
      success: false,
      error: {
        message: userMessage,
        code: appError.code,
        digest: (error as any).digest,
      },
    };
  }
}

/**
 * 認証が必要なServer Actionのラッパー
 *
 * @description
 * Better Auth を使用してセッションを取得し、認証が必要なアクションを実行します。
 * 権限不足やセッション失効時はセキュリティイベントとして記録されます。
 *
 * @param action - 認証済みセッションを受け取るアクション関数
 * @param options - オプション設定
 * @param options.requiredRole - 必須ロール（指定時は権限チェックを実施）
 * @param options.context - ログに記録する追加コンテキスト（actionName など）
 *
 * @example
 * export async function deletePost(postId: string) {
 *   return withAuth(
 *     async (session) => {
 *       const post = await db.query.posts.findFirst({ where: eq(posts.id, postId) });
 *       if (post.authorId !== session.user.id) {
 *         throw new AuthorizationError("You don't have permission to delete this post");
 *       }
 *       await db.delete(posts).where(eq(posts.id, postId));
 *       return { deleted: true };
 *     },
 *     { requiredRole: "user", context: { action: "deletePost", postId } }
 *   );
 * }
 */
export async function withAuth<T>(
  action: (session: { user: { id: string; email: string; role?: string } }) => Promise<T>,
  options?: {
    /** 必須ロール（admin, moderator など） */
    requiredRole?: string;
    /** カスタムエラーメッセージ */
    fallbackMessage?: string;
    /** ログに記録する追加コンテキスト */
    context?: Record<string, unknown>;
  }
): Promise<ActionResult<T>> {
  try {
    // Better Auth からセッションを取得
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // セッション未認証のケース
    if (!session) {
      logger.warn("[SECURITY_EVENT] Authentication required but missing", {
        event: "auth_required_missing",
        severity: "medium",
        requiredRole: options?.requiredRole,
        context: options?.context,
        timestamp: new Date().toISOString(),
      });

      return {
        success: false,
        error: {
          message: getUserMessage(ErrorCodes.AUTH_SESSION_EXPIRED),
          code: ErrorCodes.AUTH_SESSION_EXPIRED,
        },
      };
    }

    // ロール権限チェック（指定されている場合）
    if (options?.requiredRole && session.user.role !== options.requiredRole) {
      logger.warn("[SECURITY_EVENT] Unauthorized access attempt", {
        event: "authorization_failed",
        severity: "high",
        userId: session.user.id,
        userEmail: session.user.email,
        requiredRole: options.requiredRole,
        userRole: session.user.role,
        context: options?.context,
        timestamp: new Date().toISOString(),
      });

      return {
        success: false,
        error: {
          message: getUserMessage(ErrorCodes.AUTHZ_INSUFFICIENT_PERMISSIONS),
          code: ErrorCodes.AUTHZ_INSUFFICIENT_PERMISSIONS,
        },
      };
    }

    // 認証・認可が通ったのでアクションを実行
    return await withErrorHandling(
      async () => await action(session),
      options
    );
  } catch (error) {
    // セッション取得自体でエラーが発生した場合
    const appError = toAppError(error);

    logger.error(
      "[SECURITY_EVENT] Session retrieval failed",
      appError,
      {
        event: "auth_retrieval_error",
        severity: "high",
        errorCode: appError.code,
        context: options?.context,
        timestamp: new Date().toISOString(),
      }
    );

    return {
      success: false,
      error: {
        message: options?.fallbackMessage || getUserMessage(ErrorCodes.AUTH_SESSION_EXPIRED),
        code: ErrorCodes.AUTH_SESSION_EXPIRED,
      },
    };
  }
}

/**
 * バリデーション付きServer Actionのラッパー
 *
 * @description
 * Zod などのスキーマを使用してバリデーションを実施し、失敗時は構造化ログに記録します。
 *
 * @param schema - バリデーションスキーマ（Zod など）
 * @param input - バリデーション対象のデータ
 * @param action - バリデーション成功後に実行するアクション
 * @param options - 追加設定
 *
 * @example
 * import { z } from "zod";
 *
 * const PostSchema = z.object({
 *   title: z.string().min(1, "Title is required"),
 *   content: z.string().min(10, "Content must be at least 10 characters"),
 * });
 *
 * export async function createPost(formData: FormData) {
 *   return withValidation(PostSchema, Object.fromEntries(formData), async (data) => {
 *     const post = await db.insert(posts).values(data);
 *     return post;
 *   });
 * }
 */
export async function withValidation<TSchema, T>(
  schema: { parse: (data: unknown) => TSchema },
  input: unknown,
  action: (validated: TSchema) => Promise<T>,
  options?: {
    fallbackMessage?: string;
    context?: Record<string, unknown>;
  }
): Promise<ActionResult<T>> {
  try {
    // バリデーション実行
    let validated: TSchema;
    try {
      validated = schema.parse(input);
    } catch (validationError) {
      // バリデーション失敗をログ
      logger.warn("Validation failed", validationError instanceof Error ? validationError : new Error(String(validationError)), {
        errorType: "VALIDATION_ERROR",
        context: options?.context,
        timestamp: new Date().toISOString(),
      });

      return {
        success: false,
        error: {
          message: getUserMessage(ErrorCodes.VALIDATION_INVALID_INPUT),
          code: ErrorCodes.VALIDATION_INVALID_INPUT,
        },
      };
    }

    return await withErrorHandling(
      async () => await action(validated),
      options
    );
  } catch (error) {
    // アクション実行中のエラー
    return await withErrorHandling(
      async () => {
        throw error;
      },
      options
    );
  }
}
