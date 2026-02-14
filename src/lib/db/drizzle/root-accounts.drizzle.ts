import { eq } from "drizzle-orm";
import { cache } from "react";
import { db } from "@/lib/drizzle/client";
import { rootAccounts } from "@/lib/drizzle/schema";
import { createClient } from "@/lib/supabase/server";
import type { RootAccount } from "../root-accounts";

/**
 * Drizzle版: 現在の認証ユーザーのRootAccountを取得する
 * react.cache() で同一リクエスト内のキャッシュを維持
 */
export const getRootAccountDrizzle = cache(
  async (): Promise<RootAccount | null> => {
    // 認証情報はSupabase Auth経由で取得（Drizzle移行対象外）
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const result = await db
      .select()
      .from(rootAccounts)
      .where(eq(rootAccounts.authUserId, user.id))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    // Drizzleのカラム名（camelCase）→ 既存型（snake_case）に変換
    const row = result[0];
    return {
      id: row.id,
      auth_user_id: row.authUserId,
      points: row.points,
      level: row.level,
      trust_days: row.trustDays,
      data_retention_days: row.dataRetentionDays,
      created_at: row.createdAt.toISOString(),
      updated_at: row.updatedAt.toISOString(),
    };
  }
);
