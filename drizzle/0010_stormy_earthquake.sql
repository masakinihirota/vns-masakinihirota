ALTER TABLE "market_transactions" ADD CONSTRAINT "market_transactions_price_check" CHECK (price >= 0);--> statement-breakpoint
ALTER TABLE "market_transactions" ADD CONSTRAINT "market_transactions_fee_amount_check" CHECK (fee_amount >= 0);--> statement-breakpoint
ALTER TABLE "market_transactions" ADD CONSTRAINT "market_transactions_seller_revenue_check" CHECK (seller_revenue >= 0);--> statement-breakpoint
ALTER TABLE "market_transactions" ADD CONSTRAINT "market_transactions_revenue_integrity_check" CHECK (price = seller_revenue + fee_amount);