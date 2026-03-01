/**
 * RBAC Types - ロール型定義
 * "use server" 制約を回避するため、型定義を別ファイルに分離
 */

/**
 * マスク（仮面）カテゴリー
 * @see docs/
 */
export type MaskCategory = "ghost" | "persona";

/**
 * グループロールの型
 * @see docs/rbac-group-nation-separation.md
 */
export type GroupRole = "leader" | "sub_leader" | "member" | "mediator";

/**
 * 国ロールの型
 * @see docs/rbac-group-nation-separation.md
 */
export type NationRole = "leader" | "sub_leader" | "member" | "mediator";

/**
 * ユーザー間関係の型
 */
export type RelationshipType =
  | "follow"
  | "friend"
  | "business_partner"
  | "watch"
  | "pre_partner"
  | "partner";

/**
 * Server Actionで受け取るセッション情報の型
 * Better Auth のセッション + ユーザー情報アグリゲート
 */
export interface AuthSession {
  user: {
    id: string;
    email: string | null;
    name: string | null;
    role?: string | null | undefined; // 'platform_admin' | 'user' | null | undefined (Better Auth compatibility - optional)
    activeProfileId?: string | null; // 現在被っている仮面のID (VNS multi-mask system)
  };
  session: {
    id: string;
    expiresAt: Date;
  };
}
