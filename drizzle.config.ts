import { config } from "dotenv";
import { defineConfig } from 'drizzle-kit';
config({ path: ".env" });

export default defineConfig({
    // フォルダ内にあるスキーマファイルを読み込む
    schema: './schema',
    // Supabase へのマイグレーションファイルを出力するディレクトリ
    out: "./supabase/migrations",
    dialect: "postgresql",
    dbCredentials: {
      url: process.env.POSTGRES_URL!,
    },
});
