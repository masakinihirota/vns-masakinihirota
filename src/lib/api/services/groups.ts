/**
 * Group Service Layer
 *
 * @description
 * - Database operations for group management
 * - Handles CRUD operations with proper error handling
 * - Type-safe queries using Drizzle ORM
 * - Custom error classes for type-safe error handling
 */

import { eq, desc, sql, ilike, and } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { groups as groupTable, groupMembers, userProfiles } from '@/lib/db/schema.postgres';
import type {
  CreateGroupRequest,
  UpdateGroupRequest,
  GroupResponse as Group,
} from '@/lib/api/schemas/admin';

// Custom Errors
export class GroupNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GroupNotFoundError';
  }
}

export class GroupAlreadyExistsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GroupAlreadyExistsError';
  }
}

// Constants
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;
const MIN_PAGE_SIZE = 1;

/**
 * Map database row to API response
 */
function mapGroupRow(row: typeof groupTable.$inferSelect & { memberCount?: number }): Group {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    isPublic: !row.isOfficial || false, // Map isOfficial to isPublic (inverse logic)
    leaderId: row.leaderId || '',
    memberCount: row.memberCount || 0,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
    settings: undefined,
  };
}

/**
 * グループを ID で取得
 */
export async function getGroupById(id: string): Promise<Group | null> {
  try {
    const result = await db
      .select({
        group: groupTable,
        memberCount: sql<number>`COUNT(DISTINCT ${groupMembers.id})`.as('member_count'),
      })
      .from(groupTable)
      .leftJoin(groupMembers, eq(groupTable.id, groupMembers.groupId))
      .where(eq(groupTable.id, id))
      .groupBy(groupTable.id)
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return mapGroupRow({
      ...result[0].group,
      memberCount: Number(result[0].memberCount) || 0,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[getGroupById] Database error:', {
      id,
      error: errorMessage,
      stack: (error as Error)?.stack,
    });
    throw new Error(`Failed to fetch group: ${errorMessage}`, { cause: error });
  }
}

/**
 * グループ一覧を取得（ページネーション対応）
 */
export async function listGroups(params: {
  limit?: number;
  offset?: number;
  sort?: 'name' | 'createdAt' | 'memberCount';
  order?: 'asc' | 'desc';
  search?: string;
  userId?: string;
  isPublic?: boolean;
}): Promise<{ items: Group[]; total: number }> {
  try {
    // Input sanitization
    const limit = Math.min(Math.max(params.limit || DEFAULT_PAGE_SIZE, MIN_PAGE_SIZE), MAX_PAGE_SIZE);
    const offset = Math.max(params.offset || 0, 0);
    const sort = params.sort || 'createdAt';
    const order = params.order || 'desc';
    const search = params.search?.trim() || '';

    // Build where conditions
    const whereConditions = [];

    if (search) {
      whereConditions.push(
        ilike(groupTable.name, `%${search}%`)
      );
    }

    if (params.isPublic !== undefined) {
      // Map isPublic to isOfficial (inverse)
      whereConditions.push(eq(groupTable.isOfficial, !params.isPublic));
    }

    if (params.userId) {
      // Filter by groups where user is a member
      whereConditions.push(
        eq(groupMembers.userProfileId, params.userId)
      );
    }

    const whereClause = whereConditions.length > 0
      ? and(...whereConditions)
      : undefined;

    // Get total count
    const countQuery = db
      .select({ count: sql<number>`COUNT(DISTINCT ${groupTable.id})` })
      .from(groupTable);

    if (params.userId) {
      countQuery.leftJoin(groupMembers, eq(groupTable.id, groupMembers.groupId));
    }

    if (whereClause) {
      countQuery.where(whereClause);
    }

    const countResult = await countQuery;
    const total = Number(countResult[0]?.count || 0);

    // Get paginated results with member count
    const query = db
      .select({
        group: groupTable,
        memberCount: sql<number>`COUNT(DISTINCT ${groupMembers.id})`.as('member_count'),
      })
      .from(groupTable)
      .leftJoin(groupMembers, eq(groupTable.id, groupMembers.groupId));

    if (params.userId) {
      query.leftJoin(
        groupMembers,
        eq(groupTable.id, groupMembers.groupId)
      );
    }

    if (whereClause) {
      query.where(whereClause);
    }

    query.groupBy(groupTable.id);

    // Apply sorting
    if (sort === 'memberCount') {
      const sortedQuery = order === 'asc'
        ? query.orderBy(sql`COUNT(DISTINCT ${groupMembers.id})`)
        : query.orderBy(desc(sql`COUNT(DISTINCT ${groupMembers.id})`));

      const results = await sortedQuery.limit(limit).offset(offset);

      return {
        items: results.map((r) => mapGroupRow({
          ...r.group,
          memberCount: Number(r.memberCount) || 0,
        })),
        total,
      };
    }

    const sortColumn = sort === 'name' ? groupTable.name : groupTable.createdAt;
    const sortedQuery = order === 'asc'
      ? query.orderBy(sortColumn)
      : query.orderBy(desc(sortColumn));

    const results = await sortedQuery.limit(limit).offset(offset);

    return {
      items: results.map((r) => mapGroupRow({
        ...r.group,
        memberCount: Number(r.memberCount) || 0,
      })),
      total,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[listGroups] Database error:', {
      params,
      error: errorMessage,
      stack: (error as Error)?.stack,
    });
    throw new Error(`Failed to fetch groups list: ${errorMessage}`, { cause: error });
  }
}

/**
 * 新規グループを作成
 */
export async function createGroup(
  data: CreateGroupRequest,
  creatorId: string
): Promise<Group> {
  try {
    return await db.transaction(async (tx) => {
      // グループ名の重複チェック（任意）
      const existing = await tx
        .select()
        .from(groupTable)
        .where(eq(groupTable.name, data.name))
        .limit(1);

      if (existing.length > 0) {
        throw new GroupAlreadyExistsError(`Group with name "${data.name}" already exists`);
      }

      // グループ作成
      const [newGroup] = await tx
        .insert(groupTable)
        .values({
          name: data.name,
          description: data.description || null,
          isOfficial: !(data.isPublic ?? true), // Map isPublic to isOfficial (inverse)
          leaderId: creatorId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .returning();

      // 作成者をリーダーとしてメンバーに追加
      await tx.insert(groupMembers).values({
        groupId: newGroup.id,
        userProfileId: creatorId,
        role: 'leader',
        joinedAt: new Date().toISOString(),
      });

      return mapGroupRow({ ...newGroup, memberCount: 1 });
    });
  } catch (error) {
    if (error instanceof GroupAlreadyExistsError) {
      throw error;
    }

    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[createGroup] Database error:', {
      data,
      creatorId,
      error: errorMessage,
      stack: (error as Error)?.stack,
    });
    throw new Error(`Failed to create group: ${errorMessage}`, { cause: error });
  }
}

/**
 * グループ情報を更新
 */
export async function updateGroup(
  id: string,
  data: UpdateGroupRequest
): Promise<Group> {
  try {
    return await db.transaction(async (tx) => {
      // グループの存在確認
      const existing = await tx
        .select()
        .from(groupTable)
        .where(eq(groupTable.id, id))
        .limit(1);

      if (existing.length === 0) {
        throw new GroupNotFoundError(`Group with ID ${id} not found`);
      }

      // 名前の重複チェック（名前が変更される場合のみ）
      if (data.name && data.name !== existing[0].name) {
        const duplicate = await tx
          .select()
          .from(groupTable)
          .where(eq(groupTable.name, data.name))
          .limit(1);

        if (duplicate.length > 0) {
          throw new GroupAlreadyExistsError(`Group with name "${data.name}" already exists`);
        }
      }

      // グループ更新
      const [updated] = await tx
        .update(groupTable)
        .set({
          ...(data.name && { name: data.name }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.isPublic !== undefined && { isOfficial: !data.isPublic }), // Map isPublic to isOfficial
          updatedAt: new Date().toISOString(),
        })
        .where(eq(groupTable.id, id))
        .returning();

      // Get member count
      const memberCountResult = await tx
        .select({ count: sql<number>`COUNT(*)` })
        .from(groupMembers)
        .where(eq(groupMembers.groupId, id));

      const memberCount = Number(memberCountResult[0]?.count || 0);

      return mapGroupRow({ ...updated, memberCount });
    });
  } catch (error) {
    if (error instanceof GroupNotFoundError || error instanceof GroupAlreadyExistsError) {
      throw error;
    }

    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[updateGroup] Database error:', {
      id,
      data,
      error: errorMessage,
      stack: (error as Error)?.stack,
    });
    throw new Error(`Failed to update group: ${errorMessage}`, { cause: error });
  }
}

/**
 * グループを削除
 */
export async function deleteGroup(id: string): Promise<void> {
  try {
    await db.transaction(async (tx) => {
      // グループの存在確認
      const existing = await tx
        .select()
        .from(groupTable)
        .where(eq(groupTable.id, id))
        .limit(1);

      if (existing.length === 0) {
        throw new GroupNotFoundError(`Group with ID ${id} not found`);
      }

      // メンバーを削除（CASCADE で自動削除される場合はスキップ可能）
      await tx.delete(groupMembers).where(eq(groupMembers.groupId, id));

      // グループ削除
      await tx.delete(groupTable).where(eq(groupTable.id, id));
    });
  } catch (error) {
    if (error instanceof GroupNotFoundError) {
      throw error;
    }

    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[deleteGroup] Database error:', {
      id,
      error: errorMessage,
      stack: (error as Error)?.stack,
    });
    throw new Error(`Failed to delete group: ${errorMessage}`, { cause: error });
  }
}
