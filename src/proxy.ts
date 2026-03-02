import { PUBLIC_PATHS, ROUTES, STATIC_PATHS } from "@/config/routes";
import { auth } from "@/lib/auth";
import { createDummySession } from "@/lib/dev-auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// 環境変数で制御
const DEBUG_LOGGING = process.env.PROXY_DEBUG === 'true';
const USE_REAL_AUTH = process.env.USE_REAL_AUTH === 'true';

/**
 * 本番環境でのセキュリティ検証
 */
function validateProductionAuth() {
  const isProduction = process.env.NODE_ENV === 'production';
  const hasSecret = !!process.env.BETTER_AUTH_SECRET;

  if (isProduction) {
    if (!USE_REAL_AUTH) {
      throw new Error(
        '[CRITICAL] Production environment must use real authentication. ' +
        'Set USE_REAL_AUTH=true in production environment variables.'
      );
    }
    if (!hasSecret) {
      throw new Error(
        '[CRITICAL] BETTER_AUTH_SECRET is required in production environment.'
      );
    }
  }
}

// 起動時にセキュリティ検証を実行
validateProductionAuth();

/**
 * 条件付きログ出力関数
 */
function log(level: 'info' | 'warn' | 'error', message: string, data?: Record<string, unknown>) {
  if (!DEBUG_LOGGING && level !== 'error') return;

  const timestamp = new Date().toISOString();
  const logData = data ? JSON.stringify(data) : '';

  switch (level) {
    case 'info':
      console.log(`[Proxy][${timestamp}] ${message}`, logData);
      break;
    case 'warn':
      console.warn(`[Proxy][${timestamp}] ${message}`, logData);
      break;
    case 'error':
      console.error(`[Proxy][${timestamp}] ${message}`);
      break;
  }
}

/**
 * Next.js 16 Proxy (旧 Middleware)
 * ルーティングと認証チェックを統合管理
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  const isStaticPath = STATIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  const isLandingPath = pathname === ROUTES.LANDING;

  let session = null;

  // 開発時ダミー認証（本番環境では禁止）
  if (!USE_REAL_AUTH && process.env.NODE_ENV === "development") {
    const dummyUserType = (process.env.DUMMY_USER_TYPE || "USER1") as 'USER1' | 'USER2' | 'USER3';
    session = createDummySession(dummyUserType);
    log('warn', `🔓 MOCK AUTH: Using dummy user (${dummyUserType})`, { user: session.user.email });
  } else {
    // 本番モード: Better Auth で認証
    try {
      session = await auth.api.getSession({
        headers: await headers(),
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      log('error', `[AUTH_ERROR] Session retrieval failed: ${errorMessage}`);

      // 保護されたパスへのアクセス時はランディングへリダイレクト
      if (!isPublicPath && !isLandingPath) {
        log('warn', `[REDIRECT_TO_LANDING] Unauthenticated access: ${pathname}`);
        return NextResponse.redirect(new URL(ROUTES.LANDING, request.url));
      }
    }
  }

  // ケース1: ランディングページへのアクセス
  if (isLandingPath) {
    return NextResponse.next();
  }

  // ケース1.5: 静的ページへのアクセス（認証不要）
  if (isStaticPath && !isLandingPath) {
    return NextResponse.next();
  }

  // ケース2：ログイン済み ＋ ログイン・登録系ページにアクセス（逆流防止）
  if (session && isPublicPath) {
    log('info', 'Authenticated user accessing public path, redirecting to /home', { path: pathname });
    return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
  }

  // ケース3：未ログイン ＋ 保護されたパスにアクセス
  if (!session && !isPublicPath) {
    log('warn', `[UNAUTHENTICATED_ACCESS] Protected path: ${pathname}`);
    return NextResponse.redirect(new URL(ROUTES.LANDING, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
