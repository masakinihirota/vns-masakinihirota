ALTER TABLE "user_profiles" DROP CONSTRAINT "user_profiles_root_account_id_key";--> statement-breakpoint
ALTER TABLE "groups" DROP CONSTRAINT "groups_leader_id_fkey";
--> statement-breakpoint
ALTER TABLE "approvals" ADD CONSTRAINT "approvals_work_id_fkey" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "groups" ADD CONSTRAINT "groups_leader_id_fkey" FOREIGN KEY ("leader_id") REFERENCES "public"."user_profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_approvals_work_id" ON "approvals" USING btree ("work_id");--> statement-breakpoint
CREATE INDEX "idx_groups_leader_id" ON "groups" USING btree ("leader_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_market_items_nation_id" ON "market_items" USING btree ("nation_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_market_items_seller_id" ON "market_items" USING btree ("seller_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_market_items_seller_group_id" ON "market_items" USING btree ("seller_group_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_market_transactions_item_id" ON "market_transactions" USING btree ("item_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_market_transactions_buyer_id" ON "market_transactions" USING btree ("buyer_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_market_transactions_seller_id" ON "market_transactions" USING btree ("seller_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_nation_events_nation_id" ON "nation_events" USING btree ("nation_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_nation_events_organizer_id" ON "nation_events" USING btree ("organizer_id" uuid_ops);