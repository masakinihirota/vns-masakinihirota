import { auth } from "@/lib/auth";
import { hasRootAccount } from "@/lib/auth/root-account-guard";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

/**
 * OAuth コールバックルート（Better-Auth 対応版）
 *
 * Better-Auth の [...all] ハンドラーが OAuth フローの大部分を処理しますが、
 * ログイン後のルートアカウント確認とリダイレクト制御はここで行います。
 *
 * ※ Better-Auth の OAuth コールバック先が /api/auth/callback/* のため、
 *   このルートは「ログイン成功後のアプリ側リダイレクト先」として使用されます。
 */

/**
 * ルートアカウントの有無を確認し、適切なリダイレクト先を返す
 */
async function getRedirectUrl(
  request: NextRequest,
  userId: string,
  fallback: string
): Promise<URL> {
  const hasRoot = await hasRootAccount(userId);
  if (!hasRoot) {
    // ルートアカウントがない場合 → オンボーディングへ
    return new URL("/onboarding/choice", request.url);
  }
  // ルートアカウントがある場合 → 指定されたURLまたはホームへ
  return new URL(fallback, request.url);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const next = searchParams.get("next") ?? "/home";

  // Better-Auth からセッションを取得
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    // セッションがない場合 → エラーページへ
    return NextResponse.redirect(
      new URL("/auth/auth-code-error", request.url)
    );
  }

  // ルートアカウントのチェック & リダイレクト
  const redirectUrl = await getRedirectUrl(
    request,
    session.user.id,
    next.startsWith("/") ? next : "/home"
  );
  return NextResponse.redirect(redirectUrl);
}
