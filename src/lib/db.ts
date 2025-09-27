/**
 * Drizzle ORMでのデータベースクライアント設定
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../../drizzle/schema';

// 環境変数からデータベースURLを取得
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// PostgreSQLクライアントを作成
const client = postgres(DATABASE_URL);

// Drizzle ORMインスタンスを作成
export const db = drizzle(client, { schema });
