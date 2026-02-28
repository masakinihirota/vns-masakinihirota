"use server";

import { createNation } from "@/lib/db/nation-queries";
import { checkGroupRole } from "@/lib/auth/rbac-helper";
import { getSession } from "@/lib/auth/helper";

/**
 * Nation作成 Server Action
 *
 * @design
 * - group_leader ロールのみ実行可能（Deny-by-default）
 * - 国リーダーとして自動付与
 * - 入力値の厳密なバリデーション
 * - グループ所有権検証を含む
 *
 * @security
 * - セッション検証 必須
 * - group_leader ロール検証 必須
 * - グループ所有権検証（対象リソースがユーザーの組織に属すること）
 * - SQL インジェクション対策: Drizzle ORM 使用
 * - 入力長チェック: name (3-100), description (0-500)
 */

export interface CreateNationInput {
  groupId: string;
  name: string;
  description?: string;
}

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

    const userId = session.user.id;

    // ============================================================================
    // 2. 入力バリデーション
    // ============================================================================

    // グループ ID のバリデーション
    if (!input.groupId || input.groupId.trim().length === 0) {
      return {
        success: false,
        error: "Group ID is required",
      };
    }

    // 国名のバリデーション
    if (!input.name || input.name.trim().length === 0) {
      return {
        success: false,
        error: "Nation name is required",
      };
    }

    if (input.name.length < 3) {
      return {
        success: false,
        error: "Nation name must be at least 3 characters",
      };
    }

    if (input.name.length > 100) {
      return {
        success: false,
        error: "Nation name must be at most 100 characters",
      };
    }

    // 説明のバリデーション
    if (input.description && input.description.length > 500) {
      return {
        success: false,
        error: "Description must be at most 500 characters",
      };
    }

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
        id: session.session.id,
        expiresAt: new Date(session.session.expiresAt),
      },
    };

    const isGroupLeader = await checkGroupRole(
      authSession,
      input.groupId,
      "leader",
    );

    if (!isGroupLeader) {
      return {
        success: false,
        error: "Forbidden: Only group leaders can create nations",
      };
    }

    // ============================================================================
    // 4. 国作成
    // ============================================================================
    const nation = await createNation(userId, input.name, input.description);

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
