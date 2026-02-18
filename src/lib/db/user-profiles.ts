import { CreateProfileData, UserProfile } from "@/lib/types/user-profile";
import { asc, count, eq } from "drizzle-orm";
import { db } from "./drizzle-postgres";
import { rootAccounts, userProfiles } from "./schema.postgres";

export type { CreateProfileData, UserProfile };

const MAX_PROFILES = 10;
// TODO: Check anonymous limit (2) based on auth status or root account type

// Mapper Helper
export function mapUserProfileToSupabase(p: any): UserProfile {
  return {
    id: p.id,
    root_account_id: p.rootAccountId,
    display_name: p.displayName,
    purpose: p.purpose,
    role_type: p.roleType,
    is_active: p.isActive,
    last_interacted_record_id: p.lastInteractedRecordId,
    created_at: p.createdAt,
    updated_at: p.updatedAt,
    profile_format: p.profileFormat ?? "profile",
    role: p.role ?? "member",
    purposes: p.purposes ?? [],
    profile_type: p.profileType ?? "self",
    avatar_url: p.avatarUrl ?? null,
    external_links: p.externalLinks ?? null,
  } as unknown as UserProfile;
}

export async function getUserProfilesByAuthUserId(authUserId: string) {
  // Find root_account_id for the auth_user_id
  const rootAccount = await db.query.rootAccounts.findFirst({
    where: eq(rootAccounts.authUserId, authUserId),
  });

  if (!rootAccount) return [];

  const profiles = await db.query.userProfiles.findMany({
    where: eq(userProfiles.rootAccountId, rootAccount.id),
    orderBy: [asc(userProfiles.createdAt)],
  });

  return profiles.map(mapUserProfileToSupabase);
}

export async function getUserProfiles(rootAccountId: string) {
  const result = await db.query.userProfiles.findMany({
    where: eq(userProfiles.rootAccountId, rootAccountId),
    orderBy: [asc(userProfiles.createdAt)],
  });
  return result.map(mapUserProfileToSupabase);
}

export async function createUserProfile(
  rootAccountId: string,
  data: CreateProfileData
) {
  // Check limit
  const [countRes] = await db
    .select({ count: count() })
    .from(userProfiles)
    .where(eq(userProfiles.rootAccountId, rootAccountId));

  if (countRes.count >= MAX_PROFILES) {
    throw new Error(`Profile limit reached (${MAX_PROFILES})`);
  }

  const drizzleInput = {
    rootAccountId: rootAccountId,
    displayName: data.display_name,
    purpose: data.purpose ?? null,
    roleType: data.role_type ?? "member",
    profileFormat: data.profile_format ?? "profile",
    role: data.role ?? "member",
    purposes: data.purposes ?? [],
    profileType: data.profile_type ?? "self",
    avatarUrl: data.avatar_url ?? null,
    externalLinks: data.external_links ?? null,
  };

  const [newProfile] = await db
    .insert(userProfiles)
    .values(drizzleInput)
    .returning();
  return mapUserProfileToSupabase(newProfile);
}

import { isValidUUID } from "@/lib/utils";

export async function getUserProfileById(id: string) {
  if (!isValidUUID(id)) {
    return null;
  }

  const profile = await db.query.userProfiles.findFirst({
    where: eq(userProfiles.id, id),
  });
  return profile ? mapUserProfileToSupabase(profile) : null;
}

export async function updateUserProfile(
  id: string,
  data: Partial<CreateProfileData>
) {
  if (!isValidUUID(id)) {
    throw new Error("Invalid UUID");
  }

  const drizzleInput: any = {};
  if (data.display_name !== undefined) drizzleInput.displayName = data.display_name;
  if (data.purpose !== undefined) drizzleInput.purpose = data.purpose;
  if (data.role_type !== undefined) drizzleInput.roleType = data.role_type;
  if (data.profile_format !== undefined) drizzleInput.profileFormat = data.profile_format;
  if (data.role !== undefined) drizzleInput.role = data.role;
  if (data.purposes !== undefined) drizzleInput.purposes = data.purposes;
  if (data.profile_type !== undefined) drizzleInput.profileType = data.profile_type;
  if (data.avatar_url !== undefined) drizzleInput.avatarUrl = data.avatar_url;
  if (data.external_links !== undefined) drizzleInput.externalLinks = data.external_links;

  drizzleInput.updatedAt = new Date().toISOString();

  const [updated] = await db
    .update(userProfiles)
    .set(drizzleInput)
    .where(eq(userProfiles.id, id))
    .returning();

  return updated ? mapUserProfileToSupabase(updated) : null;
}

export async function getRootAccountByAuthUserId(authUserId: string) {
  return db.query.rootAccounts.findFirst({
    where: eq(rootAccounts.authUserId, authUserId),
  });
}
