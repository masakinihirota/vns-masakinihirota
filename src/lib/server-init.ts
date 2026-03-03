"use server";

import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

/**
 * サーバー起動時の必須チェック
 *
 * 本番環境と開発環境での環境変数検証を実行します。
 * - 本番環境: OAuth認証情報が必須、USE_REAL_AUTH=true必須
 * - 開発環境: チェックは緩和されるが、警告は出力
 *
 * @throws {Error} - 本番環境で必須の環境変数が不足している場合
 */
export function validateServerEnvironment(): void {
  const isProduction = env.isProduction;
  const useRealAuth = env.useRealAuth;

  logger.info("サーバー初期化検証開始", {
    nodeEnv: env.NODE_ENV,
    useRealAuth,
  });

  // ============================================================================
  // 本番環境での必須チェック
  // ============================================================================
  if (isProduction) {
    // OAuth認証情報の必須チェック
    const oauthRequiredEnvVars = [
      "GOOGLE_CLIENT_ID",
      "GOOGLE_CLIENT_SECRET",
      "GITHUB_CLIENT_ID",
      "GITHUB_CLIENT_SECRET",
    ];

    const missingOAuthVars = oauthRequiredEnvVars.filter(
      (key) => !env[key as keyof typeof env]
    );

    if (missingOAuthVars.length > 0) {
      const message = `本番環境で必須のOAuth認証情報が不足しています: ${missingOAuthVars.join(", ")}`;
      logger.error(message);
      throw new Error(message);
    }

    // Better Auth必須チェック
    const betterAuthVars = ["BETTER_AUTH_SECRET", "BETTER_AUTH_URL"];
    const missingAuthVars = betterAuthVars.filter(
      (key) => !env[key as keyof typeof env]
    );

    if (missingAuthVars.length > 0) {
      const message = `本番環境で必須のBetter Auth設定が不足しています: ${missingAuthVars.join(", ")}`;
      logger.error(message);
      throw new Error(message);
    }

    // 本番環境ではUSE_REAL_AUTH=true必須
    if (!useRealAuth) {
      const message =
        "本番環境ではUSE_REAL_AUTH=trueを設定してください。本番環境でダミー認証は使用できません。";
      logger.error(message);
      throw new Error(message);
    }

    logger.info("本番環境の環境変数検証: OK");
  }

  // ============================================================================
  // 開発環境での警告チェック
  // ============================================================================
  if (!isProduction) {
    const developmentOptionalVars = [
      "GOOGLE_CLIENT_ID",
      "GOOGLE_CLIENT_SECRET",
      "GITHUB_CLIENT_ID",
      "GITHUB_CLIENT_SECRET",
    ];

    const missingDevVars = developmentOptionalVars.filter(
      (key) => !env[key as keyof typeof env]
    );

    if (missingDevVars.length > 0) {
      logger.warn(
        "開発環境でのOAuth認証情報が不足しています。OAuth機能を使用する場合は設定してください",
        { missingVars: missingDevVars }
      );
    }

    if (!useRealAuth) {
      logger.info(
        "開発環境ではダミー認証を使用します（USE_REAL_AUTH=false）"
      );
    }
  }

  // ============================================================================
  // 共通の必須チェック
  // ============================================================================
  const commonRequiredVars = ["DATABASE_URL"];

  const missingCommonVars = commonRequiredVars.filter(
    (key) => !env[key as keyof typeof env]
  );

  if (missingCommonVars.length > 0) {
    const message = `環境変数が不足しています: ${missingCommonVars.join(", ")}`;
    logger.error(message);
    throw new Error(message);
  }

  logger.info("サーバー初期化検証: OK");
}

/**
 * アプリケーション起動時の初期化
 *
 * Next.jsアプリケーション起動時に一度だけ実行される初期化処理。
 * src/app/layout.tsxのサーバーコンポーネント内で呼び出し。
 */
let initialized = false;

export async function initializeApplication(): Promise<void> {
  if (initialized) return;

  try {
    validateServerEnvironment();
    initialized = true;
    logger.info("アプリケーション初期化: 成功");
  } catch (error) {
    logger.error("アプリケーション初期化: 失敗", undefined, {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}
