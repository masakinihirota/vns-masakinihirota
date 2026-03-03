"use server";

import { createGroup } from "@/lib/db/group-queries";
import { checkInteractionAllowed } from "@/lib/auth/rbac-helper";
import { createGroupSchema, type CreateGroupInput } from "@/lib/validation/schemas";
import { withAuth, ValidationError, AuthorizationError, ErrorCodes } from "@/lib/errors";
import { logger } from "@/lib/logger";

/**
 * Group作成 Server Action
 *
 * @design
 * - 認証必須（withAuth でラップ）
 * - グループリーダーとして自動付与
 * - 入力バリデーション: Zod
 * - 幽霊モード制限チェック
 * - セキュリティイベント記録
 *
 * @security
 * - セッション検証: Better Auth
 * - 幽霊モード制限: checkInteractionAllowed
 * - 入力バリデーション: Zod
 * - SQL インジェクション対策: Drizzle ORM 使用
 */

export async function createGroupAction(input: CreateGroupInput) {
  return withAuth(async (session) => {
    logger.debug("Creating group", {
      userId: session.user.id,
      groupName: input.name,
    });

    // ============================================================================
    // 1. 入力バリデーション（Zod）
    // ============================================================================
    const validated = createGroupSchema.safeParse(input);

    if (!validated.success) {
      throw new ValidationError("グループ情報に誤りがあります");
    }

    const userId = session.user.id;

    // ============================================================================
    // 2. 幽霊モード制限（VNS 設計思想）
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

    const canInteract = await checkInteractionAllowed(authSession);

    if (!canInteract) {
      // セキュリティイベント記録
      logger.warn("[SECURITY_EVENT] Ghost mask interaction violation", {
        event: "unauthorized_interaction",
        severity: "high",
        userId: session.user.id,
        userEmail: session.user.email,
        action: "createGroup",
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
    // 3. グループ作成
    // ============================================================================
    const group = await createGroup(
      userId,
      validated.data.name,
      validated.data.description,
    );

    logger.info("Group created successfully", {
      groupId: group.id,
      userId: session.user.id,
      groupName: group.name,
      timestamp: new Date().toISOString(),
    });

    return {
      success: true,
      data: group,
    };
  }, {
    context: { action: "createGroupAction" },
  });
}
