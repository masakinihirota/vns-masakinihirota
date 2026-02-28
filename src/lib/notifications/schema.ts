/**
 * 通知システム - データベーススキーマ定義
 *
 * @description
 * ユーザーへの通知（グループ招待、グループ参加通知、承認など）を管理するスキーマ
 *
 * テーブル構成：
 * - notifications: 通知メッセージ本体
 * - notification_status: ユーザーごとの既読状態
 */

/**
 * 通知の型
 */
export type NotificationType =
  | "group_invitation" // グループ招待
  | "group_joined" // グループに参加したユーザー
  | "nation_invitation" // 国招待
  | "approval_request" // 承認リクエスト
  | "approval_completed" // 承認完了
  | "system_alert" // システム警告
  | "admin_notice"; // 管理者通知

/**
 * 通知スキーマ定義（Drizzle ORM形式）
 *
 * @note
 * 実装例：
 * ```ts
 * export const notifications = pgTable('notifications', {
 *   id: uuid('id').primaryKey().defaultRandom(),
 *   userId: uuid('user_id').notNull().references(() => user.id),
 *   type: text('type').$type<NotificationType>().notNull(),
 *   title: varchar('title', { length: 255 }).notNull(),
 *   message: text('message').notNull(),
 *   relatedEntityId: uuid('related_entity_id'), // グループID, 国IDなど
 *   relatedEntityType: text('related_entity_type'), // 'group', 'nation', etc.
 *   isRead: boolean('is_read').notNull().default(false),
 *   actionUrl: varchar('action_url', { length: 500 }), // CallToAction用URL
 *   createdAt: timestamp('created_at').notNull().defaultNow(),
 *   expiresAt: timestamp('expires_at'), // 有効期限（nullなら無期限）
 * });
 * ```
 */

/**
 * 通知テンプレート例
 */
export const NOTIFICATION_TEMPLATES = {
  GROUP_INVITATION: {
    title: "グループ招待",
    template: (groupName: string, senderName: string) =>
      `${senderName}さんが「${groupName}」への参加を招待しました`,
  },
  GROUP_JOINED: {
    title: "グループに参加してくれました",
    template: (groupName: string, userName: string) =>
      `${userName}さんが「${groupName}」に参加しました`,
  },
  APPROVAL_REQUEST: {
    title: "承認待ちリクエスト",
    template: (requestType: string) => `${requestType}の承認待ちリクエストがあります`,
  },
  APPROVAL_COMPLETED: {
    title: "承認完了",
    template: (requestType: string) => `${requestType}が承認されました`,
  },
};

/**
 * サーバーアクション: 通知を作成
 */
export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  options?: {
    relatedEntityId?: string;
    relatedEntityType?: string;
    actionUrl?: string;
    expiresAt?: Date;
  }
): Promise<{ id: string } | null> {
  // TODO: Drizzle ORM insert を実装
  // const result = await db.insert(notifications).values({...});
  return null;
}

/**
 * サーバーアクション: 通知を既読にする
 */
export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  // TODO: Drizzle ORM update を実装
  // await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, notificationId));
  return true;
}

/**
 * サーバークエリ: ユーザーの未読通知を取得
 */
export async function getUnreadNotifications(userId: string, limit: number = 10) {
  // TODO: Drizzle ORM select を実装
  // const results = await db.select().from(notifications).where(
  //   and(
  //     eq(notifications.userId, userId),
  //     eq(notifications.isRead, false)
  //   )
  // ).limit(limit);
  return [];
}

/**
 * サーバークエリ: ユーザーのすべての通知を取得
 */
export async function getAllNotifications(
  userId: string,
  options?: { limit?: number; offset?: number }
) {
  // TODO: Drizzle ORM select を実装
  return [];
}
