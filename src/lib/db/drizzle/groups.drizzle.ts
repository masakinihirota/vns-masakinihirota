import { db } from "@/lib/drizzle/client";
import { groupMembers, groups } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";

/** Drizzle版: グループ作成 */
export const createGroupDrizzle = async (groupData: {
  name: string;
  description?: string;
  avatar_url?: string;
  cover_url?: string;
  leader_id: string;
}) => {
  return await db.transaction(async (tx) => {
    const result = await tx
      .insert(groups)
      .values({
        name: groupData.name,
        description: groupData.description,
        avatarUrl: groupData.avatar_url,
        coverUrl: groupData.cover_url,
        leaderId: groupData.leader_id,
      })
      .returning();

    if (result.length === 0) throw new Error("Failed to create group");
    const group = result[0];

    // Add leader as a member
    await tx.insert(groupMembers).values({
      groupId: group.id,
      userProfileId: groupData.leader_id,
      role: "leader",
    });

    return group;
  });
};

/** Drizzle版: グループ取得 */
export const getGroupByIdDrizzle = async (groupId: string) => {
  const rows = await db
    .select()
    .from(groups)
    .where(eq(groups.id, groupId))
    .limit(1);

  if (rows.length === 0) throw new Error("Group not found");
  return rows[0];
};

/** Drizzle版: グループ参加 */
export const joinGroupDrizzle = async (groupId: string, userId: string) => {
  const result = await db
    .insert(groupMembers)
    .values({
      groupId,
      userProfileId: userId,
      role: "member",
    })
    .returning();

  if (result.length === 0) throw new Error("Failed to join group");
  return result[0];
};
