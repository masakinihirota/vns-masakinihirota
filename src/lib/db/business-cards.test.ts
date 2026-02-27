import { beforeEach, describe, expect, it, vi } from "vitest";

import { getBusinessCardByProfileId } from "./business-cards";
import { db as database } from "./client";


// Mock Drizzle
vi.mock("./client", () => ({
  db: {
    query: {
      businessCards: {
        findFirst: vi.fn(),
      },
    },
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        onConflictDoUpdate: vi.fn(() => ({
          returning: vi.fn(),
        })),
      })),
    })),
  },
}));

describe("Business Card Repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return null if business card not found", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (database.query.businessCards.findFirst as any).mockResolvedValue(null);

    const result = await getBusinessCardByProfileId("invalid-id");
    expect(result).toBeNull();
  });

  it("should return business card data if found", async () => {
    const mockDatabaseData = {
      id: "123",
      userProfileId: "pid",
      isPublished: true,
      content: { trust: { response_time: "4h" } },
      displayConfig: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (database.query.businessCards.findFirst as any).mockResolvedValue(mockDatabaseData);

    const result = await getBusinessCardByProfileId("pid");
    expect(result).toEqual({
      id: "123",
      user_profile_id: "pid",
      is_published: true,
      content: { trust: { response_time: "4h" } },
      display_config: {},
      created_at: mockDatabaseData.createdAt,
      updated_at: mockDatabaseData.updatedAt,
    });
  });
});
