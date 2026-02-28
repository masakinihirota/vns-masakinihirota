/**
 * Server Action 認証ラッパー
 *
 * このモジュールは Server Action に認証チェックを追加するための
 * Higher-Order Function を提供します。
 *
 * @design
 * - "use server" ファイルから分離して、Next.js の Server Action 検出を回避
 * - 各 Server Action 内で "use server" を個別に宣言
 *
 * @example
 * import { withAuth } from '@/lib/auth/with-auth';
 * import type { AuthSession } from '@/lib/auth/rbac-helper';
 *
 * const myAction = withAuth(async (session: AuthSession, data: string) => {
 *   'use server';
 *   // session は常に存在することが保証される
 *   return { userId: session.user.id, data };
 * });
 */

export interface AuthSession {
  user: {
    id: string;
    email: string | null;
    name: string | null;
    role: string | null;
  };
  session: {
    id: string;
    expiresAt: Date;
  };
}

/**
 * Server Action に認証チェックを追加する Higher-Order Function
 *
 * @param handler - セッションを第1引数に受け取る Server Action ハンドラー
 * @returns セッション検証済みの Server Action
 *
 * @example
 * const myAction = withAuth(async (session, input) => {
 *   'use server';
 *   // セッションは常に存在
 *   console.log(session.user.id);
 *   return { success: true };
 * });
 *
 * @design
 * - Server Action のパラメータとして session を受け取ることを想定
 * - caller 側で session を渡すことで、認証チェックを実装
 * - handler 内で追加的な権限チェックを実施
 * -  例：セッション検証 + グループロール + 追加のビジネスロジックチェック
 */
export const withAuth = <T extends (...args: any[]) => Promise<any>>(
  handler: (session: AuthSession, ...args: Parameters<T>) => ReturnType<T>,
) => {
  return async (session: AuthSession | null, ...args: Parameters<T>) => {
    // セッション検証
    if (!session || !session.user || !session.user.id) {
      throw new Error("SESSION_REQUIRED: Authentication needed");
    }

    // ハンドラー実行
    return await handler(session, ...args);
  };
};
