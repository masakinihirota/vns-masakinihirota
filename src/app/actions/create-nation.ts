"use server";

import { createNation } from "@/lib/db/nation-queries";
import { checkGroupRole } from "@/lib/auth/rbac-helper";
import { getSession } from "@/lib/auth/helper";
import { createNationSchema, type CreateNationInput } from "@/lib/validation/schemas";

/**
 * Nation作成 Server Action
 *
 * @design
 * - group_leader ロールのみ実行可能（Deny-by-default）
 * - 国リーダーとして自動付与
 * - 入力値の厳密なバリデーション（Zod使用）
 * - グループ所有権検証を含む
 *
 * @security
 * - セッション検証 必須
 * - group_leader ロール検証 必須
 * - グループ所有権検証（対象リソースがユーザーの組織に属すること）
 * - 入力値のスキーマバリデーション
 * - SQL インジェクション対策: Drizzle ORM 使用
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
  input: unknown,
): Promise<CreateNationResponse> {
  try {
    // ============================================================================
    // 1. 入力バリデーション（Zod）
    // ============================================================================
    const validationResult = createNationSchema.safeParse(input);

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
      validatedInput.groupId,
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
    const nation = await createNation(userId, validatedInput.name, validatedInput.description);

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
