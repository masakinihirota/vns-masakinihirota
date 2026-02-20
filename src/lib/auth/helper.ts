import { headers } from "next/headers";
import { auth as serverAuth } from "@/lib/auth";

/**
 * サーバーサイドで現在のセッション情報を取得します。
 * Better-Auth の `api.getSession` を使用します。
 *
 * @returns セッションオブジェクトとユーザーオブジェクトを含む Promise
 */
export const getSession = async () => {
  return await serverAuth.api.getSession({
    headers: await headers(),
  });
};

/**
 * 互換性のための auth エクスポート (getSession と同等)
 * @deprecated `getSession` を直接使用することを推奨します
 */
export const auth = getSession;

/**
 * 現在のユーザー情報を取得します。
 * セッションが存在しない場合は null を返します。
 *
 * @returns ユーザー情報 (User) または null
 */
export const getCurrentUser = async () => {
  const session = await getSession();
  return session?.user ?? null;
};
