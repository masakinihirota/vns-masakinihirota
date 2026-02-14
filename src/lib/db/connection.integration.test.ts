import { db } from '@/lib/drizzle/client';
import { sql } from 'drizzle-orm';
import { describe, expect, it } from 'vitest';

describe('Database Connection Integration Test', () => {
  it('should execute a simple query', async () => {
    // This test confirms that:
    // 1. Connection string is correct (loaded from .env)
    // 2. Drizzle client is properly configured
    // 3. Database is reachable
    const result = await db.execute(sql`SELECT 1 as val`);
    expect(result).toBeDefined();
    expect(result[0].val).toBe(1);
  });
});
