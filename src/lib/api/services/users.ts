/**
 * User Service Layer
 *
 * @description
 * - Database operations for user management
 * - Handles CRUD operations with proper error handling
 * - Type-safe queries using Drizzle ORM
 */

import { eq, desc, sql } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import { db } from '@/db/drizzle';
import { user as userTable } from '@/db/schema';
import type { CreateUserRequest, UpdateUserRequest, UserResponse as User } from '@/lib/api/schemas/admin';

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
    console.error('[getUserById] Database error:', error);
    throw new Error('Failed to fetch user');
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
    console.error('[getUserByEmail] Database error:', error);
    throw new Error('Failed to fetch user by email');
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
    const {
      limit = 20,
      offset = 0,
      sort = 'createdAt',
      order = 'desc',
      search = '',
    } = params;

    // Build where clause for search
    let whereConditions = undefined;
    if (search) {
      whereConditions = sql`${userTable.email} ILIKE ${'%' + search + '%'} 
        OR ${userTable.name} ILIKE ${'%' + search + '%'}`;
    }

    // Get total count
    const countResult = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(userTable)
      .where(whereConditions);

    const total = countResult[0]?.count || 0;

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
    console.error('[listUsers] Database error:', error);
    throw new Error('Failed to fetch users list');
  }
}

/**
 * 新規ユーザーを作成
 */
export async function createUser(
  data: CreateUserRequest
): Promise<User> {
  try {
    // メールアドレスが既に存在する場合はエラー
    const existing = await getUserByEmail(data.email);
    if (existing) {
      throw new Error('Email already registered');
    }

    // NOTE: パスワードハッシング処理は Better Auth が処理します
    // ここでは email, name, role を保存
    
    const result = await db
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
  } catch (error) {
    console.error('[createUser] Database error:', error);
    if (error instanceof Error && error.message.includes('Email already')) {
      throw error;
    }
    throw new Error('Failed to create user');
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
    // Check user exists
    const existing = await getUserById(id);
    if (!existing) {
      throw new Error('User not found');
    }

    // Update allowed fields only
    const updateData: Record<string, any> = {};
    
    if (data.name !== undefined) updateData.name = data.name;
    if (data.role !== undefined) updateData.role = data.role;

    // Email変更時の重複チェック
    if (data.email && data.email !== existing.email) {
      const duplicate = await getUserByEmail(data.email);
      if (duplicate) {
        throw new Error('Email already in use');
      }
      updateData.email = data.email;
    }

    const result = await db
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
  } catch (error) {
    console.error('[updateUser] Database error:', error);
    if (error instanceof Error && error.message.includes('not found')) {
      throw error;
    }
    throw new Error('Failed to update user');
  }
}

/**
 * ユーザーを削除
 */
export async function deleteUser(id: string): Promise<void> {
  try {
    // Check user exists
    const existing = await getUserById(id);
    if (!existing) {
      throw new Error('User not found');
    }

    await db
      .delete(userTable)
      .where(eq(userTable.id, id));
  } catch (error) {
    console.error('[deleteUser] Database error:', error);
    if (error instanceof Error && error.message.includes('not found')) {
      throw error;
    }
    throw new Error('Failed to delete user');
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
    metadata: null,
  };
}
