/**
 * Drizzle ORM Database Client
 * PostgreSQL connection
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { env } from '@/lib/env';
import * as schema from './schema.postgres';

/**
 * Drizzle ORM Database Client
 * PostgreSQL connection
 */

const databaseUrl = env.DATABASE_URL;

/**
 * コネクションプーリング設定
 *
 * @description
 * postgres.js のネイティブコネクションプーリングを使用
 * デフォルト max: 10, backsubscribe: true
 */
const client = postgres(databaseUrl, {
  prepare: false,
  onnotice: () => {}, // Suppress notices

  // パフォーマンス最適化: コネクションプーリング
  // max: 同時接続の最大数（デフォルト: 10）
  // 大規模アプリケーション: max: 20 推奨
  max: 10,

  // idle_in_transaction_session_timeout: トランザクション内のアイドルタイムアウト
  // 本番環境では 30000 (30s) 程度を推奨
  // idle_in_transaction_session_timeout: 30000,
});

// Create Drizzle instance
export const db = drizzle(client, { schema, logger: false });

export type DB = typeof db;
