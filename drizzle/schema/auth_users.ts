import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";

// authUsersテーブル定義
export const authUsers = pgTable(
  "auth_users",
  {
    id: uuid("id").primaryKey(),
    aud: text("aud"),
    role: text("role"),
    email: text("email").unique(),
    emailConfirmedAt: timestamp("email_confirmed_at", { withTimezone: true }),
    phone: text("phone").unique(),
    phoneConfirmedAt: timestamp("phone_confirmed_at", { withTimezone: true }),
    lastSignInAt: timestamp("last_sign_in_at", { withTimezone: true }),
    rawAppMetaData: jsonb("raw_app_meta_data"),
    rawUserMetaData: jsonb("raw_user_meta_data"),
    isAnonymous: boolean("is_anonymous").notNull().default(false),
    instanceId: uuid("instance_id"),
    emailChange: text("email_change"),
    emailChangeTokenNew: text("email_change_token_new"),
    emailChangeTokenCurrent: text("email_change_token_current"),
    emailChangeSentAt: timestamp("email_change_sent_at", {
      withTimezone: true,
    }),
    phoneChange: text("phone_change"),
    phoneChangeToken: text("phone_change_token"),
    phoneChangeSentAt: timestamp("phone_change_sent_at", {
      withTimezone: true,
    }),
    confirmationToken: text("confirmation_token"),
    confirmationSentAt: timestamp("confirmation_sent_at", {
      withTimezone: true,
    }),
    recoveryToken: text("recovery_token"),
    recoverySentAt: timestamp("recovery_sent_at", { withTimezone: true }),
    confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
    emailChangeConfirmStatus: integer("email_change_confirm_status").default(0),
    bannedUntil: timestamp("banned_until", { withTimezone: true }),
    isSuperAdmin: boolean("is_super_admin").default(false),
    isSsoUser: boolean("is_sso_user").notNull().default(false),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    encryptedPassword: text("encrypted_password"),
    invitedAt: timestamp("invited_at", { withTimezone: true }),
    reauthenticationToken: text("reauthentication_token"),
    reauthenticationSentAt: timestamp("reauthentication_sent_at", { withTimezone: true }),
  }
);

//
// RLS（Row Level Security）設計
//
// -- auth_users: 自分のデータのみアクセス可能
// CREATE POLICY "auth_users_policy" ON auth_users
// USING (auth.uid() = id);

// -- root_accounts: auth_user_idを通じてアクセス制御
// CREATE POLICY "root_accounts_policy" ON root_accounts
// USING (auth.uid() = (SELECT id FROM auth_users WHERE id = auth_user_id));
