import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import * as schema from "@/lib/db/schema.postgres";
import { v4 as uuidv4 } from "uuid";
import {
  verifyTrialData,
  validateTrialDataFull,
  isTimestampValid,
  validateDataLimits,
} from "@/lib/trial-signature";
import { VNSTrialData } from "@/lib/trial-storage";

const isDev = process.env.NODE_ENV !== "production";
const logInfo = (...args: unknown[]) => {
  if (isDev) {
    console.log(...args);
  }
};
const logWarn = (...args: unknown[]) => {
  if (isDev) {
    console.warn(...args);
  }
};
const logError = (...args: unknown[]) => {
  if (isDev) {
    console.error(...args);
  }
};

/**
 * 匿名ユーザー認証用カスタムエンドポイント
 * Better Auth の anonymous プラグインの代わりとして機能
 * localStorage データの署名検証を実行
 */
export async function POST(req: NextRequest) {
  try {
    // Request body のスキーマ検証
    const bodySchema = z.object({
      data: z.union([z.record(z.string(), z.any()), z.null()]).optional(),
      signature: z.union([z.string(), z.null()]).optional(),
      version: z.number().optional(),
    });

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "リクエストボディが無効です" },
        { status: 400 }
      );
    }

    const parsedBody = bodySchema.safeParse(body);
    if (!parsedBody.success) {
      logWarn("[Anonymous] Invalid request body:", parsedBody.error.issues);
      return NextResponse.json(
        { error: "リクエストボディが無効です", details: parsedBody.error.issues },
        { status: 400 }
      );
    }

    const { data, signature, version } = parsedBody.data;

    // 署名検証ロジック
    let validatedData: VNSTrialData | null = null;

    // データが存在する場合は署名も必須
    if (data && !signature) {
      logWarn("[Anonymous] データが存在するが署名がありません。セキュリティのためデータを無視します");
      // データは無視して新規ログインとして扱う
      validatedData = null;
    } else if (data && signature) {
      logInfo("[Anonymous] localStorage データの署名検証を実行");

      // 全検証を実行
      const validation = validateTrialDataFull(data as VNSTrialData, signature);
      if (!validation.valid) {
        logWarn("[Anonymous] 検証失敗:", validation.errors);
        return NextResponse.json(
          {
            error: "ブラウザのデータが検証に失敗しました。ローカルストレージをクリアして新規ログインしてください。",
          },
          { status: 400 }
        );
      }

      logInfo("[Anonymous] 署名検証完了、データは信頼できます");
      validatedData = data as VNSTrialData;
    }
    // それ以外（data も signature もない）は新規ログインとして扱う

    // ゲストユーザーID生成（予測不可能なUUID）
    const guestUserId = `anon-${randomUUID()}`;
    const guestEmail = `guest-${randomUUID()}@anonymous.local`;
    const now = new Date();

    // データベースに匿名ユーザーを作成
    const newUser = await db.insert(schema.users).values({
      id: guestUserId,
      name: `ゲスト (${now.toLocaleString("ja-JP")})`,
      email: guestEmail,
      emailVerified: true,
      image: null,
      role: "user",
      isAnonymous: true,
      createdAt: now,
      updatedAt: now,
    }).returning();

    if (!newUser || newUser.length === 0) {
      return NextResponse.json(
        { error: "ゲストアカウントの作成に失敗しました" },
        { status: 500 }
      );
    }

    const user = newUser[0];

    // root_accounts を作成
    const rootAccountId = uuidv4();
    // 検証済みデータがある場合のみポイントを復元、なければデフォルト値
    const pointsFromData = validatedData?.points?.current ?? 500;

    await db.insert(schema.rootAccounts).values({
      id: rootAccountId,
      authUserId: user.id,
      points: pointsFromData,
      level: 1,
      trustDays: 0,
      dataRetentionDays: 30,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });

    // セッションを作成
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7日間
    const sessionToken = randomUUID();

    logInfo(`[Anonymous] Creating session for user: ${user.id}`);

    const sessionData = await db.insert(schema.sessions).values({
      id: sessionToken,
      userId: user.id,
      token: sessionToken,
      expiresAt: expiresAt,
      createdAt: now,
      updatedAt: now,
      ipAddress: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown",
      userAgent: req.headers.get("user-agent") || undefined,
    }).returning();

    if (!sessionData || sessionData.length === 0) {
      logError("[Anonymous] Session creation failed");
      return NextResponse.json(
        { error: "セッション作成に失敗しました" },
        { status: 500 }
      );
    }

    const session = sessionData[0];

    // user_auth_methods に記録
    try {
      await db.insert(schema.userAuthMethods).values({
        id: uuidv4(),
        userId: user.id,
        authType: "anonymous",
        providerAccountId: null,
        sessionId: session.id,
        validatedAt: validatedData ? now.toISOString() : null,
        createdAt: now.toISOString(),
        lastUsedAt: now.toISOString(),
      });
      logInfo("[Anonymous] user_auth_methods に記録完了");
    } catch (error) {
      logError("[Anonymous] user_auth_methods 記録エラー:", error);
      // エラーでも続行(セッションは作成済み)
    }

    logInfo(`[Anonymous] Session created:`, {
      sessionId: session.id,
      token: session.token,
      expiresAt: session.expiresAt,
      userId: session.userId,
    });

    // Success - return JSON response instead of redirect
    const response = NextResponse.json(
      {
        success: true,
        user: { id: user.id, name: user.name },
        redirectURL: "/home",
        validated: validatedData !== null,
      },
      { status: 200 }
    );

    // Cookie に session token を設定
    response.cookies.set("better-auth.session_token", session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    console.log(`[Anonymous] Cookie set with token: ${session.token}`);

    return response;
  } catch (error) {
    console.error("[Anonymous] Error:", error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { error: "認証に失敗しました", details: error instanceof Error ? error.message : undefined },
      { status: 500 }
    );
  }
}

