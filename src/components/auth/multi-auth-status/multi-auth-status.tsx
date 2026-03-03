import React from "react";
import { getSession } from "@/lib/auth/helper";
import { getAuthState } from "@/lib/auth/auth-hierarchy";

/**
 * ユーザーの認証状態を表示するコンポーネント
 *
 * 複数の認証方法を持つユーザーの場合、以下を表示：
 * - 主要な認証方法（OAuth or 匿名）
 * - 利用可能な認証方法のバッジ
 * - 署名検証ステータス（匿名用）
 */
interface MultiAuthStatusProps {
  className?: string;
  showBadges?: boolean;
}

export async function MultiAuthStatus({
  className = "",
  showBadges = true,
}: MultiAuthStatusProps) {
  const session = await getSession();

  if (!session?.user) {
    return null;
  }

  const authState = await getAuthState(session.user.id);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Primary Auth Type */}
      <div className="text-xs font-medium text-gray-500">
        認証: <span className="text-gray-700">{getAuthLabel(authState.primaryAuthType)}</span>
      </div>

      {/* Auth Method Badges */}
      {showBadges && (
        <div className="flex gap-1">
          {authState.hasOAuth && (
            <span className="inline-block px-1.5 py-0.5 text-xs font-medium text-white bg-blue-500 rounded">
              OAuth
            </span>
          )}
          {authState.hasAnonymous && (
            <span className="inline-block px-1.5 py-0.5 text-xs font-medium text-white bg-gray-400 rounded">
              匿名
            </span>
          )}
        </div>
      )}

      {/* Warning for multiple auth methods */}
      {authState.hasOAuth && authState.hasAnonymous && (
        <div className="text-xs text-orange-600" title="複数の認証方法が登録されています。ログアウトで全削除されます。">
          ⚠️ 複数認証
        </div>
      )}
    </div>
  );
}

/**
 * 認証タイプのラベルを取得
 */
function getAuthLabel(authType: string | null): string {
  const labels: Record<string, string> = {
    google: "Google",
    github: "GitHub",
    anonymous: "匿名",
  };
  return labels[authType || ""] || "不明";
}

/**
 * localStorage のデータ署名ステータスを表示
 */
export function LocalStorageSignatureStatus({
  validated,
  className = "",
}: {
  validated: boolean;
  className?: string;
}) {
  if (!validated) {
    return null;
  }

  return (
    <div
      className={`inline-block px-2 py-1 text-xs font-medium text-white bg-green-500 rounded ${className}`}
      title="ブラウザのデータが署名検証されました"
    >
      ✓ 署名検証済み
    </div>
  );
}

/**
 * 複数認証状態の詳細情報パネル
 */
interface MultiAuthDetailsPanelProps {
  authMethods?: Array<{
    authType: string;
    createdAt: string;
    lastUsedAt: string;
    validatedAt?: string | null;
  }>;
}

export function MultiAuthDetailsPanel({ authMethods }: MultiAuthDetailsPanelProps) {
  if (!authMethods || authMethods.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">
        登録済み認証方法 ({authMethods.length})
      </h3>

      <ul className="space-y-2">
        {authMethods.map((method, idx) => (
          <li key={idx} className="text-xs text-gray-600">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-medium text-gray-900">{getAuthLabel(method.authType)}</span>
                {method.validatedAt && (
                  <span className="ml-2 text-green-600">✓ 署名検証済み</span>
                )}
              </div>
              <time className="text-gray-400 text-xs">
                {new Date(method.lastUsedAt).toLocaleString("ja-JP")}
              </time>
            </div>
            <div className="text-gray-400">
              登録: {new Date(method.createdAt).toLocaleString("ja-JP")}
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
        💡 ログアウトを実行すると、全ての認証方法が削除されます。
        <br />
        ただし、ブラウザのローカルストレージは保持されます。
      </div>
    </div>
  );
}
