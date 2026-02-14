import { defineConfig } from "drizzle-kit";

/**
 * Drizzle Kit 設定
 * マイグレーションは Supabase CLI で管理するため、
 * このファイルは introspect（pull）専用として使用する
 */
export default defineConfig({
  schema: "./src/lib/drizzle/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
