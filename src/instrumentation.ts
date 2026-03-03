/**
 * Next.js Instrumentation Hook
 *
 * アプリケーション起動時に実行されるサーバー側の初期化処理。
 * この関数はサーバー起動時に一度だけ実行されます。
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

import { logger } from '@/lib/logger';

export async function register() {
  // 環境変数の検証
  const requiredEnvVars = ['DATABASE_URL'];
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    // 本番環境では OAuth 認証情報が必須
    requiredEnvVars.push(
      'GOOGLE_CLIENT_ID',
      'GOOGLE_CLIENT_SECRET',
      'GITHUB_CLIENT_ID',
      'GITHUB_CLIENT_SECRET',
      'BETTER_AUTH_SECRET',
      'BETTER_AUTH_URL'
    );
  }

  const missingEnvVars = requiredEnvVars.filter(key => !process.env[key]);

  if (missingEnvVars.length > 0) {
    const message = `必須の環境変数が設定されていません: ${missingEnvVars.join(', ')}`;
    logger.error(message);

    // 本番環境ではエラーをスロー
    if (isProduction) {
      throw new Error(message);
    }

    // 開発環境では警告を出力（ダミー認証を使用するため）
    logger.warn(message);
  }

  // 本番環境では USE_REAL_AUTH が真である必要がある
  if (isProduction && process.env.USE_REAL_AUTH !== 'true') {
    const message =
      '本番環境では USE_REAL_AUTH=true を設定してください。ダミー認証は本番環境では使用できません。';
    logger.error(message);
    throw new Error(message);
  }

  logger.info('サーバー初期化検証完了', {
    nodeEnv: process.env.NODE_ENV,
    useRealAuth: process.env.USE_REAL_AUTH,
  });
}
