import { PUBLIC_PATHS, ROUTES, STATIC_PATHS } from "@/config/routes";
import { auth } from "@/lib/auth";
import { createDummySession } from "@/lib/dev-auth";
import { AuthenticationError } from "@/lib/errors";
import { generateRequestId, logger, runWithLogContext } from "@/lib/logger";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const USE_REAL_AUTH = process.env.USE_REAL_AUTH === "true";

const matchesRoute = (pathname: string, route: string) => {
  return pathname === route || pathname.startsWith(`${route}/`);
};

/**
 * Next.js 16 Proxy
 * ルーティングと認証チェックを統合管理（旧 Middleware）
 *
 * @security
 * - 本番環境では必ずUSE_REAL_AUTH=trueとBETTER_AUTH_SECRETが必要
 * - 認証失敗や権限外アクセスはセキュリティイベントとして記録
 */
export async function proxy(request: NextRequest) {
  // リクエストIDを生成してコンテキストに設定
  const requestId = generateRequestId();
  const { pathname } = request.nextUrl;
  const method = request.method;

  return await runWithLogContext(
    {
      requestId,
      path: pathname,
      method,
      userAgent: request.headers.get("user-agent") || undefined,
      ipAddress: request.headers.get("x-forwarded-for") || undefined,
    },
    async () => {
      // 本番環境のセキュリティ検証
      if (process.env.NODE_ENV === "production") {
        if (!USE_REAL_AUTH) {
          logger.fatal(
            "Production environment must use real authentication",
            new Error("USE_REAL_AUTH not set in production"),
            {
              event: "CRITICAL_CONFIG_MISSING",
              component: "proxy",
              severity: "critical",
              requiredConfig: "USE_REAL_AUTH",
              timestamp: new Date().toISOString(),
            }
          );
          throw new Error("Invalid server configuration");
        }
        if (!process.env.BETTER_AUTH_SECRET) {
          logger.fatal(
            "BETTER_AUTH_SECRET is required in production",
            new Error("BETTER_AUTH_SECRET not set"),
            {
              event: "CRITICAL_CONFIG_MISSING",
              component: "proxy",
              severity: "critical",
              requiredConfig: "BETTER_AUTH_SECRET",
              timestamp: new Date().toISOString(),
            }
          );
          throw new Error("Invalid server configuration");
        }
      }

      const isPublicPath = PUBLIC_PATHS.some((path) => matchesRoute(pathname, path));
      const isStaticPath = STATIC_PATHS.some((path) => matchesRoute(pathname, path));
      const isLandingPath = pathname === ROUTES.LANDING;

      logger.debug("Proxy request", {
        pathname,
        isPublicPath,
        isStaticPath,
        isLandingPath,
      });

      let session = null;

      // 開発時ダミー認証（本番環境では禁止）
      if (!USE_REAL_AUTH && process.env.NODE_ENV === "development") {
        const dummyUserType = (process.env.DUMMY_USER_TYPE || "USER1") as
          | "USER1"
          | "USER2"
          | "USER3";
        session = createDummySession(dummyUserType);
        logger.warn("Using mock authentication (development only)", {
          dummyUserType,
          userEmail: session.user.email,
          event: "DEV_MODE_AUTH",
          severity: "low",
        });
      } else {
        // 本番モード: Better Auth で認証
        try {
          session = await auth.api.getSession({
            headers: await headers(),
          });

          if (session) {
            logger.debug("Session retrieved successfully", {
              userId: session.user.id,
              userEmail: session.user.email,
              role: (session.user as any).role,
              event: "AUTH_SUCCESS",
            });
          }
        } catch (error) {
          const authError = new AuthenticationError(
            "Session retrieval failed",
            undefined,
            {
              originalError: error instanceof Error ? error.message : String(error),
              errorCode: error instanceof Error && (error as any).code ? (error as any).code : "UNKNOWN",
            }
          );

          logger.error(
            "Authentication retrieval failed",
            authError,
            {
              event: "AUTH_RETRIEVAL_ERROR",
              pathname,
              severity: "high",
              ip: request.headers.get("x-forwarded-for"),
              userAgent: request.headers.get("user-agent"),
              timestamp: new Date().toISOString(),
            }
          );

          // 保護されたパスへのアクセス時はランディングへリダイレクト
          if (!isPublicPath && !isLandingPath) {
            logger.warn(
              "Unauthenticated access attempt to protected path",
              {
                event: "UNAUTHENTICATED_ACCESS",
                pathname,
                severity: "medium",
                ip: request.headers.get("x-forwarded-for"),
                timestamp: new Date().toISOString(),
              }
            );
            return NextResponse.redirect(new URL(ROUTES.LANDING, request.url));
          }
        }
      }

      // ケース1: ランディングページへのアクセス
      if (isLandingPath) {
        logger.debug("Landing page access", { event: "LANDING_ACCESS" });
        return NextResponse.next();
      }

      // ケース1.5: 静的ページへのアクセス（認証不要）
      if (isStaticPath && !isLandingPath) {
        logger.debug("Static page access", {
          pathname,
          event: "STATIC_ACCESS",
        });
        return NextResponse.next();
      }

      // ケース2：ログイン済み ＋ ログイン・登録系ページにアクセス（逆流防止）
      if (session && isPublicPath) {
        logger.info("Authenticated user accessing public path, redirecting to /home", {
          pathname,
          userId: session.user.id,
          event: "REDIRECT_AUTHENTICATED_USER",
          timestamp: new Date().toISOString(),
        });
        return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
      }

      // ケース3：未ログイン ＋ 保護されたパスにアクセス
      if (!session && !isPublicPath) {
        logger.warn("Unauthenticated access to protected path", {
          event: "UNAUTHENTICATED_ACCESS",
          pathname,
          severity: "medium",
          timestamp: new Date().toISOString(),
        });
        return NextResponse.redirect(new URL(ROUTES.LANDING, request.url));
      }

      // 正常なアクセス
      logger.debug("Request authorized", {
        authenticated: !!session,
        userId: session?.user?.id,
      });
      return NextResponse.next();
    }
  );
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
