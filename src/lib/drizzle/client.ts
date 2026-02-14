import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * DB接続文字列（Supabase Transaction Pooler）
 * .envに DATABASE_URL を設定すること
 */
const connectionString = process.env.DATABASE_URL!;

/**
 * postgres.js クライアント
 * prepare: false は Supabase Transaction Pooler（PgBouncer）利用時に必須
 */
const client = postgres(connectionString, {
  prepare: false,
});

/** Drizzle ORMインスタンス（リレーション定義付き） */
export const db = drizzle(client, { schema });
