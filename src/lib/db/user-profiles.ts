import { asc, count, eq, inArray } from "drizzle-orm";

import { CreateProfileData, UserProfile } from "@/lib/types/user-profile";
import { isValidUUID } from "@/lib/utils";

import { db as database } from "./client";
import { rootAccounts, userProfiles } from "./schema.postgres";

export type DbUserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;
export type DbRootAccount = typeof rootAccounts.$inferSelect;



const MAX_PROFILES = 10;
// TODO: Check anonymous limit (2) based on auth status or root account type

// Mapper Helper
/**
 *
 * @param p
 */
export function mapToUserProfileDomain(p: DbUserProfile): UserProfile {
  return {
    id: p.id,
    root_account_id: p.rootAccountId,
    display_name: p.displayName,
    purpose: p.purpose,
    role_type: p.roleType,
    is_active: p.isActive,
    last_interacted_record_id: p.lastInteractedRecordId,
    created_at: p.createdAt ? p.createdAt : undefined,
    updated_at: p.updatedAt ? p.updatedAt : undefined,
    profile_format: p.profileFormat ?? "profile",
    role: p.role ?? "member",
    purposes: (p.purposes as string[]) ?? [],
    profile_type: p.profileType ?? "self",
    avatar_url: p.avatarUrl ?? undefined,
    external_links: (p.externalLinks as Record<string, string>) ?? undefined,
  } as unknown as UserProfile;
}

/**
 *
 * @param authUserId
 */
export async function getUserProfilesByAuthUserId(authUserId: string): Promise<UserProfile[]> {
  const rootAccount = await database.query.rootAccounts.findFirst({
    where: eq(rootAccounts.authUserId, authUserId),
    with: {
      userProfiles: {
        orderBy: [asc(userProfiles.createdAt)],
      },
    },
  });

  return rootAccount?.userProfiles?.map(mapToUserProfileDomain) ?? [];
}

/**
 *
 * @param rootAccountId
 */
export async function getUserProfiles(rootAccountId: string): Promise<UserProfile[]> {
  const result = await database.query.userProfiles.findMany({
    where: eq(userProfiles.rootAccountId, rootAccountId),
    orderBy: [asc(userProfiles.createdAt)],
  });
  return result.map(mapToUserProfileDomain);
}

/**
 *
 * @param rootAccountId
 * @param data
 */
export async function createUserProfile(
  rootAccountId: string,
  data: CreateProfileData
): Promise<UserProfile> {
  return await database.transaction(async (tx) => {
    // Count profiles within transaction to prevent race condition
    // Multiple concurrent requests will be serialized at DB level
    const [countRes] = await tx
      .select({ count: count() })
      .from(userProfiles)
      .where(eq(userProfiles.rootAccountId, rootAccountId));

    if (countRes.count >= MAX_PROFILES) {
      throw new Error(`Profile limit reached (${MAX_PROFILES})`);
    }

    const drizzleInput: InsertUserProfile = {
      rootAccountId: rootAccountId,
      displayName: data.display_name,
      purpose: data.purpose ?? undefined,
      roleType: data.role_type ?? "member",
      profileFormat: data.profile_format ?? "profile",
      role: data.role ?? "member",
      purposes: data.purposes ?? [],
      profileType: data.profile_type ?? "self",
      avatarUrl: data.avatar_url ?? undefined,
      externalLinks: data.external_links ?? undefined,
    };

    const [newProfile] = await tx
      .insert(userProfiles)
      .values(drizzleInput)
      .returning();
    return mapToUserProfileDomain(newProfile);
  });
}


/**
 *
 * @param id
 */
export async function getUserProfileById(id: string): Promise<UserProfile | undefined> {
  if (!isValidUUID(id)) {
    return;
  }

  const profile = await database.query.userProfiles.findFirst({
    where: eq(userProfiles.id, id),
  });
  return profile ? mapToUserProfileDomain(profile) : undefined;
}

/**
 *
 * @param ids
 */
export async function getProfilesByIds(ids: string[]): Promise<UserProfile[]> {
  if (!ids || ids.length === 0) return [];

  const validIds = ids.filter(isValidUUID);
  if (validIds.length === 0) return [];

  const profiles = await database.query.userProfiles.findMany({
    where: inArray(userProfiles.id, validIds),
  });
  return profiles.map(mapToUserProfileDomain);
}

/**
 *
 * @param id
 * @param data
 */
export async function updateUserProfile(
  id: string,
  data: Partial<CreateProfileData>
): Promise<UserProfile | undefined> {
  if (!isValidUUID(id)) {
    throw new Error("Invalid UUID");
  }

  const drizzleInput: Partial<InsertUserProfile> = {};
  if (data.display_name !== undefined)
    drizzleInput.displayName = data.display_name;
  if (data.purpose !== undefined) drizzleInput.purpose = data.purpose;
  if (data.role_type !== undefined) drizzleInput.roleType = data.role_type;
  if (data.profile_format !== undefined)
    drizzleInput.profileFormat = data.profile_format;
  if (data.role !== undefined) drizzleInput.role = data.role;
  if (data.purposes !== undefined) drizzleInput.purposes = data.purposes;
  if (data.profile_type !== undefined)
    drizzleInput.profileType = data.profile_type;
  if (data.avatar_url !== undefined) drizzleInput.avatarUrl = data.avatar_url;
  if (data.external_links !== undefined)
    drizzleInput.externalLinks = data.external_links;

  drizzleInput.updatedAt = new Date().toISOString();

  const [updated] = await database
    .update(userProfiles)
    .set(drizzleInput)
    .where(eq(userProfiles.id, id))
    .returning();

  return updated ? mapToUserProfileDomain(updated) : undefined;
}

/**
 *
 * @param authUserId
 */
export async function getRootAccountByAuthUserId(authUserId: string): Promise<DbRootAccount | undefined> {
  return database.query.rootAccounts.findFirst({
    where: eq(rootAccounts.authUserId, authUserId),
  });
}

export {type CreateProfileData, type UserProfile} from "@/lib/types/user-profile";
