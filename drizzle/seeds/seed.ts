// 初期データ投入スクリプト (idempotent)
// 実行: pnpm db:seed
// 方針:
//  - Drizzle + postgres-js で接続
//  - 代表的な languages を投入 (既存は on conflict do nothing)
//  - 今後追加の seed セクションは独立した関数で列挙
//  - トランザクション内でまとめられるものはまとめる

import 'dotenv/config';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { languages } from '../schema/languages';


// 将来他テーブル seed 用に型を用意
type SeedContext = {
	sql: ReturnType<typeof postgres>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	db: any; // drizzle の型推論簡略化 (必要になったら拡張)
};

async function seedLanguages({ db }: SeedContext) {
	// マイグレーション未実行環境向けフォールバック (初回開発利便性)
	// 本番では正式な drizzle migration を適用すること
	await db.execute(`CREATE TABLE IF NOT EXISTS languages (
		id varchar(10) PRIMARY KEY,
		name text,
		native_name text
	)`);
	const data = [
		{ id: 'en', name: 'English', nativeName: 'English' },
		{ id: 'ja', name: 'Japanese', nativeName: '日本語' },
	];
	// 重複投入防止: onConflictDoNothing
	await db.insert(languages).values(data).onConflictDoNothing();
	return data.length;
}

async function main() {
	const url = process.env.DATABASE_URL;
	if (!url) {
		console.error('ERROR: DATABASE_URL が設定されていません (.env を確認)');
		process.exit(1);
	}

	const sql = postgres(url, { max: 1 });
	const db = drizzle(sql);
	const ctx: SeedContext = { sql, db };

	const results: Record<string, number> = {};
	try {
		console.log('--- Seeding start ---');
		results.languages = await seedLanguages(ctx);
		console.log('Seeded sections:', results);
		console.log('--- Seeding completed ---');
	} catch (e) {
		console.error('Seeding failed:', e);
		process.exitCode = 1;
	} finally {
		await ctx.sql.end({ timeout: 5 });
	}
}

// eslint-disable-next-line unicorn/prefer-top-level-await
main();

