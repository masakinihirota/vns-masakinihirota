/**
 * Nation Service Layer
 *
 * @description
 * - Database operations for nation management
 * - Handles CRUD operations with proper error handling
 * - Type-safe queries using Drizzle ORM
 * - Custom error classes for type-safe error handling
 */

import { eq, desc, sql, ilike, and } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import {
  nations as nationTable,
  nationCitizens,
  nationGroups,
  userProfiles,
} from '@/lib/db/schema.postgres';
import type {
  CreateNationRequest,
  UpdateNationRequest,
  NationResponse as Nation,
} from '@/lib/api/schemas/admin';

// Custom Errors
export class NationNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NationNotFoundError';
  }
}

export class NationAlreadyExistsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NationAlreadyExistsError';
  }
}

// Constants
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;
const MIN_PAGE_SIZE = 1;

/**
 * Map database row to API response
 */
function mapNationRow(
  row: typeof nationTable.$inferSelect & { memberCount?: number; groupCount?: number }
): Nation {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    governorId: row.ownerUserId || row.ownerGroupId || '',
    memberCount: row.memberCount || 0,
    groupCount: row.groupCount || 0,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
    settings: undefined,
  };
}

/**
 * ネーションを ID で取得
 */
export async function getNationById(id: string): Promise<Nation | null> {
  try {
    const result = await db
      .select({
        nation: nationTable,
        memberCount: sql<number>`COUNT(DISTINCT ${nationCitizens.userProfileId})`.as('member_count'),
        groupCount: sql<number>`COUNT(DISTINCT ${nationGroups.groupId})`.as('group_count'),
      })
      .from(nationTable)
      .leftJoin(nationCitizens, eq(nationTable.id, nationCitizens.nationId))
      .leftJoin(nationGroups, eq(nationTable.id, nationGroups.nationId))
      .where(eq(nationTable.id, id))
      .groupBy(nationTable.id)
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return mapNationRow({
      ...result[0].nation,
      memberCount: Number(result[0].memberCount) || 0,
      groupCount: Number(result[0].groupCount) || 0,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[getNationById] Database error:', {
      id,
      error: errorMessage,
      stack: (error as Error)?.stack,
    });
    throw new Error(`Failed to fetch nation: ${errorMessage}`, { cause: error });
  }
}

/**
 * ネーション一覧を取得（ページネーション対応）
 */
export async function listNations(params: {
  limit?: number;
  offset?: number;
  sort?: 'name' | 'createdAt' | 'memberCount';
  order?: 'asc' | 'desc';
  search?: string;
  userId?: string;
}): Promise<{ items: Nation[]; total: number }> {
  try {
    // Input sanitization
    const limit = Math.min(
      Math.max(params.limit || DEFAULT_PAGE_SIZE, MIN_PAGE_SIZE),
      MAX_PAGE_SIZE
    );
    const offset = Math.max(params.offset || 0, 0);
    const sort = params.sort || 'createdAt';
    const order = params.order || 'desc';
    const search = params.search?.trim() || '';

    // Build where conditions
    const whereConditions = [];

    if (search) {
      whereConditions.push(ilike(nationTable.name, `%${search}%`));
    }

    if (params.userId) {
      // Filter by nations where user is a citizen
      whereConditions.push(eq(nationCitizens.userProfileId, params.userId));
    }

    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    // Get total count
    const countQuery = db
      .select({ count: sql<number>`COUNT(DISTINCT ${nationTable.id})` })
      .from(nationTable);

    if (params.userId) {
      countQuery.leftJoin(
        nationCitizens,
        eq(nationTable.id, nationCitizens.nationId)
      );
    }

    if (whereClause) {
      countQuery.where(whereClause);
    }

    const countResult = await countQuery;
    const total = Number(countResult[0]?.count || 0);

    // Get paginated results with member and group counts
    const query = db
      .select({
        nation: nationTable,
        memberCount: sql<number>`COUNT(DISTINCT ${nationCitizens.userProfileId})`.as(
          'member_count'
        ),
        groupCount: sql<number>`COUNT(DISTINCT ${nationGroups.groupId})`.as('group_count'),
      })
      .from(nationTable)
      .leftJoin(nationCitizens, eq(nationTable.id, nationCitizens.nationId))
      .leftJoin(nationGroups, eq(nationTable.id, nationGroups.nationId));

    if (whereClause) {
      query.where(whereClause);
    }

    query.groupBy(nationTable.id);

    // Apply sorting
    if (sort === 'memberCount') {
      const sortedQuery =
        order === 'asc'
          ? query.orderBy(sql`COUNT(DISTINCT ${nationCitizens.userProfileId})`)
          : query.orderBy(desc(sql`COUNT(DISTINCT ${nationCitizens.userProfileId})`));

      const results = await sortedQuery.limit(limit).offset(offset);

      return {
        items: results.map((r) =>
          mapNationRow({
            ...r.nation,
            memberCount: Number(r.memberCount) || 0,
            groupCount: Number(r.groupCount) || 0,
          })
        ),
        total,
      };
    }

    const sortColumn =
      sort === 'name' ? nationTable.name : nationTable.createdAt;
    const sortedQuery =
      order === 'asc'
        ? query.orderBy(sortColumn)
        : query.orderBy(desc(sortColumn));

    const results = await sortedQuery.limit(limit).offset(offset);

    return {
      items: results.map((r) =>
        mapNationRow({
          ...r.nation,
          memberCount: Number(r.memberCount) || 0,
          groupCount: Number(r.groupCount) || 0,
        })
      ),
      total,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[listNations] Database error:', {
      params,
      error: errorMessage,
      stack: (error as Error)?.stack,
    });
    throw new Error(`Failed to fetch nations list: ${errorMessage}`, {
      cause: error,
    });
  }
}

/**
 * 新規ネーションを作成
 */
export async function createNation(
  data: CreateNationRequest,
  creatorId: string
): Promise<Nation> {
  try {
    return await db.transaction(async (tx) => {
      // ネーション名の重複チェック（任意）
      const existing = await tx
        .select()
        .from(nationTable)
        .where(eq(nationTable.name, data.name))
        .limit(1);

      if (existing.length > 0) {
        throw new NationAlreadyExistsError(
          `Nation with name "${data.name}" already exists`
        );
      }

      const governorId = data.governorId || creatorId;

      // ネーション作成
      const [newNation] = await tx
        .insert(nationTable)
        .values({
          name: data.name,
          description: data.description || null,
          ownerUserId: governorId,
          ownerGroupId: null, // 初期作成時はユーザー所有
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .returning();

      // 作成者をgovernorとして市民に追加
      await tx.insert(nationCitizens).values({
        nationId: newNation.id,
        userProfileId: governorId,
        role: 'governor',
        joinedAt: new Date().toISOString(),
      });

      return mapNationRow({ ...newNation, memberCount: 1, groupCount: 0 });
    });
  } catch (error) {
    if (error instanceof NationAlreadyExistsError) {
      throw error;
    }

    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[createNation] Database error:', {
      data,
      creatorId,
      error: errorMessage,
      stack: (error as Error)?.stack,
    });
    throw new Error(`Failed to create nation: ${errorMessage}`, {
      cause: error,
    });
  }
}

/**
 * ネーション情報を更新
 */
export async function updateNation(
  id: string,
  data: UpdateNationRequest
): Promise<Nation> {
  try {
    return await db.transaction(async (tx) => {
      // ネーションの存在確認
      const existing = await tx
        .select()
        .from(nationTable)
        .where(eq(nationTable.id, id))
        .limit(1);

      if (existing.length === 0) {
        throw new NationNotFoundError(`Nation with ID ${id} not found`);
      }

      // 名前の重複チェック（名前が変更される場合のみ）
      if (data.name && data.name !== existing[0].name) {
        const duplicate = await tx
          .select()
          .from(nationTable)
          .where(eq(nationTable.name, data.name))
          .limit(1);

        if (duplicate.length > 0) {
          throw new NationAlreadyExistsError(
            `Nation with name "${data.name}" already exists`
          );
        }
      }

      // ネーション更新
      const [updated] = await tx
        .update(nationTable)
        .set({
          ...(data.name && { name: data.name }),
          ...(data.description !== undefined && {
            description: data.description,
          }),
          updatedAt: new Date().toISOString(),
        })
        .where(eq(nationTable.id, id))
        .returning();

      // Get member and group counts
      const countsResult = await tx
        .select({
          memberCount: sql<number>`COUNT(DISTINCT ${nationCitizens.userProfileId})`,
          groupCount: sql<number>`COUNT(DISTINCT ${nationGroups.groupId})`,
        })
        .from(nationTable)
        .leftJoin(nationCitizens, eq(nationTable.id, nationCitizens.nationId))
        .leftJoin(nationGroups, eq(nationTable.id, nationGroups.nationId))
        .where(eq(nationTable.id, id))
        .groupBy(nationTable.id);

      const memberCount = Number(countsResult[0]?.memberCount || 0);
      const groupCount = Number(countsResult[0]?.groupCount || 0);

      return mapNationRow({ ...updated, memberCount, groupCount });
    });
  } catch (error) {
    if (
      error instanceof NationNotFoundError ||
      error instanceof NationAlreadyExistsError
    ) {
      throw error;
    }

    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[updateNation] Database error:', {
      id,
      data,
      error: errorMessage,
      stack: (error as Error)?.stack,
    });
    throw new Error(`Failed to update nation: ${errorMessage}`, {
      cause: error,
    });
  }
}

/**
 * ネーションを削除
 */
export async function deleteNation(id: string): Promise<void> {
  try {
    await db.transaction(async (tx) => {
      // ネーションの存在確認
      const existing = await tx
        .select()
        .from(nationTable)
        .where(eq(nationTable.id, id))
        .limit(1);

      if (existing.length === 0) {
        throw new NationNotFoundError(`Nation with ID ${id} not found`);
      }

      // 市民を削除（CASCADE で自動削除される場合はスキップ可能）
      await tx.delete(nationCitizens).where(eq(nationCitizens.nationId, id));

      // グループ関連を削除
      await tx.delete(nationGroups).where(eq(nationGroups.nationId, id));

      // ネーション削除
      await tx.delete(nationTable).where(eq(nationTable.id, id));
    });
  } catch (error) {
    if (error instanceof NationNotFoundError) {
      throw error;
    }

    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[deleteNation] Database error:', {
      id,
      error: errorMessage,
      stack: (error as Error)?.stack,
    });
    throw new Error(`Failed to delete nation: ${errorMessage}`, {
      cause: error,
    });
  }
}
