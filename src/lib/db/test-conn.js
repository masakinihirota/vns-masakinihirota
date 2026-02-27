
const postgres = require('postgres');

/**
 *
 */
async function test() {
  const sql = postgres('postgresql://vns_user@localhost:5433/vns_db');
  try {
    const res = await sql`SELECT 1 as result`;
    console.log('✅ Connection successful:', res);
  } catch (error) {
    console.error('❌ Connection failed:');
    console.error(error);
  } finally {
    await sql.end();
  }
}

test();
