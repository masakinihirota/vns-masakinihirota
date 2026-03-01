"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { rootAccounts, userProfiles } from "@/lib/db/schema.postgres";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

/**
 * rootAccount の存在確認
 * @param userId Better Auth の users.id (text)
 * @returns rootAccount が存在する場合 true, 存在しない場合 false
 */
export async function hasRootAccount(userId: string): Promise<boolean> {
  const result = await db
    .select({ id: rootAccounts.id })
    .from(rootAccounts)
    .where(eq(rootAccounts.authUserId, userId))
    .limit(1);

  return result.length > 0;
}

/**
 * rootAccount + 幽霊の仮面プロフィール作成
 *
 * @description
 * サインアップ完了時に呼び出される。
 * - rootAccount を作成（1ユーザーにつき1つ）
 * - 幽霊の仮面プロフィール（読み取り専用）を自動作成
 *
 * @param userId Better Auth の users.id (text)
 * @returns 成功時 { success: true, rootAccountId, ghostMaskProfileId }
 *          既に存在する場合 { success: false, message: 'Already exists' }
 *          エラー時 { success: false, message: error description }
 */
export async function setupRootAccount(userId: string): Promise<{
  success: boolean;
  rootAccountId?: string;
  ghostMaskProfileId?: string;
  message?: string;
}> {
  try {
    // 既に rootAccount が存在するか確認
    const existing = await db
      .select({ id: rootAccounts.id })
      .from(rootAccounts)
      .where(eq(rootAccounts.authUserId, userId))
      .limit(1);

    if (existing.length > 0) {
      return {
        success: false,
        message: `Root account already exists for user ${userId}`,
      };
    }

    // rootAccount を作成
    const newRootAccount = await db
      .insert(rootAccounts)
      .values({
        authUserId: userId,
        trustDays: 0,
      })
      .returning({ id: rootAccounts.id });

    if (!newRootAccount[0]) {
      return {
        success: false,
        message: "Failed to create root account",
      };
    }

    const rootAccountId = newRootAccount[0].id;

    // 幽霊の仮面プロフィール を自動作成
    const ghostMaskProfile = await db
      .insert(userProfiles)
      .values({
        rootAccountId: rootAccountId,
        displayName: "幽霊の仮面",
        purpose: "観測者プロフィール",
        roleType: "guest",
        isActive: true,
        maskCategory: "ghost", // 幽霊（観測者）ロール
        isDefault: true, // システム生成の幽霊マスク
        profileFormat: "profile",
        role: "guest",
        purposes: [],
        profileType: "system",
        points: 0, // 幽霊は初期ポイント0
        level: 1, // 初期レベル
      })
      .returning({ id: userProfiles.id });

    if (!ghostMaskProfile[0]) {
      return {
        success: false,
        message: "Failed to create ghost mask profile",
      };
    }

    return {
      success: true,
      rootAccountId,
      ghostMaskProfileId: ghostMaskProfile[0].id,
    };
  } catch (error) {
    console.error("setupRootAccount error:", error);
    return {
      success: false,
      message: `Setup failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

/**
 * OAuth 完了後にリダイレクト
 *
 * @description
 * Better Auth の OAuth フロー完了後、このページに遷移。
 * rootAccount が存在しない場合は作成し、/home へリダイレクト。
 */
export async function ensureRootAccountAndRedirect() {
  try {
    // 現在のセッションを取得
    const session = await auth.api.getSession({
      headers: {
        cookie: "",
      },
    } as any);

    if (!session?.user) {
      return { success: false, message: "No session found" };
    }

    const userId = session.user.id;

    // rootAccount を確認
    const exists = await hasRootAccount(userId);

    if (!exists) {
      // rootAccount を作成
      const result = await setupRootAccount(userId);
      if (!result.success) {
        return { success: false, message: result.message };
      }
    }

    // /home へリダイレクト
    redirect("/home");
  } catch (error) {
    console.error("ensureRootAccountAndRedirect error:", error);
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}
