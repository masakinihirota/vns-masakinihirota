/**
 * CSRF Protection Middleware
 *
 * @description
 * - OriginヘッダーとRefererヘッダーを検証してCSRF攻撃を防止
 * - POSTリクエストを中心にチェック（GETは冪等性により影響が軽微）
 * - 環境変数で信頼できるオリジンを管理
 *
 * @security
 * - 本番環境では必ず TRUSTED_ORIGINS を設定すること
 * - OAuth コールバックなど、外部からのリクエストを受け付けるエンドポイントには適用しない
 */

import type { MiddlewareHandler } from 'hono';
import { createApiError } from './error-handler';
import { env } from '@/lib/env';
import { logger } from '@/lib/logger';

/**
 * 信頼できるオリジンのリストを取得
 *
 * @returns 環境変数 TRUSTED_ORIGINS から取得したオリジンのリスト
 */
function getTrustedOrigins(): string[] {
  return env.trustedOrigins;
}

/**
 * CSRF トークン検証ミドルウェア
 *
 * @description
 * - Origin ヘッダーまたは Referer ヘッダーが信頼できるオリジンと一致するか検証
 * - POST/PATCH/DELETE などの state-mutating 操作で必須
 *
 * @example
 * admin.use('/*', validateCsrfToken);
 * admin.post('/users', requirePlatformAdmin, async (c) => { ... });
 */
export const validateCsrfToken: MiddlewareHandler = async (c, next) => {
  const method = c.req.method;

  // GET/HEAD/OPTIONS は CSRF の影響を受けにくいためスキップ
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    await next();
    return;
  }

  const origin = c.req.header('origin');
  const referer = c.req.header('referer');
  const trustedOrigins = getTrustedOrigins();

  // Origin または Referer のどちらかが存在し、信頼できるオリジンに含まれているか検証
  const requestOrigin = origin || (referer ? new URL(referer).origin : null);

  if (!requestOrigin) {
    // Origin も Referer もない場合は拒否
    logger.warn('[CSRF] Request blocked: No origin or referer header', {
      method,
      path: c.req.path,
    });
    throw createApiError('FORBIDDEN', 'CSRF validation failed: Missing origin header');
  }

  // 信頼できるオリジンと一致するかチェック
  const isTrusted = trustedOrigins.some(trusted => requestOrigin.startsWith(trusted));

  if (!isTrusted) {
    logger.warn('[CSRF] Request blocked: Untrusted origin', {
      method,
      path: c.req.path,
      requestOrigin,
      trustedOrigins: env.NODE_ENV === 'development' ? trustedOrigins : '[REDACTED]',
    });
    throw createApiError('FORBIDDEN', 'CSRF validation failed: Untrusted origin');
  }

  // 検証成功
  await next();
};

/**
 * CSRF 検証をスキップするためのミドルウェア
 *
 * @description
 * - OAuth コールバックなど、外部からのリクエストを受け付けるエンドポイント用
 * - 使用する場合は、エンドポイント固有の認証・検証を必ず実装すること
 *
 * @example
 * app.post('/api/webhooks/stripe', skipCsrfValidation, async (c) => {
 *   // Stripe signature verification など、別の検証を実装
 * });
 */
export const skipCsrfValidation: MiddlewareHandler = async (c, next) => {
  await next();
};
