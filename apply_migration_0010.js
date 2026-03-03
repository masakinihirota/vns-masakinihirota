const postgres = require('postgres');
require('dotenv').config({ path: '.env.local' });

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('❌ DATABASE_URL is not set');
  process.exit(1);
}

const sql = postgres(dbUrl);

const migrations = [
  `ALTER TABLE "market_transactions" ADD CONSTRAINT "market_transactions_price_check" CHECK (price >= 0)`,
  `ALTER TABLE "market_transactions" ADD CONSTRAINT "market_transactions_fee_amount_check" CHECK (fee_amount >= 0)`,
  `ALTER TABLE "market_transactions" ADD CONSTRAINT "market_transactions_seller_revenue_check" CHECK (seller_revenue >= 0)`,
  `ALTER TABLE "market_transactions" ADD CONSTRAINT "market_transactions_revenue_integrity_check" CHECK (price = seller_revenue + fee_amount)`,
];

(async () => {
  try {
    console.log(`[Migration 0010] Applying ${migrations.length} CHECK constraints...`);
    for (const migration of migrations) {
      try {
        await sql`${sql.unsafe(migration)}`;
        console.log(`✓ Applied: ${migration.substring(0, 60)}...`);
      } catch (error) {
        if (error.message && error.message.includes('already exists')) {
          console.log(`⊘ Constraint already exists (skipping): ${migration.substring(0, 60)}...`);
        } else {
          throw error;
        }
      }
    }
    console.log(`[Migration 0010] ✅ All CHECK constraints applied successfully`);
    process.exit(0);
  } catch (error) {
    console.error(`[Migration 0010] ❌ Failed:`, error.message);
    process.exit(1);
  } finally {
    await sql.end();
  }
})();
