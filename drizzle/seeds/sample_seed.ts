// db/seed.ts
// Drizzle ORM - Supabase
// https://orm.drizzle.team/docs/connect-supabase
// Connect to your database | Supabase Docs
// https://supabase.com/docs/guides/database/connecting-to-postgres#connecting-with-drizzle

import { drizzle } from 'drizzle-orm/postgres-js'
import { reset, seed } from "drizzle-seed"
import * as schema from '../schema/root_accounts'

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in the environment variables.");
}
const db = drizzle(process.env.DATABASE_URL);

async function main() {
  await reset(db as any, schema)
  await seed(db as any, schema).refine((f) => ({
    // users: {
    //   count: 5,
    //   with: {
    //     posts: 10
    //   }
    // }
  }))
}

main()
