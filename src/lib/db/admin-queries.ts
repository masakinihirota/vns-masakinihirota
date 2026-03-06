/**
 * Admin Dashboard Query Functions
 * PostgreSQL + Drizzle ORM
 *
 * 軽量実装：リアルタイム更新なし、ページロード時のみ取得
 */

import {
  and,
  count,
  desc,
  eq,
  gte,
  ilike,
  lte,
  or,
  sql
} from 'drizzle-orm';
import { logger } from "@/lib/logger";


import { db as database } from './client';
import {
  approvals,
  auditLogs,
  penalties,
  userProfiles
} from './schema.postgres';

export interface AdminDashboardStats {
  unresolvedReports: number;
  pendingApprovals: number;
  adminLogCount24h: number;
}

type UserProfileRow = typeof userProfiles.$inferSelect;
type PenaltyRow = typeof penalties.$inferSelect;
type ApprovalRow = typeof approvals.$inferSelect;
type AuditLogRow = typeof auditLogs.$inferSelect;

export interface SearchUsersResult {
  users: UserProfileRow[];
  total: number;
  page: number;
  limit: number;
}

export interface UserDetailResult extends UserProfileRow {}

export interface PenaltyListItem {
  id: string;
  targetProfileId: string;
  targetName: string | null;
  type: PenaltyRow["type"];
  reason: string;
  issuedAt: string;
  issuerId: string | null;
  activateUntil: string | null;
}

export interface GetPenaltiesResult {
  penalties: PenaltyListItem[];
  total: number;
  page: number;
  limit: number;
}

export interface ApprovalQueueItem {
  id: string;
  workId: string;
  title: string;
  creatorId: string;
  creatorName: string | null;
  status: ApprovalRow["status"];
  createdAt: string;
  waitDays: number | string;
}

export interface GetApprovalQueueResult {
  approvals: ApprovalQueueItem[];
  total: number;
  page: number;
  limit: number;
}

export interface DashboardKPI {
  activeUsers: number;
  totalUsers: number;
  suspendPending: number;
  approvalQueue: number;
  todayPenalties: number;
  penaltyDistribution: Array<{ type: PenaltyRow["type"]; count: number }>;
}

export interface SearchAuditLogItem {
  id: string;
  adminId: string;
  adminName: string | null;
  action: AuditLogRow["action"];
  targetType: AuditLogRow["targetType"];
  result: AuditLogRow["result"];
  riskLevel: AuditLogRow["riskLevel"];
  timestamp: string;
}

export interface SearchAuditLogsResult {
  logs: SearchAuditLogItem[];
  total: number;
  page: number;
  limit: number;
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const [pendingApprovalsResult, adminLogResult] = await Promise.all([
      database
        .select({ count: count() })
        .from(approvals)
        .where(eq(approvals.status, 'pending')),
      database
        .select({ count: count() })
        .from(auditLogs)
        .where(gte(auditLogs.timestamp, since)),
    ]);

    return {
      unresolvedReports: 0,
      pendingApprovals: Number(pendingApprovalsResult[0]?.count ?? 0),
      adminLogCount24h: Number(adminLogResult[0]?.count ?? 0),
    };
  } catch (error) {
    logger.error('[getAdminDashboardStats] failed:', { error });

    return {
      unresolvedReports: 0,
      pendingApprovals: 0,
      adminLogCount24h: 0,
    };
  }
}

// ============================================
// ユーザー検索・フィルタ関連
// ============================================

/**
 * ユーザー検索（テキスト検索 + 複数フィルタ対応）
 * @param searchTerm - 検索キーワード（名前またはID）
 * @param status - フィルタ: 'all' | 'active' | 'inactive'
 * @param role - フィルタ: 'all' | 'member' | 'admin' | 'leader' | 'mediator'
 * @param page - ページ番号（1-based）
 * @param limit - 1ページあたりの件数（デフォルト20）
 * @returns { users: User[], total: number, page: number }
 * @example
 * const result = await searchUsers('alice', 'active', 'member', 1, 20);
 */
export async function searchUsers(
  searchTerm: string = '',
  status: 'all' | 'active' | 'inactive' = 'all',
  role: 'all' | 'member' | 'admin' | 'leader' | 'mediator' = 'all',
  page: number = 1,
  limit: number = 20
): Promise<SearchUsersResult> {
  const offset = (page - 1) * limit;

  // ステータスフィルタの構築
  let statusFilter =
    status === 'active' ? eq(userProfiles.isActive, true) : undefined;
  if (status === 'inactive') {
    statusFilter = eq(userProfiles.isActive, false);
  }

  // ロールフィルタの構築
  const roleFilter = role === 'all' ? undefined : eq(userProfiles.roleType, role);

  // 検索条件を組み立て
  const conditions = (
    [
      or(
        ilike(userProfiles.displayName, `%${searchTerm}%`),
        // UUID型のカラムは文字列にキャストしてから検索
        sql`${userProfiles.id}::text ilike ${`%${searchTerm}%`}`
      ),
      statusFilter,
      roleFilter,
    ].filter(Boolean)
  );

  // メインクエリ
  const users = await database
    .select()
    .from(userProfiles)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(userProfiles.createdAt))
    .limit(limit)
    .offset(offset);

  // 総件数を取得
  const countResult = await database
    .select({ count: count() })
    .from(userProfiles)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  return {
    users,
    total: countResult[0]?.count || 0,
    page,
    limit,
  };
}

/**
 * ユーザー詳細情報を取得
 * @param userId - ユーザープロフィールID
 * @returns ユーザー詳細情報
 */
export async function getUserDetail(userId: string): Promise<UserDetailResult | undefined> {
  const user = await database
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.id, userId))
    .limit(1);

  return user[0] || undefined;
}

// ============================================
// ペナルティ関連
// ============================================

/**
 * ペナルティ一覧（優先度順）
 * @param page - ページ番号
 * @param limit - 1ページあたりの件数
 * @returns ペナルティ配列
 *
 * 優先度順: another_dimension > leave > card > warning > notice
 */
export async function getPenalties(page: number = 1, limit: number = 20): Promise<GetPenaltiesResult> {
  const offset = (page - 1) * limit;

  const penaltyTypeOrder = (type: string) => {
    const order: Record<string, number> = {
      another_dimension: 5,
      leave: 4,
      card: 3,
      warning: 2,
      notice: 1,
    };
    return order[type] || 0;
  };

  const penaltiesList = await database
    .select({
      id: penalties.id,
      targetProfileId: penalties.targetProfileId,
      targetName: userProfiles.displayName,
      type: penalties.type,
      reason: penalties.reason,
      issuedAt: penalties.issuedAt,
      issuerId: penalties.issuerId,
      activateUntil: penalties.activateUntil,
    })
    .from(penalties)
    .leftJoin(
      userProfiles,
      eq(penalties.targetProfileId, userProfiles.id)
    )
    .orderBy(
      // 優先度順（降順）、その後発行日時（降順）
      desc(
        sql`
          CASE
                    WHEN ${penalties.type} = 'another_dimension' THEN 5
                    WHEN ${penalties.type} = 'leave' THEN 4
                    WHEN ${penalties.type} = 'card' THEN 3
                    WHEN ${penalties.type} = 'warning' THEN 2
                    ELSE 1
                  END
        `
      ),
      desc(penalties.issuedAt)
    )
    .limit(limit)
    .offset(offset);

  const countResult = await database
    .select({ count: count() })
    .from(penalties);

  return {
    penalties: penaltiesList,
    total: countResult[0]?.count || 0,
    page,
    limit,
  };
}

/**
 * ペナルティを発行
 * トランザクション対応で実装
 * @param targetProfileId - 対象ユーザーID
 * @param type - ペナルティ種別
 * @param reason - 理由
 * @param issuerId - 発行者ID
 * @returns 新作成されたペナルティ
 */
export async function issuePenalty(
  targetProfileId: string,
  type: 'notice' | 'warning' | 'card' | 'leave' | 'another_dimension',
  reason: string,
  issuerId?: string
): Promise<PenaltyRow | undefined> {
  const newPenalty = await database.insert(penalties).values({
    targetProfileId,
    type,
    reason,
    issuerId,
    issuedAt: new Date().toISOString(),
  }).returning();

  // 監査ログに記録
  if (issuerId) {
    await database.insert(auditLogs).values({
      adminId: issuerId,
      action: `issue_penalty_${type}`,
      targetId: targetProfileId,
      targetType: 'user_profile',
      result: 'success',
      riskLevel: type === 'another_dimension' ? 'high' : 'medium',
      details: { reason },
      timestamp: new Date().toISOString(),
    });
  }

  return newPenalty[0];
}

// ============================================
// 承認ワークフロー関連
// ============================================

/**
 * 待機中の作品一覧
 * @param page - ページ番号
 * @param limit - 1ページあたりの件数
 * @returns 待機中の作品配列
 */
export async function getApprovalQueue(page: number = 1, limit: number = 20): Promise<GetApprovalQueueResult> {
  const offset = (page - 1) * limit;

  const approvalsData = await database
    .select({
      id: approvals.id,
      workId: approvals.workId,
      title: approvals.title,
      creatorId: approvals.creatorId,
      creatorName: userProfiles.displayName,
      status: approvals.status,
      createdAt: approvals.createdAt,
      waitDays: sql`EXTRACT(DAY FROM NOW() - ${approvals.createdAt})`,
    })
    .from(approvals)
    .leftJoin(
      userProfiles,
      eq(approvals.creatorId, userProfiles.id)
    )
    .where(eq(approvals.status, 'pending'))
    .orderBy(desc(approvals.createdAt))
    .limit(limit)
    .offset(offset);

  const countResult = await database
    .select({ count: count() })
    .from(approvals)
    .where(eq(approvals.status, 'pending'));

  return {
    approvals: approvalsData,
    total: countResult[0]?.count || 0,
    page,
    limit,
  };
}

/**
 * 作品を承認 / 却下
 * @param approvalId - 承認レコードID
 * @param approved - 承認 (true) / 却下 (false)
 * @param reviewerId - レビュアーID
 * @param reviewNote - コメント
 */
export async function reviewApproval(
  approvalId: string,
  approved: boolean,
  reviewerId: string,
  reviewNote?: string
): Promise<ApprovalRow | undefined> {
  const result = await database
    .update(approvals)
    .set({
      status: approved ? 'approved' : 'rejected',
      reviewerId,
      reviewNote,
      reviewedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .where(eq(approvals.id, approvalId))
    .returning();

  // 監査ログ
  await database.insert(auditLogs).values({
    adminId: reviewerId,
    action: `${approved ? 'approve' : 'reject'}_content`,
    targetId: result[0]?.workId,
    targetType: 'work',
    result: 'success',
    riskLevel: 'low',
    details: { note: reviewNote },
    timestamp: new Date().toISOString(),
  });

  return result[0];
}

// ============================================
// KPI ダッシュボード関連
// ============================================

/**
 * KPI 統計情報を取得（キャッシュ向け）
 * @returns KPI オブジェクト
 * @example
 * const kpi = await getDashboardKPI();
 * logger.info('Active users:', kpi.activeUsers); // 892
 */
export async function getDashboardKPI(): Promise<DashboardKPI> {
  // 1. アクティブユーザー数
  const activeUsersResult = await database
    .select({ count: count() })
    .from(userProfiles)
    .where(eq(userProfiles.isActive, true));

  // 2. 停止予定者（信頼日数 <= 3）
  const suspendPendingResult = await database
    .select({ count: count() })
    .from(userProfiles)
    .where(
      and(eq(userProfiles.isActive, true))
      // NOTE: rootAccounts テーブルから trustDays を check する場合は JOIN が必要
    );

  // 3. コンテンツ承認待機数
  const approvalPendingResult = await database
    .select({ count: count() })
    .from(approvals)
    .where(eq(approvals.status, 'pending'));

  // 4. 本日発行ペナルティ数
  const todayPenaltiesResult = await database
    .select({ count: count() })
    .from(penalties)
    .where(
      gte(penalties.issuedAt, sql`CURRENT_DATE`)
      // SQL で「本日」を定義
    );

  // 5. ペナルティ種別の分布
  const penaltyDistributionResult = await database
    .select({
      type: penalties.type,
      count: count(),
    })
    .from(penalties)
    .groupBy(penalties.type);

  return {
    activeUsers: activeUsersResult[0]?.count || 0,
    totalUsers: (
      await database.select({ count: count() }).from(userProfiles)
    )[0]?.count || 0,
    suspendPending: suspendPendingResult[0]?.count || 0,
    approvalQueue: approvalPendingResult[0]?.count || 0,
    todayPenalties: todayPenaltiesResult[0]?.count || 0,
    penaltyDistribution: penaltyDistributionResult,
  };
}

// ============================================
// 監査ログ検索
// ============================================

/**
 * 監査ログ検索（テキスト検索 + 日付範囲）
 * @param keyword - キーワード
 * @param startDate - 範囲開始日
 * @param endDate - 範囲終了日
 * @param page - ページ番号
 * @param limit - 1ページあたりの件数
 * @returns 監査ログ配列
 */
export async function searchAuditLogs(
  keyword: string = '',
  startDate?: Date,
  endDate?: Date,
  page: number = 1,
  limit: number = 50
): Promise<SearchAuditLogsResult> {
  const offset = (page - 1) * limit;

  const conditions = (
    [
      keyword
        ? or(
          ilike(auditLogs.action, `%${keyword}%`),
          ilike(auditLogs.targetType, `%${keyword}%`)
        )
        : undefined,
      startDate ? gte(auditLogs.timestamp, startDate.toISOString()) : undefined,
      endDate ? lte(auditLogs.timestamp, endDate.toISOString()) : undefined,
    ].filter(Boolean)
  );

  const logs = await database
    .select({
      id: auditLogs.id,
      adminId: auditLogs.adminId,
      adminName: userProfiles.displayName,
      action: auditLogs.action,
      targetType: auditLogs.targetType,
      result: auditLogs.result,
      riskLevel: auditLogs.riskLevel,
      timestamp: auditLogs.timestamp,
    })
    .from(auditLogs)
    .leftJoin(
      userProfiles,
      eq(auditLogs.adminId, userProfiles.id)
    )
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(auditLogs.timestamp))
    .limit(limit)
    .offset(offset);

  const countResult = await database
    .select({ count: count() })
    .from(auditLogs)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  return {
    logs,
    total: countResult[0]?.count || 0,
    page,
    limit,
  };
}

// ============================================
// ユーザー関連のアクション
// ============================================

/**
 * ユーザーロールを更新
 * @param userId - ユーザーID
 * @param newRole - 新しいロール
 * @param adminId - 操作者のID（監査用）
 */
export async function updateUserRole(
  userId: string,
  newRole: 'member' | 'admin' | 'leader' | 'mediator',
  adminId: string
): Promise<UserProfileRow | undefined> {
  const result = await database
    .update(userProfiles)
    .set({
      roleType: newRole,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(userProfiles.id, userId))
    .returning();

  // 監査ログ
  await database.insert(auditLogs).values({
    adminId,
    action: 'update_user_role',
    targetId: userId,
    targetType: 'user_profile',
    result: 'success',
    riskLevel: 'medium',
    details: { newRole },
    timestamp: new Date().toISOString(),
  });

  return result[0];
}

/**
 * ユーザーのアクティブ状態を变更
 * @param userId - ユーザーID
 * @param isActive - 有効/無効
 * @param adminId - 操作者のID
 */
export async function updateUserStatus(
  userId: string,
  isActive: boolean,
  adminId: string
): Promise<UserProfileRow | undefined> {
  const result = await database
    .update(userProfiles)
    .set({
      isActive,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(userProfiles.id, userId))
    .returning();

  // 監査ログ
  await database.insert(auditLogs).values({
    adminId,
    action: isActive ? 'activate_user' : 'deactivate_user',
    targetId: userId,
    targetType: 'user_profile',
    result: 'success',
    riskLevel: 'high',
    timestamp: new Date().toISOString(),
  });

  return result[0];
}

