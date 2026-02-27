import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { ROUTES, PUBLIC_PATHS } from "@/config/routes";
import { createDummySession } from "@/lib/dev-auth";

// 環境変数で郸覚を制御
const DEBUG_LOGGING = process.env.PROXY_DEBUG === 'true';
const USE_REAL_AUTH = process.env.NEXT_PUBLIC_USE_REAL_AUTH === 'true';

/**
 * 条件付きログ出力関数
 * @param level - ログレベル
 * @param message - メッセージ
 * @param data - 追加データ（PIIを含む可能性があるため本番では出力しない）
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
 * 全ルートで認証・認可チェックを実施
 *
 * @description
 * 開発モード: NEXT_PUBLIC_USE_REAL_AUTH=false でダミー認証を使用
 * 本番モード: NEXT_PUBLIC_USE_REAL_AUTH=true で OAuth認証を使用
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  const isLandingPath = pathname === ROUTES.LANDING;
  const isAdminPath = pathname.startsWith(ROUTES.ADMIN);

  let session = null;

  // 開発時ダミー認証
  if (!USE_REAL_AUTH && process.env.NODE_ENV === "development") {
    session = createDummySession("user");
    log('warn', '🔓 MOCK AUTH: Using dummy user', { user: session.user.email });
  } else {
    // 本番モード: Better Auth で認証
    try {
      session = await auth.api.getSession({
        headers: await headers(),
      });
    } catch (error) {
      log('error', 'Session retrieval failed');
      if (!isPublicPath && !isLandingPath) {
        log('warn', 'Redirecting to landing due to session error', { path: pathname });
        return NextResponse.redirect(new URL(ROUTES.LANDING, request.url));
      }
    }
  }

  // ケース1: ランディングページへのアクセス
  if (isLandingPath) {
    return NextResponse.next();
  }

  // ケース2：ログイン済み ＋ ログイン・登録系ページにアクセス（逆流防止）
  if (session && isPublicPath) {
    log('info', 'Authenticated user accessing public path, redirecting to /home', { path: pathname });
    return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
  }

  // ケース3：未ログイン ＋ 保護されたパスにアクセス
  if (!session && !isPublicPath) {
    log('info', 'Unauthenticated user accessing protected path, redirecting to /', { path: pathname });
    return NextResponse.redirect(new URL(ROUTES.LANDING, request.url));
  }

  // ケース4：Admin専用パス ＋ 管理者以外がアクセス
  if (isAdminPath && session?.user?.role !== "admin") {
    log('warn', 'Unauthorized admin access attempt', { path: pathname });
    return NextResponse.redirect(new URL(ROUTES.LANDING, request.url));
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
