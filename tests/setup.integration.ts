import path from "path";
import dotenv from "dotenv";

// Load .env.local first
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
// Load .env as fallback
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// Ensure DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in .env.local or .env");
}

// Force Drizzle mode for integration tests
process.env.USE_DRIZZLE = "true";
