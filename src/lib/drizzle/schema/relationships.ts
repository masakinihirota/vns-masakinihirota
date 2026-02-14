import { pgEnum, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { userProfiles } from "./user-profiles";

/** alliance_status 列挙型 */
export const allianceStatusEnum = pgEnum("alliance_status", [
  "requested",
  "pre_partner",
  "partner",
]);

/** follow_status 列挙型 */
export const followStatusEnum = pgEnum("follow_status", [
  "watch",
  "follow",
]);

/** alliances テーブル定義 */
export const alliances = pgTable("alliances", {
  id: uuid("id").primaryKey().defaultRandom(),
  profileAId: uuid("profile_a_id")
    .notNull()
    .references(() => userProfiles.id, { onDelete: "cascade" }),
  profileBId: uuid("profile_b_id")
    .notNull()
    .references(() => userProfiles.id, { onDelete: "cascade" }),
  status: allianceStatusEnum("status").notNull().default("requested"),
  metadata: text("metadata"),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** follows テーブル定義 */
export const follows = pgTable(
  "follows",
  {
    followerProfileId: uuid("follower_profile_id")
      .notNull()
      .references(() => userProfiles.id, { onDelete: "cascade" }),
    followedProfileId: uuid("followed_profile_id")
      .notNull()
      .references(() => userProfiles.id, { onDelete: "cascade" }),
    status: followStatusEnum("status").notNull().default("watch"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.followerProfileId, table.followedProfileId] }),
  ],
);
