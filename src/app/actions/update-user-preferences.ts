"use server";

import { withAuth } from "@/lib/errors";
import { db } from "@/lib/db/client";
import { userPreferences } from "@/lib/db/schema.postgres";
import { logger } from "@/lib/logger";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * ユーザープリファレンス更新
 *
 * @design
 * - 認証必須（withAuth でラップ）
 * - 所有権検証: ユーザー本人のプリファレンスのみ更新可能
 * - 構造化ログで記録
 *
 * @security
 * - セッション検証: Better Auth
 * - 所有権検証: 必須
 */
export async function updateUserPreferences(
  data: {
    adsEnabled?: boolean;
    locale?: string;
    theme?: string;
  }
) {
  return withAuth(async (session) => {
    logger.debug("Updating user preferences", {
      userId: session.user.id,
      fields: Object.keys(data).filter((k) => data[k as keyof typeof data] !== undefined),
    });

    const userId = session.user.id;

    // Upsert equivalent in Drizzle
    const existing = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(userPreferences)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(userPreferences.userId, userId));
    } else {
      await db.insert(userPreferences).values({
        userId,
        adsEnabled: data.adsEnabled ?? true,
        locale: data.locale ?? "ja",
        theme: data.theme ?? "system",
      });
    }

    revalidatePath("/");
    logger.info("User preferences updated", {
      userId,
      timestamp: new Date().toISOString(),
    });

    return { success: true };
  }, {
    context: { action: "updateUserPreferences" },
  });
}

/**
 * ユーザープリファレンス取得
 *
 * @design
 * - 認証必須
 * - 所有権検証: ユーザー本人のプリファレンスのみ取得可能
 *
 * @security
 * - セッション検証: Better Auth
 * - 所有権検証: 必須
 */
export async function getUserPreferences() {
  return withAuth(async (session) => {
    logger.debug("Fetching user preferences", {
      userId: session.user.id,
    });

    const prefs = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, session.user.id))
      .limit(1);

    logger.debug("User preferences fetched", {
      userId: session.user.id,
      found: prefs.length > 0,
    });

    return prefs[0] || null;
  }, {
    context: { action: "getUserPreferences" },
  });
}
