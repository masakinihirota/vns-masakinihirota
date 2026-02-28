/**
 * RBAC (Role-Based Access Control) Middleware
 *
 * @description
 * - 既存の RBAC ヘルパー関数（src/lib/auth/rbac-helper.ts）を Hono で再利用
 * - Context から userId, userRole を取得してセッションオブジェクトを構築
 * - 権限チェックに失敗した場合は 403 Forbidden
 *
 * @design
 * - requireAuth middleware の後に配置する（userId が Context に設定されている前提）
 * - 既存のロジックを変更せず、Hono の薄いラッパーとして実装
 */

import type { MiddlewareHandler } from 'hono';
import {
  checkPlatformAdmin,
  checkGroupRole,
  checkNationRole,
  checkRelationship,
} from '@/lib/auth/rbac-helper';
import type {
  GroupRole,
  NationRole,
  RelationshipType,
  AuthSession,
} from '@/lib/auth/types';
import { createApiError } from './error-handler';
import type { SessionContext } from './auth';

/**
 * プラットフォーム管理者権限を要求する middleware
 *
 * @example
 * app.delete('/admin/users/:id', requirePlatformAdmin, async (c) => { ... });
 */
export const requirePlatformAdmin: MiddlewareHandler<{
  Variables: SessionContext;
}> = async (c, next) => {
  const authSession = c.get('authSession');

  if (!authSession) {
    throw createApiError('UNAUTHORIZED', 'Authentication required');
  }

  const isAdmin = await checkPlatformAdmin(authSession);
  if (!isAdmin) {
    throw createApiError(
      'FORBIDDEN',
      'Platform admin role required',
      { requiredRole: 'platform_admin' }
    );
  }

  await next();
};

/**
 * グループロール権限を要求する middleware ファクトリー
 *
 * @param role - 必要なロール
 * @param groupIdParam - パラメータ名（デフォルト: 'groupId'）
 *
 * @example
 * app.patch('/groups/:groupId', requireGroupRole('leader'), async (c) => { ... });
 */
export function requireGroupRole(
  role: GroupRole,
  groupIdParam: string = 'groupId'
): MiddlewareHandler<{ Variables: SessionContext }> {
  return async (c, next) => {
    const authSession = c.get('authSession');
    const groupId = c.req.param(groupIdParam);

    if (!authSession) {
      throw createApiError('UNAUTHORIZED', 'Authentication required');
    }

    if (!groupId) {
      throw createApiError(
        'VALIDATION_ERROR',
        `${groupIdParam} parameter is required`
      );
    }

    const hasRole = await checkGroupRole(authSession, groupId, role);
    if (!hasRole) {
      throw createApiError(
        'FORBIDDEN',
        `Group role '${role}' required`,
        { requiredRole: role, groupId }
      );
    }

    await next();
  };
}

/**
 * ネーションロール権限を要求する middleware ファクトリー
 *
 * @param role - 必要なロール
 * @param nationIdParam - パラメータ名（デフォルト: 'nationId'）
 *
 * @example
 * app.patch('/nations/:nationId', requireNationRole('leader'), async (c) => { ... });
 */
export function requireNationRole(
  role: NationRole,
  nationIdParam: string = 'nationId'
): MiddlewareHandler<{ Variables: SessionContext }> {
  return async (c, next) => {
    const authSession = c.get('authSession');
    const nationId = c.req.param(nationIdParam);

    if (!authSession) {
      throw createApiError('UNAUTHORIZED', 'Authentication required');
    }

    if (!nationId) {
      throw createApiError(
        'VALIDATION_ERROR',
        `${nationIdParam} parameter is required`
      );
    }

    const hasRole = await checkNationRole(authSession, nationId, role);
    if (!hasRole) {
      throw createApiError(
        'FORBIDDEN',
        `Nation role '${role}' required`,
        { requiredRole: role, nationId }
      );
    }

    await next();
  };
}

/**
 * ユーザー間の関係を要求する middleware ファクトリー
 *
 * @param relationship - 必要な関係
 * @param targetUserIdParam - パラメータ名（デフォルト: 'userId'）
 *
 * @example
 * app.get('/users/:userId/posts', requireRelationship('friend'), async (c) => { ... });
 */
export function requireRelationship(
  relationship: RelationshipType,
  targetUserIdParam: string = 'userId'
): MiddlewareHandler<{ Variables: SessionContext }> {
  return async (c, next) => {
    const authSession = c.get('authSession');
    const targetUserId = c.req.param(targetUserIdParam);

    if (!authSession) {
      throw createApiError('UNAUTHORIZED', 'Authentication required');
    }

    if (!targetUserId) {
      throw createApiError(
        'VALIDATION_ERROR',
        `${targetUserIdParam} parameter is required`
      );
    }

    const hasRelationship = await checkRelationship(
      authSession,
      targetUserId,
      relationship
    );
    if (!hasRelationship) {
      throw createApiError(
        'FORBIDDEN',
        `Relationship '${relationship}' required`,
        { requiredRelationship: relationship, targetUserId }
      );
    }

    await next();
  };
}

/**
 * 自分自身または管理者のみアクセス可能にする middleware ファクトリー
 *
 * @param userIdParam - パラメータ名（デフォルト: 'userId'）
 *
 * @example
 * app.patch('/users/:userId', requireSelfOrAdmin(), async (c) => { ... });
 */
export function requireSelfOrAdmin(
  userIdParam: string = 'userId'
): MiddlewareHandler<{ Variables: SessionContext }> {
  return async (c, next) => {
    const authSession = c.get('authSession');
    const targetUserId = c.req.param(userIdParam);

    if (!authSession) {
      throw createApiError('UNAUTHORIZED', 'Authentication required');
    }

    if (!targetUserId) {
      throw createApiError(
        'VALIDATION_ERROR',
        `${userIdParam} parameter is required`
      );
    }

    // 自分自身または platform_admin ならアクセス許可
    const isSelf = authSession.user.id === targetUserId;
    const isAdmin = authSession.user.role === 'platform_admin';

    if (!isSelf && !isAdmin) {
      throw createApiError(
        'FORBIDDEN',
        'Only the user themselves or platform admin can access this resource',
        { targetUserId }
      );
    }

    await next();
  };
}
