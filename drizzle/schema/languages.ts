import { pgTable, varchar, text } from "drizzle-orm/pg-core";

export const languages = pgTable("languages", {
  id: varchar("id", { length: 10 }).primaryKey(),
  name: text("name"),
  nativeName: text("native_name"),
});
