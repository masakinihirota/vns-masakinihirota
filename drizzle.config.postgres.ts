import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/db/schema.postgres.ts",
  out: "./drizzle/migrations", // Separate migrations folder for postgres
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.POSTGRES_URL ||
      "postgres://postgres:password@localhost:5432/local_db",
  },
});
