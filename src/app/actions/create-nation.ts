"use server";

import { createNation } from "@/lib/db/nation-queries";
import { checkGroupRole, checkInteractionAllowed } from "@/lib/auth/rbac-helper";
import { getSession } from "@/lib/auth/helper";
import { createNationSchema, type CreateNationInput } from "@/lib/validation/schemas";

/**
 * Nation作成 Server Action
 *
 * @design
 * - group_leader ロールのみ実行可能（Deny-by-default）
 * - 国リーダーとして自動付与
 * - Zod によるバリデーション
 * - グループ所有権検証を含む
 *
 * @security
 * - セッション検証 必須
 * - group_leader ロール検証 必須
 * - グループ所有権検証（対象リソースがユーザーの組織に属すること）
 * - SQL インジェクション対策: Drizzle ORM 使用
 * - Zod バリデーション: name (3-100), description (0-500)
 */

export interface CreateNationResponse {
  success: boolean;
  data?: {
    id: string;
    name: string;
    description: string | null;
    ownerUserId: string | null;
    ownerGroupId: string | null;
    role: string | null;
    joinedAt: string | null;
  };
  error?: string;
}

export async function createNationAction(
  input: CreateNationInput,
): Promise<CreateNationResponse> {
  try {
    // ============================================================================
    // 1. 認証チェック（Deny-by-default）
    // ============================================================================
    const session = await getSession();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // ============================================================================
    // 2. 入力バリデーション（Zod）
    // ============================================================================
    const validated = createNationSchema.safeParse(input);

    if (!validated.success) {
      const firstError = validated.error.issues[0];
      return {
        success: false,
        error: firstError?.message || "Validation failed",
      };
    }

    const userId = session.user.id;

    // ============================================================================
    // 3. 権限チェック：group_leader（Deny-by-default）
    // ============================================================================
    const authSession = {
      user: {
        id: session.user.id,
        email: session.user.email ?? null,
        name: session.user.name ?? null,
        role: session.user.role ?? null,
      },
      session: {
        id: session.session?.id ?? "server-action-session",
        expiresAt: new Date(
          session.session?.expiresAt ?? Date.now() + 60 * 60 * 1000,
        ),
      },
    };

    const isGroupLeader = await checkGroupRole(
      authSession,
      validated.data.groupId,
      "leader",
    );

    if (!isGroupLeader) {
      return {
        success: false,
        error: "Unauthorized: Only group leaders can create nations",
      };
    }

    // ============================================================================
    // 4. 幽霊モード制限（VNS 設計思想）
    // ============================================================================
    const canInteract = await checkInteractionAllowed(session);

    if (!canInteract) {
      return {
        success: false,
        error: "GHOST_MASK_INTERACTION_DENIED",
      };
    }

    // ============================================================================
    // 5. 国作成
    // ============================================================================
    const nation = await createNation(
      userId,
      validated.data.name,
      validated.data.description,
    );

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
  } catch (error) {
    console.error("[createNationAction] Error:", error);
    return {
      success: false,
      error: "Failed to create nation",
    };
  }
}
