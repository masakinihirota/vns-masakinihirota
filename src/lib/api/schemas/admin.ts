/**
 * Zod Validation Schemas for Admin API
 *
 * @description
 * - Admin API全体で使用するリクエスト/レスポンス検証スキーマ
 * - User/Group/Nation CRUD操作のパラメータ定義
 * - 型安全性とランタイム検証を両立
 *
 * @see https://zod.dev/
 */

import { z } from 'zod';

// ============================================================================
// Utility Schemas (共通スキーマ)
// ============================================================================

/**
 * UUID形式のID
 */
export const idSchema = z
  .string()
  .uuid()
  .describe('UUID format ID');

/**
 * メールアドレス
 */
export const emailSchema = z
  .string()
  .email()
  .min(5)
  .max(255)
  .describe('Valid email address');

/**
 * パスワード (最低8文字、大小文字・数字・特殊文字)
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain uppercase letter')
  .regex(/[a-z]/, 'Password must contain lowercase letter')
  .regex(/[0-9]/, 'Password must contain number')
  .describe('Strong password');

/**
 * ユーザー名 (3-50文字)
 */
export const userNameSchema = z
  .string()
  .min(3)
  .max(50)
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores')
  .describe('User display name');

/**
 * グループ/ネーション名 (1-100文字)
 */
export const groupNameSchema = z
  .string()
  .min(1)
  .max(100)
  .describe('Group/Nation name');

/**
 * 説明 (0-500文字)
 */
export const descriptionSchema = z
  .string()
  .max(500)
  .optional()
  .describe('Optional description');

/**
 * ユーザーロール
 */
export const userRoleSchema = z
  .enum(['user', 'platform_admin'])
  .describe('User role: user or platform_admin');

/**
 * グループロール
 */
export const groupRoleSchema = z
  .enum(['member', 'leader'])
  .describe('Group role: member or leader');

/**
 * ネーションロール
 */
export const nationRoleSchema = z
  .enum(['member', 'leader', 'governor'])
  .describe('Nation role: member, leader, or governor');

// ============================================================================
// User API Schemas
// ============================================================================

/**
 * ユーザー作成リクエスト (Admin)
 */
export const createUserRequestSchema = z.object({
  email: emailSchema,
  name: userNameSchema,
  password: passwordSchema,
  role: userRoleSchema.optional().default('user'),
  metadata: z.record(z.any()).optional(),
});

export type CreateUserRequest = z.infer<typeof createUserRequestSchema>;

/**
 * ユーザー更新リクエスト (Admin)
 */
export const updateUserRequestSchema = z.object({
  name: userNameSchema.optional(),
  email: emailSchema.optional(),
  role: userRoleSchema.optional(),
  metadata: z.record(z.any()).optional(),
});

export type UpdateUserRequest = z.infer<typeof updateUserRequestSchema>;

/**
 * ユーザー一覧クエリ
 */
export const listUsersQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  role: userRoleSchema.optional(),
  search: z.string().optional(),
  sort: z.enum(['createdAt', 'email', 'name']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;

/**
 * ユーザーレスポンス
 */
export const userResponseSchema = z.object({
  id: idSchema,
  email: emailSchema,
  name: userNameSchema,
  role: userRoleSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  metadata: z.record(z.any()).nullable(),
});

export type UserResponse = z.infer<typeof userResponseSchema>;

/**
 * ユーザー一覧レスポンス
 */
export const listUsersResponseSchema = z.object({
  items: z.array(userResponseSchema),
  total: z.number().int(),
  limit: z.number().int(),
  offset: z.number().int(),
});

export type ListUsersResponse = z.infer<typeof listUsersResponseSchema>;

// ============================================================================
// Group API Schemas
// ============================================================================

/**
 * グループ作成リクエスト
 */
export const createGroupRequestSchema = z.object({
  name: groupNameSchema,
  description: descriptionSchema,
  isPublic: z.boolean().optional().default(true),
  settings: z.record(z.any()).optional(),
});

export type CreateGroupRequest = z.infer<typeof createGroupRequestSchema>;

/**
 * グループ更新リクエスト
 */
export const updateGroupRequestSchema = z.object({
  name: groupNameSchema.optional(),
  description: descriptionSchema,
  isPublic: z.boolean().optional(),
  settings: z.record(z.any()).optional(),
});

export type UpdateGroupRequest = z.infer<typeof updateGroupRequestSchema>;

/**
 * グループ一覧クエリ
 */
export const listGroupsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  userId: idSchema.optional(),
  isPublic: z.coerce.boolean().optional(),
  search: z.string().optional(),
  sort: z.enum(['createdAt', 'name', 'memberCount']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export type ListGroupsQuery = z.infer<typeof listGroupsQuerySchema>;

/**
 * グループレスポンス
 */
export const groupResponseSchema = z.object({
  id: idSchema,
  name: groupNameSchema,
  description: z.string().nullable(),
  isPublic: z.boolean(),
  leaderId: idSchema,
  memberCount: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  settings: z.record(z.any()).nullable(),
});

export type GroupResponse = z.infer<typeof groupResponseSchema>;

/**
 * グループ一覧レスポンス
 */
export const listGroupsResponseSchema = z.object({
  items: z.array(groupResponseSchema),
  total: z.number().int(),
  limit: z.number().int(),
  offset: z.number().int(),
});

export type ListGroupsResponse = z.infer<typeof listGroupsResponseSchema>;

/**
 * グループメンバー追加リクエスト
 */
export const addGroupMemberRequestSchema = z.object({
  userId: idSchema,
  role: groupRoleSchema.optional().default('member'),
});

export type AddGroupMemberRequest = z.infer<typeof addGroupMemberRequestSchema>;

/**
 * グループメンバー更新リクエスト
 */
export const updateGroupMemberRequestSchema = z.object({
  role: groupRoleSchema,
});

export type UpdateGroupMemberRequest = z.infer<typeof updateGroupMemberRequestSchema>;

// ============================================================================
// Nation API Schemas
// ============================================================================

/**
 * ネーション作成リクエスト
 */
export const createNationRequestSchema = z.object({
  name: groupNameSchema,
  description: descriptionSchema,
  governorId: idSchema.optional(), // 指定されない場合は作成者
  settings: z.record(z.any()).optional(),
});

export type CreateNationRequest = z.infer<typeof createNationRequestSchema>;

/**
 * ネーション更新リクエスト
 */
export const updateNationRequestSchema = z.object({
  name: groupNameSchema.optional(),
  description: descriptionSchema,
  settings: z.record(z.any()).optional(),
});

export type UpdateNationRequest = z.infer<typeof updateNationRequestSchema>;

/**
 * ネーション一覧クエリ
 */
export const listNationsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  userId: idSchema.optional(),
  search: z.string().optional(),
  sort: z.enum(['createdAt', 'name', 'memberCount']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export type ListNationsQuery = z.infer<typeof listNationsQuerySchema>;

/**
 * ネーションレスポンス
 */
export const nationResponseSchema = z.object({
  id: idSchema,
  name: groupNameSchema,
  description: z.string().nullable(),
  governorId: idSchema,
  memberCount: z.number().int(),
  groupCount: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  settings: z.record(z.any()).nullable(),
});

export type NationResponse = z.infer<typeof nationResponseSchema>;

/**
 * ネーション一覧レスポンス
 */
export const listNationsResponseSchema = z.object({
  items: z.array(nationResponseSchema),
  total: z.number().int(),
  limit: z.number().int(),
  offset: z.number().int(),
});

export type ListNationsResponse = z.infer<typeof listNationsResponseSchema>;

/**
 * ネーションメンバー追加リクエスト
 */
export const addNationMemberRequestSchema = z.object({
  userId: idSchema,
  role: nationRoleSchema.optional().default('member'),
});

export type AddNationMemberRequest = z.infer<typeof addNationMemberRequestSchema>;

/**
 * ネーションメンバー更新リクエスト
 */
export const updateNationMemberRequestSchema = z.object({
  role: nationRoleSchema,
});

export type UpdateNationMemberRequest = z.infer<typeof updateNationMemberRequestSchema>;

// ============================================================================
// Common Response Schemas
// ============================================================================

/**
 * ページネーションメタデータ
 */
export const paginationSchema = z.object({
  limit: z.number().int(),
  offset: z.number().int(),
  total: z.number().int(),
});

export type Pagination = z.infer<typeof paginationSchema>;

/**
 * エラーレスポンス
 */
export const errorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.any()).optional(),
  }),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;
