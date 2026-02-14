import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as authSchema from "./schema/auth";

/**
 * Auth.js専用 DB接続文字列
 * Supabaseとは完全に独立したPostgreSQLに接続する
 * .env.local に AUTH_DRIZZLE_URL を設定すること
 */
const connectionString = process.env.AUTH_DRIZZLE_URL!;

/**
 * Auth.js専用 postgres.js クライアント
 */
const authClient = postgres(connectionString, {
  prepare: false,
});

/** Auth.js専用 Drizzle ORMインスタンス */
export const authDb = drizzle(authClient, { schema: authSchema });
