"use server";

import { createGroup } from "@/lib/db/group-queries";
import { getSession } from "@/lib/auth/helper";
import { checkInteractionAllowed } from "@/lib/auth/rbac-helper";

/**
 * Group作成 Server Action
 *
 * @design
 * - 認証済みユーザーのみ実行可能（Deny-by-default）
 * - グループリーダーとして自動付与
 * - 入力値の厳密なバリデーション
 *
 * @security
 * - セッション検証 必須
 * - SQL インジェクション対策: Drizzle ORM 使用
 * - 入力長チェック: name (3-100), description (0-500)
 */

export interface CreateGroupInput {
  name: string;
  description?: string;
}

export interface CreateGroupResponse {
  success: boolean;
  data?: {
    id: string;
    name: string;
    description: string | null;
    leaderId: string | null;
    role: string | null;
    joinedAt: string | null;
  };
  error?: string;
}

export async function createGroupAction(
  input: CreateGroupInput,
): Promise<CreateGroupResponse> {
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
    // 2. 幽霊モード制限（VNS 設計思想）
    // ============================================================================
    const canInteract = await checkInteractionAllowed(session);

    if (!canInteract) {
      return {
        success: false,
        error: "GHOST_MASK_INTERACTION_DENIED",
      };
    }

    // ============================================================================
    // 3. 入力バリデーション
    // ============================================================================

    // グループ名のバリデーション
    if (!input.name || input.name.trim().length === 0) {
      return {
        success: false,
        error: "Group name is required",
      };
    }

    if (input.name.length < 3) {
      return {
        success: false,
        error: "Group name must be at least 3 characters",
      };
    }

    if (input.name.length > 100) {
      return {
        success: false,
        error: "Group name must be at most 100 characters",
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
    // 3. グループ作成
    // ============================================================================
    const group = await createGroup(userId, input.name, input.description);

    return {
      success: true,
      data: group,
    };
  } catch (error) {
    // ✅ FIXED: エラー種別を区別
    if (error instanceof Error) {
      const errorMessage = error.message;

      // RBACError: 幽霊チェック失敗
      if (errorMessage.includes('GHOST_CHECK_FAILED')) {
        return {
          success: false,
          error: "Unable to verify ghost mask status. Please try again.",
        };
      }

      // Database error
      if (errorMessage.includes('database') || errorMessage.includes('Database')) {
        console.error("[createGroupAction] Database error:", errorMessage);
        return {
          success: false,
          error: "Database error. Please try again later.",
        };
      }
    }

    console.error("[createGroupAction] Unexpected error:", error);
    return {
      success: false,
      error: "Failed to create group",
    };
  }
}
