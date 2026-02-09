import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { hasRootAccount } from "@/lib/auth/root-account-guard";
import { createClient } from "@/lib/supabase/server";

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
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/home";

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      // ログイン成功 → ルートアカウントのチェック
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        return NextResponse.redirect(
          new URL("/auth/auth-code-error", request.url)
        );
      }

      const redirectUrl = await getRedirectUrl(
        request,
        user.id,
        next.startsWith("/") ? next : "/home"
      );
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Authorization Code Flow (for OAuth)
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // ログイン成功 → ルートアカウントのチェック
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        return NextResponse.redirect(
          new URL("/auth/auth-code-error", request.url)
        );
      }

      const redirectUrl = await getRedirectUrl(
        request,
        user.id,
        next.startsWith("/") ? next : "/home"
      );
      return NextResponse.redirect(redirectUrl);
    }
  }

  // return the user to an error page with some instructions
  return NextResponse.redirect(new URL("/auth/auth-code-error", request.url));
}
