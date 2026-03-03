
const postgres = require('postgres');
const { logger } = require('../../logger'); // relative path may need adjusting depending on transpile

/**
 *
 */
async function test() {
  const sql = postgres('postgresql://vns_user@localhost:5433/vns_db');
  try {
    const res = await sql`SELECT 1 as result`;
    logger.info('✅ Connection successful:', res);
  } catch (error) {
    logger.error('❌ Connection failed:', error);
  } finally {
    await sql.end();
  }
}

test();
