import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { nations } from "./community";
import { userProfiles } from "./user-profiles";

/** nation_events テーブル定義 */
export const nationEvents = pgTable("nation_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  nationId: uuid("nation_id")
    .notNull()
    .references(() => nations.id, { onDelete: "cascade" }),
  organizerId: uuid("organizer_id").references(() => userProfiles.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  startAt: timestamp("start_at", { withTimezone: true }).notNull(),
  endAt: timestamp("end_at", { withTimezone: true }),
  maxParticipants: integer("max_participants"),
  type: text("type"),
  status: text("status").default("draft"),
  conditions: text("conditions"),
  sponsors: text("sponsors"),
  recruitmentStartAt: timestamp("recruitment_start_at", { withTimezone: true }),
  recruitmentEndAt: timestamp("recruitment_end_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/** nation_event_participants テーブル定義 */
export const nationEventParticipants = pgTable("nation_event_participants", {
  eventId: uuid("event_id")
    .notNull()
    .references(() => nationEvents.id, { onDelete: "cascade" }),
  userProfileId: uuid("user_profile_id")
    .notNull()
    .references(() => userProfiles.id, { onDelete: "cascade" }),
  status: text("status").default("going"),
  joinedAt: timestamp("joined_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
