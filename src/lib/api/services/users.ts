/**
 * User Service Layer
 *
 * @description
 * - Database operations for user management
 * - Handles CRUD operations with proper error handling
 * - Type-safe queries using Drizzle ORM
 * - Custom error classes for type-safe error handling
 */

import { eq, desc, sql, or, ilike } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import { db } from '@/lib/db/client';
import { users as userTable } from '@/lib/db/schema.postgres';
import {
  UserAlreadyExistsError,
  UserNotFoundError,
} from '@/lib/api/errors';
import type { CreateUserRequest, UpdateUserRequest, UserResponse as User } from '@/lib/api/schemas/admin';

// Constants
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;
const MIN_PAGE_SIZE = 1;

/**
 * ユーザーを ID で取得
 */
export async function getUserById(id: string): Promise<User | null> {
  try {
    const result = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, id))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return mapUserRow(result[0]);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[getUserById] Database error:', { id, error: errorMessage, stack: (error as Error)?.stack });
    throw new Error(`Failed to fetch user: ${errorMessage}`, { cause: error });
  }
}

/**
 * ユーザーをメールアドレスで取得
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const result = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return mapUserRow(result[0]);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    // ✅ セキュリティ: メールアドレス等のPIIはログに出力しない（GDPR/CCPA準拠）
    console.error('[getUserByEmail] Database error', { error: errorMessage });
    throw new Error(`Failed to fetch user by email: ${errorMessage}`, { cause: error });
  }
}

/**
 * ユーザー一覧を取得（ページネーション対応）
 */
export async function listUsers(params: {
  limit?: number;
  offset?: number;
  sort?: 'name' | 'email' | 'createdAt';
  order?: 'asc' | 'desc';
  search?: string;
}): Promise<{ items: User[]; total: number }> {
  try {
    // Input sanitization - prevent negative offset and excessive limit
    const limit = Math.min(Math.max(params.limit || DEFAULT_PAGE_SIZE, MIN_PAGE_SIZE), MAX_PAGE_SIZE);
    const offset = Math.max(params.offset || 0, 0);
    const sort = params.sort || 'createdAt';
    const order = params.order || 'desc';
    const search = params.search?.trim() || '';

    // Build where clause for search using ilike (SQL Injection safe)
    const whereConditions = search
      ? or(
          ilike(userTable.email, `%${search}%`),
          ilike(userTable.name, `%${search}%`)
        )
      : undefined;

    // Get total count
    const countResult = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(userTable)
      .where(whereConditions);

    const total = Number(countResult[0]?.count || 0);

    // Get paginated results
    const query = db
      .select()
      .from(userTable)
      .where(whereConditions);

    // Apply sorting
    const sortColumn = sort === 'name' ? userTable.name :
                     sort === 'email' ? userTable.email :
                     userTable.createdAt;

    const sortedQuery = order === 'asc'
      ? query.orderBy(sortColumn)
      : query.orderBy(desc(sortColumn));

    const results = await sortedQuery
      .limit(limit)
      .offset(offset);

    return {
      items: results.map(mapUserRow),
      total,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[listUsers] Database error:', { params, error: errorMessage, stack: (error as Error)?.stack });
    throw new Error(`Failed to fetch users list: ${errorMessage}`, { cause: error });
  }
}

/**
 * 新規ユーザーを作成
 */
export async function createUser(
  data: CreateUserRequest
): Promise<User> {
  try {
    // Use transaction to ensure atomicity
    return await db.transaction(async (tx) => {
      // メールアドレスが既に存在する場合はエラー
      const existing = await tx
        .select()
        .from(userTable)
        .where(eq(userTable.email, data.email))
        .limit(1);

      if (existing.length > 0) {
        throw new UserAlreadyExistsError(
          `User with email ${data.email} already exists`
        );
      }

      // NOTE: パスワードハッシング処理は Better Auth が処理します
      // ここでは email, name, role を保存

      const result = await tx
        .insert(userTable)
        .values({
          id: createId(),
          email: data.email,
          name: data.name,
          role: data.role || 'user',
          emailVerified: false,
        })
        .returning();

      if (result.length === 0) {
        throw new Error('Failed to create user');
      }

      return mapUserRow(result[0]);
    });
  } catch (error) {
    // Re-throw custom errors as-is
    if (error instanceof UserAlreadyExistsError) {
      throw error;
    }

    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[createUser] Database error:', {
      email: data.email,
      error: errorMessage,
      stack: (error as Error)?.stack,
    });
    throw new Error(`Failed to create user: ${errorMessage}`, { cause: error });
  }
}

/**
 * ユーザー情報を更新
 */
export async function updateUser(
  id: string,
  data: UpdateUserRequest
): Promise<User> {
  try {
    // Use transaction to prevent race conditions
    return await db.transaction(async (tx) => {
      // Check user exists
      const existingResult = await tx
        .select()
        .from(userTable)
        .where(eq(userTable.id, id))
        .limit(1);

      if (existingResult.length === 0) {
        throw new UserNotFoundError(`User with ID ${id} not found`);
      }

      const existing = mapUserRow(existingResult[0]);

      // Update allowed fields only
      const updateData: Record<string, unknown> = {};

      if (data.name !== undefined) updateData.name = data.name;
      if (data.role !== undefined) updateData.role = data.role;

      // Email変更時の重複チェック (within same transaction)
      if (data.email && data.email !== existing.email) {
        const duplicate = await tx
          .select()
          .from(userTable)
          .where(eq(userTable.email, data.email))
          .limit(1);

        if (duplicate.length > 0) {
          throw new UserAlreadyExistsError(
            `User with email ${data.email} already exists`
          );
        }
        updateData.email = data.email;
      }

      const result = await tx
        .update(userTable)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(eq(userTable.id, id))
        .returning();

      if (result.length === 0) {
        throw new Error('Failed to update user');
      }

      return mapUserRow(result[0]);
    });
  } catch (error) {
    // Re-throw custom errors as-is
    if (error instanceof UserNotFoundError || error instanceof UserAlreadyExistsError) {
      throw error;
    }

    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[updateUser] Database error:', {
      id,
      data,
      error: errorMessage,
      stack: (error as Error)?.stack,
    });
    throw new Error(`Failed to update user: ${errorMessage}`, { cause: error });
  }
}

/**
 * ユーザーを削除
 */
export async function deleteUser(id: string): Promise<void> {
  try {
    await db.transaction(async (tx) => {
      // Check user exists
      const existing = await tx
        .select()
        .from(userTable)
        .where(eq(userTable.id, id))
        .limit(1);

      if (existing.length === 0) {
        throw new UserNotFoundError(`User with ID ${id} not found`);
      }

      await tx.delete(userTable).where(eq(userTable.id, id));
    });
  } catch (error) {
    // Re-throw custom errors as-is
    if (error instanceof UserNotFoundError) {
      throw error;
    }

    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[deleteUser] Database error:', {
      id,
      error: errorMessage,
      stack: (error as Error)?.stack,
    });
    throw new Error(`Failed to delete user: ${errorMessage}`, { cause: error });
  }
}

/**
 * Helper: Convert database row to User type
 */
function mapUserRow(row: any): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name || '',
    role: row.role || 'user',
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    metadata: undefined,
  };
}
