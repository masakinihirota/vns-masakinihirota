import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

const isProduction = process.env.NODE_ENV === 'production';

config({ path: '.env' });
if (!isProduction) {
  config({ path: '.env.local', override: true });
}

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
