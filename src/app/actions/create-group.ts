"use server";

import { createGroup } from "@/lib/db/group-queries";
import { getSession } from "@/lib/auth/helper";

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
    // 2. 入力バリデーション
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
    console.error("[createGroupAction] Error:", error);
    return {
      success: false,
      error: "Failed to create group",
    };
  }
}
