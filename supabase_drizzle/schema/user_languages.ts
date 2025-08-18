import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  primaryKey,
  index,
} from "drizzle-orm/pg-core";
import { languageProficiencyEnum } from "./enums";
import { rootAccounts } from "./root_accounts";
import { languages } from "./languages";

export const userLanguages = pgTable(
  "user_languages",
  {
    rootAccountId: uuid("root_account_id")
      .notNull()
      .references(() => rootAccounts.id, { onDelete: "cascade" }),
    languageId: varchar("language_id", { length: 10 })
      .notNull()
      .references(() => languages.id, { onDelete: "cascade" }),
    proficiency: languageProficiencyEnum("proficiency").notNull(),
    addedAt: timestamp("added_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => {
    return {
      pk: primaryKey({
        columns: [t.rootAccountId, t.languageId],
        name: "user_languages_pkey",
      }),
      idxProficiency: index("idx_user_languages_proficiency").on(t.proficiency),
    };
  },
);
