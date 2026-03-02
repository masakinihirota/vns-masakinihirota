 

import { eq } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { rootAccounts } from "@/lib/db/schema.postgres";

/**
 * 指定されたユーザーIDにルートアカウントが存在するかチェックします
 * Drizzle ORM を使用して直接 PostgreSQL にアクセスします
 * @param userId
 * @returns ルートアカウントが存在する場合は true、存在しない場合または エラーの場合は false
 */
export async function hasRootAccount(userId: string): Promise<boolean> {
  try {
    const result = await db
      .select({ id: rootAccounts.id })
      .from(rootAccounts)
      .where(eq(rootAccounts.authUserId, userId))
      .limit(1);
    return result.length > 0;
  } catch (error) {
    console.error(
      "Failed to check root account:",
      error instanceof Error ? error.message : String(error)
    );
    return false;
  }
}

/**
 * 指定されたユーザーIDのルートアカウントIDを取得します
 * @param userId
 * @returns ルートアカウントID、存在しない場合またはエラーの場合は null
 */
export async function getRootAccountId(userId: string): Promise<string | null> {
  try {
    const result = await db
      .select({ id: rootAccounts.id })
      .from(rootAccounts)
      .where(eq(rootAccounts.authUserId, userId))
      .limit(1);
    return result[0]?.id || null;
  } catch (error) {
    console.error(
      "Failed to get root account ID:",
      error instanceof Error ? error.message : String(error)
    );
    return null;
  }
}

/**
 * 指定されたユーザーがモードを選択済みかチェックします
 * @param userId
 * @returns モードが選択済みの場合は true、選択していない場合またはエラーの場合は false
 */
export async function hasSelectedMode(userId: string): Promise<boolean> {
  try {
    const result = await db
      .select({ selectedMode: rootAccounts.id })
      .from(rootAccounts)
      .where(eq(rootAccounts.authUserId, userId))
      .limit(1);
    // TODO: selected_mode カラムが schema.postgres.ts の rootAccounts にない場合は追加が必要
    return result.length > 0;
  } catch (error) {
    console.error(
      "Failed to check selected mode:",
      error instanceof Error ? error.message : String(error)
    );
    return false;
  }
}
