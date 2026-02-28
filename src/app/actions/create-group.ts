"use server";

import { createGroup } from "@/lib/db/group-queries";
import { getSession } from "@/lib/auth/helper";
import { createGroupSchema, type CreateGroupInput } from "@/lib/validation/schemas";

/**
 * Group作成 Server Action
 *
 * @design
 * - 認証済みユーザーのみ実行可能（Deny-by-default）
 * - グループリーダーとして自動付与
 * - 入力値の厳密なバリデーション（Zod使用）
 *
 * @security
 * - セッション検証 必須
 * - 入力値のスキーマバリデーション
 * - SQL インジェクション対策: Drizzle ORM 使用
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
  input: unknown,
): Promise<CreateGroupResponse> {
  try {
    // ============================================================================
    // 1. 入力バリデーション（Zod）
    // ============================================================================
    const validationResult = createGroupSchema.safeParse(input);

    if (!validationResult.success) {
      const flatErrors = validationResult.error.flatten();
      const firstError = Object.values(flatErrors.fieldErrors)[0]?.[0] || "Invalid input";
      return {
        success: false,
        error: `Validation error: ${firstError}`,
      };
    }

    const validatedInput = validationResult.data;

    // ============================================================================
    // 2. 認証チェック（Deny-by-default）
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
    // 3. グループ作成
    // ============================================================================
    const group = await createGroup(userId, validatedInput.name, validatedInput.description);

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
