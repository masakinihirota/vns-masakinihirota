import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { db } from "./drizzle-postgres";
import {
  completeTransaction,
  createMarketItem,
  getMarketItemById,
  startTransaction,
} from "./market";
import { createNation } from "./nations";
import { marketItems, marketTransactions, nations } from "./schema.postgres";
import { createUserProfile, getUserProfiles } from "./user-profiles";

describe("Market Integration (Drizzle)", () => {
  let rootAccountId: string;
  let sellerId: string;
  let buyerId: string;
  let nationId: string;
  let itemId: string;
  let transactionId: string;

  beforeAll(async () => {
    // Setup: Get Root Account
    const profile = await db.query.userProfiles.findFirst();
    if (!profile)
      throw new Error("Need at least one profile to find root account");
    rootAccountId = profile.rootAccountId;

    // Ensure we have 2 profiles (Seller, Buyer)
    // Try to create them if not enough exists.
    const existingProfiles = await getUserProfiles(rootAccountId);

    if (existingProfiles.length >= 2) {
      sellerId = existingProfiles[0].id;
      buyerId = existingProfiles[1].id;
    } else {
      // Create what's missing
      if (existingProfiles.length === 0) {
        // Should not happen as we found rootAccount via profile
        sellerId = profile.id;
      } else {
        sellerId = existingProfiles[0].id;
      }

      // Create Buyer
      try {
        const buyer = await createUserProfile(rootAccountId, {
          display_name: "Market Test Buyer",
          role_type: "member",
        });
        buyerId = buyer.id;
      } catch (e) {
        // If limit reached, reuse seller as buyer (self-trade)
        console.warn(
          "Could not create buyer profile, using seller checking self-trade",
          e
        );
        buyerId = sellerId;
      }
    }

    // Create Nation
    const nationData = {
      name: "Market Test Nation",
      description: "For Market Tests",
      owner_user_id: sellerId,
      transaction_fee_rate: 10.0, // 10%
      foundation_fee: 1000,
    };
    const nation = await createNation(nationData as any);
    nationId = nation.id;
  });

  afterAll(async () => {
    // Cleanup
    if (itemId) {
      try {
        await db.delete(marketItems).where(eq(marketItems.id, itemId));
      } catch {}
    }
    if (nationId) {
      try {
        await db.delete(nations).where(eq(nations.id, nationId));
      } catch {}
    }
    // Buyer profile cleanup? Maybe leave it or cascade deletes?
    // user_profiles are expensive to delete if linked.
  });

  it("should create a market item", async () => {
    const itemData = {
      nation_id: nationId,
      seller_id: sellerId,
      title: "Test Item",
      description: "An item for sale",
      price: 1000,
      type: "sell" as const,
      status: "open" as const,
    };

    const item = await createMarketItem(itemData as any);
    expect(item).toBeDefined();
    expect(item.id).toBeDefined();
    expect(item.price).toBe(1000);
    expect(item.status).toBe("open");

    itemId = item.id;
  });

  it("should start a transaction", async () => {
    expect(itemId).toBeDefined();
    // Buyer buys
    const txId = await startTransaction(itemId, buyerId);
    expect(txId).toBeDefined();
    transactionId = txId; // Wait, startTransaction returns ID or Object?
    // My implementation in market.ts returns newTx.id (string).

    // Verify transaction record
    const tx = await db.query.marketTransactions.findFirst({
      where: eq(marketTransactions.id, txId),
    });
    expect(tx).toBeDefined();
    expect(tx?.status).toBe("pending");
    expect(tx?.buyerId).toBe(buyerId);
    expect(tx?.itemId).toBe(itemId);
    // Fee check: 10% of 1000 = 100.
    expect(Number(tx?.feeAmount)).toBe(100);
    expect(Number(tx?.sellerRevenue)).toBe(900);
  });

  it("should complete a transaction", async () => {
    expect(transactionId).toBeDefined();

    const completed = await completeTransaction(transactionId, buyerId);
    expect(completed).toBeDefined();
    expect(completed.status).toBe("completed");
    expect(completed.completed_at).toBeDefined();

    // Verify Item status
    const item = await getMarketItemById(itemId);
    expect(item?.status).toBe("sold");
  });
});
