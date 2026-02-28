/**
 * 認証関連の型定義とデータベース型からクライアント型への変換ユーティリティ
 */

/**
 * データベースのuserテーブルの型（スネークケース）
 */
export interface DbUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  is_anonymous: boolean | null;
  role: string | null;
}

/**
 * クライアント向けのUser型（キャメルケース）
 */
export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  isAnonymous: boolean;
  role: string;
}

/**
 * データベースのsessionテーブルの型
 */
export interface DbSession {
  id: string;
  expiresAt: Date;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  userId: string;
}

/**
 * セッション情報（クライアント向け）
 */
export interface Session {
  user: User;
  session: DbSession;
}

/**
 * データベースのユーザー型をクライアント型に変換
 */
export function dbUserToUser(dbUser: DbUser): User {
  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    emailVerified: dbUser.emailVerified,
    image: dbUser.image,
    createdAt: dbUser.createdAt,
    updatedAt: dbUser.updatedAt,
    isAnonymous: dbUser.is_anonymous ?? false,
    role: dbUser.role ?? "user",
  };
}

/**
 * クライアントのユーザー型をデータベース型に変換
 */
export function userToDbUser(user: User): Partial<DbUser> {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
    image: user.image,
    is_anonymous: user.isAnonymous,
    role: user.role,
  };
}

/**
 * Better Auth のユーザー型拡張
 * Better Auth が返すユーザーオブジェクトの型
 */
export interface BetterAuthUser extends User {
  // Better Auth が追加するその他のフィールド
}

/**
 * 型ガード: オブジェクトがUser型かどうか
 */
export function isUser(obj: unknown): obj is User {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "email" in obj &&
    "isAnonymous" in obj
  );
}

/**
 * 型ガード: オブジェクトがSession型かどうか
 */
export function isSession(obj: unknown): obj is Session {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "user" in obj &&
    "session" in obj &&
    isUser((obj as Session).user)
  );
}

// ============================================================================
// RBAC: Role-Based Access Control
// ============================================================================

/**
 * 役割型（RoleType）
 *
 * ユーザーがシステム内で持つ役職・権限を表す。
 * 階層的な権限管理を実現するための基本型。
 *
 * ## カテゴリ
 * - **プラットフォーム管理権限**: `platform_admin`
 * - **基本ロール**: `leader`, `member`
 * - **組織ロール**: `group_*`
 * - **国ロール**: `nation_*`
 *
 * ## 原則
 * - 役割型と関係性型（RelationshipType）は明確に分離する
 * - 役割型は「組織内の権限」を表す
 * - 関係性型は「ユーザー間の関係」を表す
 */
export type RoleType =
  // プラットフォーム管理権限（単独フル権限）
  | "platform_admin"
  // 基本ロール（組織/国未所属時）
  | "leader"
  | "member"
  // 組織ロール
  | "group_leader"
  | "group_sub_leader"
  | "group_member"
  | "group_mediator"
  // 国ロール
  | "nation_leader"
  | "nation_sub_leader"
  | "nation_member"
  | "nation_mediator";

/**
 * 関係性型（RelationshipType）
 *
 * ユーザー間の関係性を表す。
 * アクセス権限の判定に使用される。
 *
 * ## 関係性レベル（低→高）
 * 1. `watch`: 監視関係（一方的な観察）
 * 2. `follow`: フォロー関係（興味あり）
 * 3. `business_partner`: ビジネスパートナー（仕事関係）
 * 4. `friend`: 友人関係（プライベート共有可）
 * 5. `pre_partner`: パートナー予備（相互理解進行中）
 * 6. `partner`: パートナー（最高レベルの信頼関係）
 *
 * ## 原則
 * - 役割型（RoleType）と関係性型は明確に分離する
 * - 関係性型は「ユーザー間の信頼レベル」を表す
 * - 役割型は「組織内の権限」を表す
 */
export type RelationshipType =
  | "watch"
  | "follow"
  | "business_partner"
  | "friend"
  | "pre_partner"
  | "partner";

/**
 * 型ガード: 文字列がRoleTypeかどうか
 */
export function isRoleType(value: string): value is RoleType {
  const validRoles: RoleType[] = [
    "platform_admin",
    "leader",
    "member",
    "group_leader",
    "group_sub_leader",
    "group_member",
    "group_mediator",
    "nation_leader",
    "nation_sub_leader",
    "nation_member",
    "nation_mediator",
  ];
  return validRoles.includes(value as RoleType);
}

/**
 * 型ガード: 文字列がRelationshipTypeかどうか
 */
export function isRelationshipType(value: string): value is RelationshipType {
  const validRelationships: RelationshipType[] = [
    "watch",
    "follow",
    "business_partner",
    "friend",
    "pre_partner",
    "partner",
  ];
  return validRelationships.includes(value as RelationshipType);
}
