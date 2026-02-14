import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

/**
 * Auth.js専用 Drizzle Kit 設定
 * Supabaseとは独立したAuth.js用PostgreSQLのマイグレーション管理に使用
 *
 * 使用方法:
 *   pnpm drizzle-kit push --config drizzle.authjs.config.ts
 *   pnpm drizzle-kit generate --config drizzle.authjs.config.ts
 */
export default defineConfig({
  schema: "./src/lib/drizzle/schema/auth.ts",
  out: "./drizzle-authjs",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.AUTH_DRIZZLE_URL!,
  },
});
