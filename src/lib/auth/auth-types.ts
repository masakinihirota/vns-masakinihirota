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
