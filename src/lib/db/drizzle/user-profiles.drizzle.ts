import { db } from "@/lib/drizzle/client";
import { userProfiles } from "@/lib/drizzle/schema";
import type { CreateProfileData, UserProfile } from "@/lib/types/user-profile";
import { asc, eq } from "drizzle-orm";

const MAX_PROFILES = 10;

/** Drizzle行データ → UserProfile型への変換 */
function toUserProfile(row: typeof userProfiles.$inferSelect): UserProfile {
  return {
    id: row.id,
    root_account_id: row.rootAccountId,
    display_name: row.displayName,
    purpose: row.purpose,
    role_type: row.roleType,
    is_active: row.isActive,
    last_interacted_record_id: row.lastInteractedRecordId,
    created_at: row.createdAt.toISOString(),
    updated_at: row.updatedAt.toISOString(),
    // 新しいフィールド（スキーマに含まれていない場合のデフォルト値）
    profile_format: (row as any).profileFormat ?? "profile",
    role: (row as any).role ?? "member",
    purposes: (row as any).purposes ?? null,
    profile_type: (row as any).profileType ?? "self",
    avatar_url: (row as any).avatarUrl ?? null,
    external_links: (row as any).externalLinks ?? null,
  };
}

/** Drizzle版: ユーザープロフィール一覧取得 */
export async function getUserProfilesDrizzle(rootAccountId: string): Promise<UserProfile[]> {
  const rows = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.rootAccountId, rootAccountId))
    .orderBy(asc(userProfiles.createdAt));

  return rows.map(toUserProfile);
}

/** Drizzle版: ユーザープロフィール作成 */
export async function createUserProfileDrizzle(
  rootAccountId: string,
  data: CreateProfileData
): Promise<UserProfile> {
  // 上限チェック
  const currentProfiles = await getUserProfilesDrizzle(rootAccountId);
  if (currentProfiles.length >= MAX_PROFILES) {
    throw new Error(`Profile limit reached (${MAX_PROFILES})`);
  }

  const result = await db
    .insert(userProfiles)
    .values({
      rootAccountId,
      displayName: data.display_name,
      purpose: data.purpose ?? null,
      roleType: data.role_type ?? "member",
    })
    .returning();

  if (result.length === 0) {
    throw new Error("Failed to create profile");
  }

  return toUserProfile(result[0]);
}

/** Drizzle版: IDでユーザープロフィール取得 */
export async function getUserProfileByIdDrizzle(id: string): Promise<UserProfile | null> {
  const rows = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.id, id))
    .limit(1);

  if (rows.length === 0) {
    return null;
  }

  return toUserProfile(rows[0]);
}
