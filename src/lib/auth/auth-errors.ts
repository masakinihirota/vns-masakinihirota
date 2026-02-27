/**
 * 認証エラーのタイプ定義とユーザーフレンドリーなメッセージ生成
 */

export type AuthErrorType =
  | "network"
  | "server"
  | "unauthorized"
  | "validation"
  | "unknown";

export interface AuthErrorInfo {
  type: AuthErrorType;
  message: string;
  recoverySteps: string[];
}

/**
 * エラーの種類を判定
 */
export function categorizeError(error: unknown): AuthErrorType {
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return "network";
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (message.includes("network") || message.includes("offline")) {
      return "network";
    }

    if (message.includes("unauthorized") || message.includes("認証")) {
      return "unauthorized";
    }

    if (message.includes("validation") || message.includes("検証")) {
      return "validation";
    }

    if (message.includes("server") || message.includes("500")) {
      return "server";
    }
  }

  return "unknown";
}

/**
 * OAuth認証エラーの詳細情報を取得
 */
export function getOAuthErrorInfo(
  error: unknown,
  provider: "google" | "github"
): AuthErrorInfo {
  const errorType = categorizeError(error);
  const providerName = provider === "google" ? "Google" : "GitHub";

  const errorMessages: Record<AuthErrorType, AuthErrorInfo> = {
    network: {
      type: "network",
      message: `ネットワーク接続の問題が発生しました。インターネット接続を確認してください。`,
      recoverySteps: [
        "インターネット接続を確認してください",
        "VPNを使用している場合は一時的に無効にしてみてください",
        "しばらく待ってから再度お試しください",
      ],
    },
    server: {
      type: "server",
      message: `${providerName}認証サービスに一時的な問題が発生しています。`,
      recoverySteps: [
        "しばらく待ってから再度お試しください",
        "問題が解決しない場合は、別の認証方法をお試しください",
        "匿名ログインで体験することも可能です",
      ],
    },
    unauthorized: {
      type: "unauthorized",
      message: `${providerName}アカウントでの認証に失敗しました。`,
      recoverySteps: [
        `${providerName}アカウントにログインしているか確認してください`,
        "ブラウザのポップアップブロックを無効にしてください",
        "別のブラウザで試してみてください",
      ],
    },
    validation: {
      type: "validation",
      message: "入力された情報に問題があります。",
      recoverySteps: [
        "入力内容を確認してください",
        "ブラウザのキャッシュをクリアしてみてください",
      ],
    },
    unknown: {
      type: "unknown",
      message: `${providerName}認証でエラーが発生しました。`,
      recoverySteps: [
        "ページを再読み込みして再度お試しください",
        "問題が続く場合は、別の認証方法をお試しください",
        "匿名ログインで体験することも可能です",
      ],
    },
  };

  return errorMessages[errorType];
}

/**
 * 匿名認証エラーの詳細情報を取得
 */
export function getAnonymousErrorInfo(error: unknown): AuthErrorInfo {
  const errorType = categorizeError(error);

  const errorMessages: Record<AuthErrorType, AuthErrorInfo> = {
    network: {
      type: "network",
      message: "ネットワーク接続の問題が発生しました。",
      recoverySteps: [
        "インターネット接続を確認してください",
        "しばらく待ってから再度お試しください",
      ],
    },
    server: {
      type: "server",
      message: "サーバーに一時的な問題が発生しています。",
      recoverySteps: [
        "しばらく待ってから再度お試しください",
        "問題が解決しない場合は、Google/GitHub認証をお試しください",
      ],
    },
    unauthorized: {
      type: "unauthorized",
      message: "認証に失敗しました。",
      recoverySteps: [
        "ページを再読み込みして再度お試しください",
        "ブラウザのキャッシュとCookieをクリアしてみてください",
      ],
    },
    validation: {
      type: "validation",
      message: "ブラウザに保存されたデータの検証に失敗しました。",
      recoverySteps: [
        "ブラウザのローカルストレージをクリアしてください",
        "データが改ざんされている可能性があります",
        "新規でログインしてください",
      ],
    },
    unknown: {
      type: "unknown",
      message: "匿名ログインでエラーが発生しました。",
      recoverySteps: [
        "ページを再読み込みして再度お試しください",
        "Google/GitHub認証をお試しください",
      ],
    },
  };

  return errorMessages[errorType];
}

/**
 * エラー情報を文字列に変換
 */
export function formatErrorMessage(errorInfo: AuthErrorInfo): string {
  return `${errorInfo.message}\n\n対処方法:\n${errorInfo.recoverySteps.map((step, i) => `${i + 1}. ${step}`).join("\n")}`;
}

/**
 * Signature 検証エラーの詳細情報を取得
 */
export function getSignatureValidationErrorInfo(): AuthErrorInfo {
  return {
    type: "validation",
    message: "ブラウザに保存されたデータの署名検証に失敗しました。",
    recoverySteps: [
      "ブラウザのローカルストレージをクリアしてください",
      "新規でログインしてください",
    ],
  };
}
