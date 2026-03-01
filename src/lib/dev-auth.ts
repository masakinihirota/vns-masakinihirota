/**
 * 開発環境用ダミーユーザーデータ
 *
 * @description
 * USE_REAL_AUTH=false の場合、このダミーデータを使用します。
 * 本番環境では使用されません。
 */

export const DUMMY_USERS = {
  /** 通常ユーザー 1 */
  USER1: {
    id: "dev-user-001",
    email: "user1@example.com",
    name: "テストユーザー1",
    role: "user" as const,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-02-28"),
  },

  /** 通常ユーザー 2 */
  USER2: {
    id: "dev-user-002",
    email: "user2@example.com",
    name: "テストユーザー2",
    role: "user" as const,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-02-28"),
  },

  /** 通常ユーザー 3 */
  USER3: {
    id: "dev-user-003",
    email: "user3@example.com",
    name: "テストユーザー3",
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

/**
 * ユーザタイプ（鍵）
 */
export type DummyUserType = keyof typeof DUMMY_USERS;

/**
 * データミーセッション生成関数
 *
 * @param userType - ユーザーキー（USER1, USER2, USER3, ADMIN）
 * @returns Better Auth 互換のセッションオブジェクト
 */
export const createDummySession = (userType: DummyUserType = "USER1") => {
  const user = DUMMY_USERS[userType];

  if (!user) {
    throw new Error(`Invalid user type: ${userType}. Valid types are: ${Object.keys(DUMMY_USERS).join(', ')}`);
  }

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
