import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import * as schema from "@/lib/db/schema.postgres";
import { eq } from "drizzle-orm";

/**
 * 全認証方法を一括削除するカスタムログアウトエンドポイント
 *
 * 以下の処理を実行します：
 * 1. 現在のセッションを取得
 * 2. ユーザーの全セッション削除（cascadeで auth_methods も削除）
 * 3. クッキーをクリア
 * 4. localStorage はクライアント側で保持
 */
export async function POST(req: NextRequest) {
  try {
    // セッション取得
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "セッションが見つかりません" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    console.log(`[SignOut] User logout initiated: ${userId}`);

    // ユーザーの全セッションを取得
    const userSessions = await db.query.sessions.findMany({
      where: eq(schema.sessions.userId, userId),
    });

    console.log(`[SignOut] Found ${userSessions.length} sessions for user ${userId}`);

    // sessions テーブルから削除（cascade で user_auth_methods も削除）
    if (userSessions.length > 0) {
      await db.delete(schema.sessions).where(
        eq(schema.sessions.userId, userId)
      );
      console.log(`[SignOut] Deleted all sessions for user ${userId}`);
    }

    // user_auth_methods から念のため削除（cascade の確認）
    try {
      const deletedAuthMethods = await db.delete(schema.userAuthMethods).where(
        eq(schema.userAuthMethods.userId, userId)
      ).returning();
      console.log(
        `[SignOut] Deleted ${deletedAuthMethods.length} auth method records for user ${userId}`
      );
    } catch (error) {
      console.warn(
        `[SignOut] Warning deleting auth methods: ${error instanceof Error ? error.message : String(error)}`
      );
      // エラーでも続行
    }

    // Success レスポンス
    const response = NextResponse.json(
      {
        success: true,
        message: "全認証方法が削除されました。ブラウザストレージは保持されています。",
      },
      { status: 200 }
    );

    // クッキークリア（複数の認証関連クッキーをクリア）
    response.cookies.delete("better-auth.session_token");
    response.cookies.delete("authjs.session-token");
    response.cookies.set("better-auth.session_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // 即座に有効期限切れ
      path: "/",
    });

    console.log(`[SignOut] Logout completed for user ${userId}`);

    return response;
  } catch (error) {
    console.error(
      "[SignOut] Error:",
      error instanceof Error ? error.message : String(error)
    );
    return NextResponse.json(
      {
        error: "ログアウトに失敗しました",
        details: error instanceof Error ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
