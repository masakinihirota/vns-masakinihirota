"use server";

import { createNation } from "@/lib/db/nation-queries";
import { checkGroupRole, checkInteractionAllowed } from "@/lib/auth/rbac-helper";
import { createNationSchema, type CreateNationInput } from "@/lib/validation/schemas";
import { withAuth, ValidationError, AuthorizationError, ErrorCodes } from "@/lib/errors";
import { logger } from "@/lib/logger";

/**
 * Nation作成 Server Action
 *
 * @design
 * - group_leader ロールのみ実行可能（Deny-by-default）
 * - 国リーダーとして自動付与
 * - 入力バリデーション: Zod
 * - グループ所有権検証を含む
 * - セキュリティイベント記録
 *
 * @security
 * - セッション検証: Better Auth
 * - group_leader ロール検証: 必須
 * - グループ所有権検証: 対象リソースがユーザーの組織に属すること
 * - 幽霊モード制限: checkInteractionAllowed
 * - SQL インジェクション対策: Drizzle ORM 使用
 * - 入力バリデーション: Zod (name 3-100, description 0-500)
 */

export async function createNationAction(input: CreateNationInput) {
  return withAuth(async (session) => {
    logger.debug("Creating nation", {
      userId: session.user.id,
      groupId: input.groupId,
      nationName: input.name,
    });

    // ============================================================================
    // 1. 入力バリデーション（Zod）
    // ============================================================================
    const validated = createNationSchema.safeParse(input);

    if (!validated.success) {
      throw new ValidationError("国の情報に誤りがあります");
    }

    const userId = session.user.id;

    // ============================================================================
    // 2. 権限チェック：group_leader（Deny-by-default）
    // ============================================================================
    const authSession = {
      user: {
        id: session.user.id,
        email: session.user.email || null,
        name: "user",
        role: session.user.role,
      },
      session: {
        id: "server-action-session",
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    };

    const isGroupLeader = await checkGroupRole(
      authSession,
      validated.data.groupId,
      "leader",
    );

    if (!isGroupLeader) {
      // セキュリティイベント記録
      logger.warn("[SECURITY_EVENT] Unauthorized nation creation attempt", {
        event: "authorization_failed",
        severity: "high",
        userId: session.user.id,
        userEmail: session.user.email,
        groupId: validated.data.groupId,
        action: "createNation",
        reason: "INSUFFICIENT_PERMISSIONS",
        timestamp: new Date().toISOString(),
      });

      throw new AuthorizationError(
        "グループのリーダーのみが国を作成できます",
        ErrorCodes.AUTHZ_ROLE_REQUIRED,
        { groupId: validated.data.groupId, requiredRole: "group_leader" }
      );
    }

    // ============================================================================
    // 3. 幽霊モード制限（VNS 設計思想）
    // ============================================================================
    const canInteract = await checkInteractionAllowed(authSession);

    if (!canInteract) {
      // セキュリティイベント記録
      logger.warn("[SECURITY_EVENT] Ghost mask interaction violation", {
        event: "unauthorized_interaction",
        severity: "high",
        userId: session.user.id,
        userEmail: session.user.email,
        action: "createNation",
        reason: "GHOST_MASK_INTERACTION_DENIED",
        timestamp: new Date().toISOString(),
      });

      throw new AuthorizationError(
        "この操作は実行できません",
        ErrorCodes.AUTHZ_RESOURCE_FORBIDDEN,
        { reason: "GHOST_MASK_MODE_ACTIVE" }
      );
    }

    // ============================================================================
    // 4. 国作成
    // ============================================================================
    const nation = await createNation(
      userId,
      validated.data.name,
      validated.data.description,
    );

    logger.info("Nation created successfully", {
      nationId: nation.id,
      userId: session.user.id,
      groupId: validated.data.groupId,
      nationName: nation.name,
      timestamp: new Date().toISOString(),
    });

    return {
      success: true,
      data: {
        id: nation.id,
        name: nation.name,
        description: nation.description,
        ownerUserId: nation.ownerUserId,
        ownerGroupId: nation.ownerGroupId,
        role: nation.role,
        joinedAt: nation.joinedAt,
      },
    };
  }, {
    context: { action: "createNationAction" },
  });
}
