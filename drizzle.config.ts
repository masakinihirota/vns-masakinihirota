import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

const isProduction = process.env.NODE_ENV === 'production';

config({ path: '.env' });
if (!isProduction) {
  config({ path: '.env.local', override: true });
}

export default defineConfig({
  schema: './src/lib/db/schema.postgres.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // NOTE: コネクションプーリングは DB クライアント (src/lib/db/client.ts) で設定
});
