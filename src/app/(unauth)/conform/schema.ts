import { z } from "zod";

// /**
//  * ユーザープロフィールテーブル
//  * ユーザーの公開プロフィール情報を管理
//  */
// export const userProfiles = pgTable("user_profiles", {
//   id: uuid("id").primaryKey().defaultRandom(),
//   rootAccountId: uuid("root_account_id")
//     .references(() => rootAccounts.id)
//     .notNull(),
//   profileName: text("profile_name").notNull(),
//   profileType: profileTypeEnum("profile_type").notNull().default("main"),
//   status: profileStatusEnum("status").notNull().default("active"),
//   purpose: text("purpose"),
//   isAnonymous: boolean("is_anonymous").notNull().default(false),
//   isVerified: boolean("is_verified").notNull().default(false),
//   createdAt: timestamp("created_at", { withTimezone: true })
//     .notNull()
//     .defaultNow(),
//   updatedAt: timestamp("updated_at", { withTimezone: true })
//     .notNull()
//     .defaultNow(),
// });

export const userProfileSchema = z.object({
  profileName: z.string().min(1, "Profile name is required"),
  profileType: z.enum(["main", "sub", "anonymous", "self"]).default("main"),
  status: z.enum(["active", "inactive", "suspended"]).default("active"),
  purpose: z.string().optional(),
  isVerified: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});
