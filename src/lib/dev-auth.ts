/**
 * 開発環境用ダミーユーザーデータ
 *
 * @description
 * NEXT_PUBLIC_USE_REAL_AUTH=false の場合、このダミーデータを使用します。
 * 霬番環境では使用されません。
 */

export const DUMMY_USERS = {
  /** 通常ユーザー */
  USER: {
    id: "dev-user-001",
    email: "user@example.com",
    name: "開発用ユーザー",
    role: "user" as const,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-02-28"),
  },

  /** 管理者ユーザー */
  ADMIN: {
    id: "dev-admin-001",
    email: "admin@example.com",
    name: "開発用管理者",
    role: "admin" as const,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-02-28"),
  },
} as const;

/** ダミーセッション */
export const createDummySession = (userType: "user" | "admin" = "user") => {
  const user = userType === "admin" ? DUMMY_USERS.ADMIN : DUMMY_USERS.USER;

  return {
    user,
    session: {
      id: `dev-session-${userType}-001`,
      userId: user.id,
      token: "dev-token-" + Math.random().toString(36).substring(7),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };
};
