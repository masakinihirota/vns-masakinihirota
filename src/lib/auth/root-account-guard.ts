import { eq } from "drizzle-orm";
import { db } from "@/lib/db/drizzle-postgres";
import { rootAccounts } from "@/lib/db/schema.postgres";

/**
 * 指定されたユーザーIDにルートアカウントが存在するかチェックします
 * Drizzle ORM を使用して直接 PostgreSQL にアクセスします
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
 * 指定されたユーザーIDのルートアカウントIDを取得します
 * @returns ルートアカウントID、存在しない場合は null
 */
export async function getRootAccountId(userId: string): Promise<string | null> {
  const result = await db
    .select({ id: rootAccounts.id })
    .from(rootAccounts)
    .where(eq(rootAccounts.authUserId, userId))
    .limit(1);
  return result[0]?.id || null;
}

/**
 * 指定されたユーザーがモードを選択済みかチェックします
 */
export async function hasSelectedMode(userId: string): Promise<boolean> {
  const result = await db
    .select({ selectedMode: rootAccounts.id })
    .from(rootAccounts)
    .where(eq(rootAccounts.authUserId, userId))
    .limit(1);
  // TODO: selected_mode カラムが schema.postgres.ts の rootAccounts にない場合は追加が必要
  return result.length > 0;
}
