/**
 * Error Messages Dictionary
 *
 * @description
 * ユーザーフレンドリーなエラーメッセージ辞書
 * - IT用語を避けた平易な日本語
 * - 具体的な解決策の提示
 * - 感情に配慮した表現
 */

import { ErrorCode, ErrorCodes } from "./app-error";

export interface ErrorMessage {
  /** ユーザー向けメッセージ（平易な日本語） */
  userMessage: string;
  /** 技術的な詳細（開発者向け、ログ用） */
  technicalMessage: string;
  /** 推奨される解決策 */
  suggestion?: string;
  /** 詳細情報へのリンク */
  helpUrl?: string;
}

/**
 * エラーメッセージマップ
 */
export const ERROR_MESSAGES: Record<ErrorCode, ErrorMessage> = {
  // 認証エラー
  [ErrorCodes.AUTH_INVALID_CREDENTIALS]: {
    userMessage: "メールアドレスまたはパスワードが正しくありません",
    technicalMessage: "Invalid email or password provided",
    suggestion: "入力内容をご確認の上、もう一度お試しください",
  },
  [ErrorCodes.AUTH_SESSION_EXPIRED]: {
    userMessage: "ログイン状態の有効期限が切れました",
    technicalMessage: "Session has expired",
    suggestion: "もう一度ログインしてください",
  },
  [ErrorCodes.AUTH_TOKEN_INVALID]: {
    userMessage: "ログイン情報が無効です",
    technicalMessage: "Authentication token is invalid",
    suggestion: "ページを再読み込みしてもう一度お試しください",
  },
  [ErrorCodes.AUTH_OAUTH_FAILED]: {
    userMessage: "外部サービスでのログインに失敗しました",
    technicalMessage: "OAuth authentication failed",
    suggestion: "しばらく待ってから再度お試しいただくか、別の方法でログインしてください",
  },
  [ErrorCodes.AUTH_EMAIL_NOT_VERIFIED]: {
    userMessage: "メールアドレスの確認が完了していません",
    technicalMessage: "Email address not verified",
    suggestion: "送信された確認メールのリンクをクリックしてください",
  },

  // 認可エラー
  [ErrorCodes.AUTHZ_INSUFFICIENT_PERMISSIONS]: {
    userMessage: "この操作を行う権限がありません",
    technicalMessage: "Insufficient permissions",
    suggestion: "必要な権限がある場合は、管理者にお問い合わせください",
  },
  [ErrorCodes.AUTHZ_RESOURCE_FORBIDDEN]: {
    userMessage: "このページにはアクセスできません",
    technicalMessage: "Access to resource is forbidden",
    suggestion: "アカウントの設定をご確認いただくか、管理者にお問い合わせください",
  },
  [ErrorCodes.AUTHZ_ROLE_REQUIRED]: {
    userMessage: "この機能を使用するには特定の役割が必要です",
    technicalMessage: "Required role not assigned to user",
    suggestion: "管理者に役割の付与を依頼してください",
  },
  [ErrorCodes.AUTHZ_ADMIN_ONLY]: {
    userMessage: "管理者のみが利用できる機能です",
    technicalMessage: "Admin role required",
    suggestion: "一般ユーザーはこの機能を利用できません",
  },

  // バリデーションエラー
  [ErrorCodes.VALIDATION_INVALID_INPUT]: {
    userMessage: "入力内容に誤りがあります",
    technicalMessage: "Invalid input provided",
    suggestion: "赤く表示されている項目をご確認ください",
  },
  [ErrorCodes.VALIDATION_REQUIRED_FIELD]: {
    userMessage: "必須項目が入力されていません",
    technicalMessage: "Required field is missing",
    suggestion: "すべての必須項目に入力してください",
  },
  [ErrorCodes.VALIDATION_INVALID_FORMAT]: {
    userMessage: "入力形式が正しくありません",
    technicalMessage: "Invalid format",
    suggestion: "入力例を参考に、正しい形式で入力してください",
  },
  [ErrorCodes.VALIDATION_OUT_OF_RANGE]: {
    userMessage: "入力値が範囲外です",
    technicalMessage: "Value out of acceptable range",
    suggestion: "許可された範囲内の値を入力してください",
  },

  // リソースエラー
  [ErrorCodes.RESOURCE_NOT_FOUND]: {
    userMessage: "お探しの情報が見つかりませんでした",
    technicalMessage: "Resource not found",
    suggestion: "URLが正しいかご確認いただくか、検索機能をお試しください",
  },
  [ErrorCodes.RESOURCE_ALREADY_EXISTS]: {
    userMessage: "すでに登録されています",
    technicalMessage: "Resource already exists",
    suggestion: "別の値でお試しいただくか、既存の情報をご利用ください",
  },
  [ErrorCodes.RESOURCE_CONFLICT]: {
    userMessage: "他の操作と競合しています",
    technicalMessage: "Resource conflict detected",
    suggestion: "ページを再読み込みして最新の状態を確認してください",
  },

  // データベースエラー
  [ErrorCodes.DB_CONNECTION_FAILED]: {
    userMessage: "データベースに接続できませんでした",
    technicalMessage: "Database connection failed",
    suggestion: "しばらく待ってから再度お試しください。問題が続く場合はサポートにご連絡ください",
  },
  [ErrorCodes.DB_QUERY_FAILED]: {
    userMessage: "データの取得に失敗しました",
    technicalMessage: "Database query failed",
    suggestion: "しばらく待ってから再度お試しください",
  },
  [ErrorCodes.DB_TRANSACTION_FAILED]: {
    userMessage: "処理の実行中に問題が発生しました",
    technicalMessage: "Database transaction failed",
    suggestion: "もう一度お試しください。問題が続く場合はサポートにご連絡ください",
  },
  [ErrorCodes.DB_CONSTRAINT_VIOLATION]: {
    userMessage: "データの整合性に問題があります",
    technicalMessage: "Database constraint violation",
    suggestion: "入力内容をご確認ください",
  },

  // 外部サービスエラー
  [ErrorCodes.EXTERNAL_SERVICE_UNAVAILABLE]: {
    userMessage: "外部サービスが一時的に利用できません",
    technicalMessage: "External service unavailable",
    suggestion: "しばらく待ってから再度お試しください",
  },
  [ErrorCodes.EXTERNAL_API_ERROR]: {
    userMessage: "外部サービスとの連携中にエラーが発生しました",
    technicalMessage: "External API error",
    suggestion: "時間をおいて再度お試しください",
  },
  [ErrorCodes.EXTERNAL_TIMEOUT]: {
    userMessage: "外部サービスからの応答に時間がかかりすぎています",
    technicalMessage: "External service timeout",
    suggestion: "ネットワーク環境をご確認の上、もう一度お試しください",
  },

  // システムエラー
  [ErrorCodes.SYSTEM_INTERNAL_ERROR]: {
    userMessage: "システムエラーが発生しました",
    technicalMessage: "Internal system error",
    suggestion: "申し訳ございません。この問題は記録されました。サポートにお問い合わせいただくか、しばらく待ってから再度お試しください",
  },
  [ErrorCodes.SYSTEM_NOT_IMPLEMENTED]: {
    userMessage: "この機能は現在準備中です",
    technicalMessage: "Feature not implemented",
    suggestion: "今しばらくお待ちください",
  },
  [ErrorCodes.SYSTEM_CONFIGURATION_ERROR]: {
    userMessage: "システム設定に問題があります",
    technicalMessage: "System configuration error",
    suggestion: "サポートにお問い合わせください",
  },
};

/**
 * エラーコードからユーザー向けメッセージを取得
 */
export function getUserMessage(code: ErrorCode): string {
  return ERROR_MESSAGES[code]?.userMessage || "予期しないエラーが発生しました";
}

/**
 * エラーコードから技術的なメッセージを取得
 */
export function getTechnicalMessage(code: ErrorCode): string {
  return ERROR_MESSAGES[code]?.technicalMessage || "Unknown error";
}

/**
 * エラーコードから解決策を取得
 */
export function getSuggestion(code: ErrorCode): string | undefined {
  return ERROR_MESSAGES[code]?.suggestion;
}

/**
 * 完全なエラーメッセージオブジェクトを取得
 */
export function getErrorMessage(code: ErrorCode): ErrorMessage {
  return (
    ERROR_MESSAGES[code] || {
      userMessage: "予期しないエラーが発生しました",
      technicalMessage: "Unknown error",
      suggestion: "もう一度お試しいただくか、サポートにお問い合わせください",
    }
  );
}
