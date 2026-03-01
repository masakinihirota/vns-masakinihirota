/**
 * レート制限実装 - メモリベース
 *
 * Better Auth v1.4.19 では rateLimit プラグイン非対応のため、
 * シンプルなメモリベースのレート制限を実装
 *
 * @design
 * - キー: ユーザーID or IPアドレス
 * - ウィンドウ: 1分間
 * - しきい値: 5回の失敗試行
 * - リセット: 1分経過で自動リセット
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

/**
 * メモリ内レート制限ストア
 * 本番環境では Redis または Memcached を推奨
 */
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * レート制限設定
 */
export const RATE_LIMIT_CONFIG = {
  // 認証エンドポイント: 1分間に5回まで
  AUTH_MAX_ATTEMPTS: 5,
  AUTH_WINDOW_MS: 60 * 1000, // 1分間

  // API リクエスト: 1分間に10回まで
  API_MAX_ATTEMPTS: 10,
  API_WINDOW_MS: 60 * 1000,

  // クリーンアップ: 5分ごとに古いエントリを削除
  CLEANUP_INTERVAL_MS: 5 * 60 * 1000,
};

/**
 * レート制限をチェック
 *
 * @param key - ユーザー ID または IP アドレス
 * @param maxAttempts - 許可される最大試行回数
 * @param windowMs - タイムウィンドウ (ミリ秒)
 * @returns true: 制限内 | false: 制限超過
 *
 * @example
 * const canAttempt = checkRateLimit(userId, 5, 60000);
 * if (!canAttempt) {
 *   throw new Error('429: Too many requests. Try again later');
 * }
 */
export function checkRateLimit(
  key: string,
  maxAttempts: number = RATE_LIMIT_CONFIG.AUTH_MAX_ATTEMPTS,
  windowMs: number = RATE_LIMIT_CONFIG.AUTH_WINDOW_MS,
): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  // 新規キー または ウィンドウ期限切れ
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, {
      count: 1, // 最初の試行をカウント
      resetTime: now + windowMs,
    });
    return true; // 許可
  }

  // ウィンドウ内: カウント増加
  entry.count++;

  // しきい値チェック
  if (entry.count > maxAttempts) {
    return false; // 制限超過
  }

  return true; // 許可
}

/**
 * 認証成功時にレート制限カウンターをリセット
 *
 * @param key - ユーザー ID
 *
 * @example
 * // ログイン成功後
 * resetRateLimit(userId);
 */
export function resetRateLimit(key: string): void {
  rateLimitStore.delete(key);
}

/**
 * レート制限カウンターを取得 (テスト用)
 *
 * @param key - ユーザー ID
 * @returns {count, resetTime} または null
 */
export function getRateLimitStatus(key: string): RateLimitEntry | null {
  return rateLimitStore.get(key) || null;
}

/**
 * メモリストアの定期クリーンアップ
 * 期限切れエントリを削除して、メモリリークを防止
 *
 * @description
 * サーバー起動時に1回実行され、定期的に古いエントリを削除します
 */
export function startRateLimitCleanup(): void {
  setInterval(() => {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of rateLimitStore.entries()) {
      if (now > entry.resetTime) {
        rateLimitStore.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(
        `[Rate Limit Cleanup] Removed ${cleaned} expired entries from store`
      );
    }
  }, RATE_LIMIT_CONFIG.CLEANUP_INTERVAL_MS);
}

/**
 * テスト用: ストアをクリア
 */
export function clearRateLimitStore(): void {
  rateLimitStore.clear();
}
