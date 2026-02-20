import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/session";

export async function proxy(request: NextRequest) {
  // [Technical Debt] Supabase Session Management
  // 現状、Supabase Auth と Better-Auth が共存しています。
  // Better-Auth への完全移行時には、この updateSession を Better-Auth の Middleware に置き換えるか、
  // 完全に削除してアプリケーション側でセッション管理を行う必要があります。
  // Ref: https://www.better-auth.com/docs/concepts/middleware
  const response = await updateSession(request);

  // Security Headers for /api/public
  if (request.nextUrl.pathname.startsWith("/api/public")) {
    response.headers.set("Cache-Control", "no-store, max-age=0");
  }

  // CORS for API (Allow Extension)
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const origin = request.headers.get("origin");
    // Chrome拡張機能からのリクエスト、またはローカル開発環境を許可
    if (
      origin &&
      (origin.startsWith("chrome-extension://") || origin.includes("localhost"))
    ) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      response.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      );
      response.headers.set("Access-Control-Allow-Credentials", "true");
    }

    // Preflight request handling
    if (request.method === "OPTIONS") {
      return new NextResponse(null, { status: 200, headers: response.headers });
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
