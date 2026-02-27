import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const isProduction = process.env.NODE_ENV === "production";

config({ path: ".env" });
if (!isProduction) {
	config({ path: ".env.local", override: true });
}

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);
