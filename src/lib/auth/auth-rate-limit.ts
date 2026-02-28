/**
 * 認証ラッパー - レート制限統合
 *
 * Better Auth OAuth フローにレート制限を追加します
 *
 * @usage
 * // クライアント側で呼出
 * await signInWithRateLimit(email, provider)
 *
 * @design
 * - 失敗時にレート制限をチェック
 * - 成功時にカウンターをリセット
 * - ユーザーID または IPアドレスで追跡
 */

"use server";

import {
  checkRateLimit,
  resetRateLimit,
  getRateLimitStatus,
  RATE_LIMIT_CONFIG,
} from "@/lib/auth/rate-limiter";

/**
 * 認証レート制限エラー
 */
export class AuthRateLimitError extends Error {
  constructor(
    public readonly retryAfterSeconds: number,
    public readonly attemptCount: number,
    public readonly maxAttempts: number,
  ) {
    super(
      `認証に失敗しました。${retryAfterSeconds}秒後に再試行してください。` +
      `(試行回数: ${attemptCount}/${maxAttempts})`
    );
    this.name = "AuthRateLimitError";
  }
}

/**
 * レート制限をチェック - 認証セッション用
 *
 * @param identifier - ユーザーID, メール, または IPアドレス
 * @returns レート制限内の場合は true
 * @throws AuthRateLimitError ユーザーが制限を超えた場合
 *
 * @example
 * try {
 *   await checkAuthRateLimit(userId);
 * } catch (error) {
 *   if (error instanceof AuthRateLimitError) {
 *     // 429 Too Many Requests を返す
 *   }
 * }
 */
export async function checkAuthRateLimit(identifier: string): Promise<void> {
  const canAttempt = checkRateLimit(
    identifier,
    RATE_LIMIT_CONFIG.AUTH_MAX_ATTEMPTS,
    RATE_LIMIT_CONFIG.AUTH_WINDOW_MS,
  );

  if (!canAttempt) {
    const status = getRateLimitStatus(identifier);
    if (status) {
      const retryAfterSeconds = Math.ceil(
        (status.resetTime - Date.now()) / 1000
      );
      throw new AuthRateLimitError(
        retryAfterSeconds,
        status.count,
        RATE_LIMIT_CONFIG.AUTH_MAX_ATTEMPTS,
      );
    }
  }
}

/**
 * 認証成功時にレート制限カウンターをリセット
 *
 * @param identifier - ユーザーID
 *
 * @example
 * // ログイン成功後
 * await resetAuthRateLimit(userId);
 */
export async function resetAuthRateLimit(identifier: string): Promise<void> {
  resetRateLimit(identifier);
}

/**
 * 認証試行ログ適応版: レート制限と試行カウント
 *
 * @description
 * 失敗試行やレート制限のキック情報を外部ログシステムに送信
 * 本番環境では CloudWatch, Sentry, DataDog などに送信
 */
export async function logAuthAttempt(
  identifier: string,
  success: boolean,
  provider: string,
  errorReason?: string,
): Promise<void> {
  const timestamp = new Date().toISOString();
  const status = getRateLimitStatus(identifier);

  const logEntry = {
    timestamp,
    identifier: "***" + identifier.slice(-4), // マスク
    success,
    provider,
    errorReason,
    rateLimitStatus: status
      ? {
          count: status.count,
          resetAfterSeconds: Math.ceil((status.resetTime - Date.now()) / 1000),
        }
      : null,
  };

  // ローカル環境: コンソール出力
  if (process.env.NODE_ENV === "development") {
    console.log("[Auth Log]", JSON.stringify(logEntry, null, 2));
  }

  // 本番環境: 外部ログシステムに送信
  // TODO: Sentry, CloudWatch, DataDog などに統合
  // if (process.env.NODE_ENV === 'production') {
  //   await externalLogger.log(logEntry);
  // }
}
