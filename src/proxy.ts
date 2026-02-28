import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { ROUTES, PUBLIC_PATHS, STATIC_PATHS } from "@/config/routes";
import { createDummySession } from "@/lib/dev-auth";

// 環境変数で制御
const DEBUG_LOGGING = process.env.PROXY_DEBUG === 'true';
const USE_REAL_AUTH = process.env.USE_REAL_AUTH === 'true'; // 🔴 内部変数のみ使用（NEXT_PUBLIC_ 非公開）

/**
 * 本番環境でのセキュリティ検証
 *
 * @description
 * 本番環境ではダミー認証を使用することは許可されません。
 * これにより、意図しない認証無効化を防止します。
 *
 * @security
 * - 環境変数：USE_REAL_AUTH（内部のみ）
 * - BETTER_AUTH_SECRET が必ず設定されていることを確認
 * - NODE_ENV=production で自動検証
 */
function validateProductionAuth() {
  const isProduction = process.env.NODE_ENV === 'production';
  const hasSecret = !!process.env.BETTER_AUTH_SECRET;

  if (isProduction) {
    // ✅ 本番環境では必ず実認証を有効化
    if (!USE_REAL_AUTH) {
      throw new Error(
        '[CRITICAL] Production environment must use real authentication. ' +
        'Set USE_REAL_AUTH=true in production environment variables.'
      );
    }

    // ✅ BETTER_AUTH_SECRET が設定されていることを確認
    if (!hasSecret) {
      throw new Error(
        '[CRITICAL] BETTER_AUTH_SECRET is required in production environment. ' +
        'Configure it before starting the server.'
      );
    }
  }
}

// 起動時にセキュリティ検証を実行
validateProductionAuth();

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
 * ルーティングと認証チェックを実施
 *
 * @design
 * このプロキシの責務:
 * - ✅ 認証チェック（セッション有効性確認）
 * - ✅ ルーティング（public / protected path の振り分け）
 * - ✅ ログイン済みユーザーの逆流防止（/login へのアクセス回避）
 * - ✅ ロギング・監視
 * - ✅ セキュリティヘッダー制御
 *
 * 認可（ロール based アクセス制御）は Server Action でのみ実施
 * → Proxy での認可ロジック削除で矛盾を排除
 *
 * @description
 * 開発モード: USE_REAL_AUTH=false でダミー認証を使用
 * 本番モード: USE_REAL_AUTH=true で OAuth認証を使用（必須）
 *
 * @security
 * - 本番環境では USE_REAL_AUTH=true が必須
 * - BETTER_AUTH_SECRET が設定されていることを確認
 * - ダミー認証は開発環境のみで機能
 * - RBAC 認可は Server Action で実施（セキュリティ二重防御）
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  const isStaticPath = STATIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  const isLandingPath = pathname === ROUTES.LANDING;

  let session = null;

  // 開発時ダミー認証（本番環境では禁止）
  if (!USE_REAL_AUTH && process.env.NODE_ENV === "development") {
    // 環境変数で使用するテストユーザーを選択（デフォルト: USER1）
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
      const errorStack = error instanceof Error ? error.stack : undefined;

      log('error', `[AUTH_ERROR] Session retrieval failed: ${errorMessage}`);

      // 開発環境でのみスタックトレースを出力
      if (process.env.DEBUG_LOGGING === 'true' && errorStack) {
        console.error('[Proxy][Stack Trace]', errorStack);
      }

      // 保護されたパス（非公開・非ランディング）へのアクセス時はランディングへリダイレクト
      if (!isPublicPath && !isLandingPath) {
        log('warn', `[REDIRECT_TO_LANDING] Unauthenticated access to protected path: ${pathname}`);
        return NextResponse.redirect(new URL(ROUTES.LANDING, request.url));
      }
    }
  }

  // ケース1: ランディングページへのアクセス
  if (isLandingPath) {
    return NextResponse.next();
  }

  // ケース1.5: 静的ページ（FAQ、HELP）へのアクセス（認証不要）
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
    log('warn', `[UNAUTHENTICATED_ACCESS] Unauthenticated user accessing protected: ${pathname}`);
    return NextResponse.redirect(new URL(ROUTES.LANDING, request.url));
  }

  // 認可ロジック（ロール based アクセス制御）は Server Action で実施
  // → Proxy はルーティングと認証チェックのみ

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
