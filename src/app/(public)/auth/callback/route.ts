import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      // redirect user to specified redirect URL or root of app
      const validNext = next.startsWith("/") ? next : "/";
      return NextResponse.redirect(new URL(validNext, request.url));
    }
  }

  // Authorizatoin Code Flow (for OAuth)
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const validNext = next.startsWith("/") ? next : "/";
      return NextResponse.redirect(new URL(validNext, request.url));
    }
  }

  // return the user to an error page with some instructions
  return NextResponse.redirect(new URL("/auth/auth-code-error", request.url));
}
