// import type { Config } from 'drizzle-kit';

// export default {
//   schema: './lib/db/schema.ts',
//   out: './lib/db/migrations',
//   dialect: 'postgresql',
//   dbCredentials: {
//     url: process.env.POSTGRES_URL!,
//   },
// } satisfies Config;

// 👆 元のコード
// 👇 Supabase(ローカル)の設定に変更

import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
config({ path: ".env" });

export default defineConfig({
	// フォルダ内にあるスキーマファイルを読み込む
	schema: "./lib/db/schema",
	// Supabase へのマイグレーションファイルを出力するディレクトリ
	out: "./supabase/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.POSTGRES_URL!,
	},
});


