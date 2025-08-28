import { relations } from 'drizzle-orm'
import { authUsers } from "./schema/root_accounts/auth_users"
import { rootAccounts } from "./schema/root_accounts/root_accounts"

// 関係を明示した型定義
export type AuthUserWithRootAccount = {
  authUser: typeof authUsers.$inferSelect;
  rootAccount: typeof rootAccounts.$inferSelect;
};

// Drizzle relationの定義
export const authUsersRelations = relations(authUsers, ({ one }) => ({
  rootAccount: one(rootAccounts),
}));

export const rootAccountsRelations = relations(rootAccounts, ({ one }) => ({
  authUser: one(authUsers, {
    fields: [rootAccounts.authUserId],
    references: [authUsers.id],
  }),
}));
