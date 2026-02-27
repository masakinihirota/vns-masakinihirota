/**
 * Admin Panel Server Actions
 * 管理画面用のサーバー側ロジック
 *
 * 権限チェック：
 * - 操作ユーザーのロールが 'admin' または 'mediator' であること
 * - 監査ログに全操作を記録
 */

'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { z } from 'zod';

import { auth } from '@/lib/auth';
import {
  getApprovalQueue,
  getDashboardKPI,
  getPenalties,
  issuePenalty,
  reviewApproval,
  searchAuditLogs,
  searchUsers,
  updateUserRole,
  updateUserStatus,
} from '@/lib/db/admin-queries';
import { db } from '@/lib/db/client';
import { userProfiles } from '@/lib/db/schema.postgres';

/**
 * 汎用的なアクション実行結果の型
 */
export type ActionResult<T> =
  | { success: true; data: T; error?: never }
  | { success: false; data?: never; error: string };

/**
 * 権限チェック: 管理者かコンプライアンス担当者のみ実行可能
 * @returns セッション情報
 * @throws UnauthorizedRoleError ロールが不足している場合
 */
async function ensureAdminPermission() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || (session.user.role !== 'admin' && session.user.role !== 'mediator')) {
    throw new Error('Unauthorized: Admin role required');
  }

  return session;
}

/**
 * 現在の操作ユーザーのプロフィールIDを取得
 * @returns プロフィールID (UUID)
 */
async function getAdminProfileId() {
  const session = await ensureAdminPermission();

  // auth_user_id から user_profile を検索
  const profile = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.rootAccountId, session.user.id))
    .limit(1);

  if (!profile[0]) {
    throw new Error('Admin profile not found');
  }

  return profile[0].id;
}

// ============================================
// ユーザー管理 Server Actions
// ============================================

/** ユーザー検索のバリデーションスキーマ */
const SearchUsersSchema = z.object({
  searchTerm: z.string().max(100).default(''),
  status: z.enum(['all', 'active', 'inactive']).default('all'),
  role: z.enum(['all', 'member', 'admin', 'leader', 'mediator']).default('all'),
  page: z.number().min(1).default(1),
});

/**
 * ユーザー検索を実行
 * @param input - 検索条件
 * @returns 検索結果
 */
export async function searchUsersAction(input: z.infer<typeof SearchUsersSchema>): Promise<ActionResult<any>> {
  try {
    await ensureAdminPermission();

    const validated = SearchUsersSchema.parse(input);
    const result = await searchUsers(
      validated.searchTerm,
      validated.status,
      validated.role,
      validated.page
    );

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/** ユーザーロール更新のバリデーションスキーマ */
const UpdateUserRoleSchema = z.object({
  userId: z.string().uuid(),
  newRole: z.enum(['member', 'admin', 'leader', 'mediator']),
});

/**
 * ユーザーの権限ロールを更新
 * @param input - 更新対象のユーザーIDと新しいロール
 * @returns 更新結果
 */
export async function updateUserRoleAction(input: z.infer<typeof UpdateUserRoleSchema>): Promise<ActionResult<any>> {
  try {
    const adminId = await getAdminProfileId();

    const validated = UpdateUserRoleSchema.parse(input);
    const result = await updateUserRole(
      validated.userId,
      validated.newRole,
      adminId
    );

    revalidatePath('/(protected)/admin/accounts');
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/** ユーザー状態管理のバリデーションスキーマ */
const UpdateUserStatusSchema = z.object({
  userId: z.string().uuid(),
  isActive: z.boolean(),
});

/**
 * ユーザーのアクティブ/非アクティブ状態を切り替え
 * @param input - ユーザーIDと有効状態
 * @returns 更新結果
 */
export async function updateUserStatusAction(input: z.infer<typeof UpdateUserStatusSchema>): Promise<ActionResult<any>> {
  try {
    const adminId = await getAdminProfileId();

    const validated = UpdateUserStatusSchema.parse(input);
    const result = await updateUserStatus(
      validated.userId,
      validated.isActive,
      adminId
    );

    revalidatePath('/(protected)/admin/accounts');
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================
// ペナルティ管理 Server Actions
// ============================================

/** ペナルティ発行のバリデーションスキーマ */
const IssuePenaltySchema = z.object({
  targetUserId: z.string().uuid(),
  type: z.enum(['notice', 'warning', 'card', 'leave', 'another_dimension']),
  reason: z.string().min(1).max(500),
});

/**
 * 対象ユーザーにペナルティを発行
 * @param input - 発行内容
 * @returns 実行結果
 */
export async function issuePenaltyAction(input: z.infer<typeof IssuePenaltySchema>): Promise<ActionResult<any>> {
  try {
    const adminId = await getAdminProfileId();

    const validated = IssuePenaltySchema.parse(input);
    const result = await issuePenalty(
      validated.targetUserId,
      validated.type,
      validated.reason,
      adminId
    );

    revalidatePath('/(protected)/admin/penalties');
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * ダッシュボード用の概要データ (KPI) を取得
 * @returns 各種統計データ
 */
export async function getDashboardKPIAction(): Promise<ActionResult<any>> {
  try {
    await ensureAdminPermission();

    const kpi = await getDashboardKPI();

    return {
      success: true,
      data: kpi,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================
// 承認ワークフロー Server Actions
// ============================================

/** コンテンツ承認のバリデーションスキーマ */
const ApproveContentSchema = z.object({
  approvalId: z.string().uuid(),
  approved: z.boolean(),
  reviewNote: z.string().max(500).optional(),
});

/**
 * 申請中のコンテンツを承認または却下
 * @param input - 承認内容
 * @returns 処理結果
 */
export async function approveContentAction(input: z.infer<typeof ApproveContentSchema>): Promise<ActionResult<any>> {
  try {
    const adminId = await getAdminProfileId();

    const validated = ApproveContentSchema.parse(input);
    const result = await reviewApproval(
      validated.approvalId,
      validated.approved,
      adminId,
      validated.reviewNote
    );

    revalidatePath('/(protected)/admin/approvals');
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================
// 監査ログ Server Action
// ============================================

/** 監査ログ検索のバリデーションスキーマ */
const SearchAuditLogsSchema = z.object({
  keyword: z.string().max(100).default(''),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  page: z.number().min(1).default(1),
});

/**
 * 監査ログを検索
 * @param input - 検索条件
 * @returns ログ一覧
 */
export async function searchAuditLogsAction(input: z.infer<typeof SearchAuditLogsSchema>): Promise<ActionResult<any>> {
  try {
    await ensureAdminPermission();

    const validated = SearchAuditLogsSchema.parse(input);
    const result = await searchAuditLogs(
      validated.keyword,
      validated.startDate,
      validated.endDate,
      validated.page
    );

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * ペナルティ履歴一覧を取得
 * @param page - ページ番号
 * @param limit - 1ページあたりの取得件数
 * @returns ペナルティ一覧データ
 */
export async function getPenaltiesAction(page: number = 1, limit: number = 100): Promise<ActionResult<any>> {
  try {
    await ensureAdminPermission();

    const result = await getPenalties(page, limit);

    return {
      success: true,
      data: result.penalties,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 承認待ちコンテンツのキューを取得
 * @param page - ページ番号
 * @param limit - 1ページあたりの取得件数
 * @returns 承認待ち一覧データ
 */
export async function getApprovalQueueAction(page: number = 1, limit: number = 50): Promise<ActionResult<any>> {
  try {
    await ensureAdminPermission();

    const result = await getApprovalQueue(page, limit);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/** 検索入力の型定義 */
export type SearchUsersInput = z.infer<typeof SearchUsersSchema>;
/** ロール更新入力の型定義 */
export type UpdateUserRoleInput = z.infer<typeof UpdateUserRoleSchema>;
/** ペナルティ発行入力の型定義 */
export type IssuePenaltyInput = z.infer<typeof IssuePenaltySchema>;
/** コンテンツ承認入力の型定義 */
export type ApproveContentInput = z.infer<typeof ApproveContentSchema>;
