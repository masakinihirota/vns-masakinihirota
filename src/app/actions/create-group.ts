"use server";

import { createGroup } from "@/lib/db/group-queries";
import { getSession } from "@/lib/auth/helper";
import { checkInteractionAllowed } from "@/lib/auth/rbac-helper";
import { createGroupSchema, type CreateGroupInput } from "@/lib/validation/schemas";

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

    // ============================================================================
    // 2. 入力バリデーション（Zod）
    // ============================================================================
    if (!input.name || input.name.trim().length === 0) {
      return {
        success: false,
        error: "Group name is required",
      };
    }

    const validated = createGroupSchema.safeParse(input);

    if (!validated.success) {
      const firstError = validated.error.issues[0];
      return {
        success: false,
        error: firstError?.message || "Validation failed",
      };
    }

    const userId = session.user.id;

    // ============================================================================
    // 3. 幽霊モード制限（VNS 設計思想）
    // ============================================================================
    const canInteract = await checkInteractionAllowed(session);

    if (!canInteract) {
      return {
        success: false,
        error: "GHOST_MASK_INTERACTION_DENIED",
      };
    }

    // ============================================================================
    // 4. グループ作成
    // ============================================================================
    const group = await createGroup(
      userId,
      validated.data.name,
      validated.data.description,
    );

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
