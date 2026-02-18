import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.postgres";

const connectionString =
  process.env.POSTGRES_URL ||
  "postgres://postgres:password@localhost:5432/local_db";

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
