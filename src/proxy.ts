import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. パスの定義
  const publicPaths = ["/login", "/signup"];
  const landingPath = "/"; // ランディングページ（認証不要）
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  const isLandingPath = pathname === landingPath;
  const isAdminPath = pathname.startsWith("/admin");

  // 2. セッションの取得（Better Authによる厳密な検証）
  let session = null;
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    console.error("[Middleware] Session retrieval failed:", error);
    // セッション取得エラー時は未認証として扱う
    if (!isPublicPath && !isLandingPath) {
      console.warn("[Middleware] Redirecting to landing due to session error:", {
        path: pathname,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // -------------------------------------------------------------
  // パターンの分岐
  // -------------------------------------------------------------

  // ケース1: ランディングページへのアクセス（認証状態に関わらずアクセス可能）
  if (isLandingPath) {
    return NextResponse.next();
  }

  // ケース2：ログイン済み ＋ ログイン・登録系ページにアクセスしようとした（逆流防止）
  if (session && isPublicPath) {
    console.log("[Middleware] Authenticated user accessing public path, redirecting to /home:", {
      userId: session.user?.id,
      path: pathname,
    });
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // ケース3：未ログイン ＋ 保護されたパスにアクセスしようとした
  if (!session && !isPublicPath) {
    console.log("[Middleware] Unauthenticated user accessing protected path, redirecting to /:", {
      path: pathname,
    });
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ケース4：【認可判定】Admin専用パス ＋ 管理者以外がアクセス
  // ロールが 'admin' と完全一致しない場合はすべて拒否（フェイルセーフ）
  if (isAdminPath && session?.user?.role !== "admin") {
    console.warn("[Middleware] Unauthorized admin access attempt:", {
      path: pathname,
      userId: session?.user?.id,
      userRole: session?.user?.role,
    });
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  /*
   * 以下のパス以外すべてに proxy を適用する:
   * 1. api (API routes)
   * 2. _next/static (static files)
   * 3. _next/image (image optimization files)
   * 4. favicon.ico, sitemap.xml, robots.txt (metadata files)
   */
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
