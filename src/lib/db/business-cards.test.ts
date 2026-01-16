import { vi, describe, it, expect, beforeEach } from "vitest";
import { getBusinessCardByProfileId } from "./business-cards";

// Mock Supabase
const mockSingle = vi.fn();
const mockSelect = vi.fn(() => ({ single: mockSingle }));
const mockEq = vi.fn(() => ({ single: mockSingle }));
const mockFrom = vi.fn(() => ({
  select: mockSelect,
  upsert: vi.fn(() => ({ select: vi.fn(() => ({ single: mockSingle })) })),
}));
const mockCreateClient = vi.fn(() => ({
  from: mockFrom,
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: () => Promise.resolve(mockCreateClient()),
}));

describe("Business Card Repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return null if business card not found", async () => {
    mockSingle.mockResolvedValue({ data: null, error: { code: "PGRST116" } });

    // Setup chain
    mockSelect.mockReturnValue({ eq: mockEq } as any);
    mockEq.mockReturnValue({ single: mockSingle } as any);

    const result = await getBusinessCardByProfileId("invalid-id");
    expect(result).toBeNull();
  });

  it("should return business card data if found", async () => {
    const mockData = {
      id: "123",
      user_profile_id: "pid",
      is_published: true,
      content: { trust: { response_time: "4h" } },
    };
    mockSingle.mockResolvedValue({ data: mockData, error: null });

    // Setup chain
    mockSelect.mockReturnValue({ eq: mockEq } as any);
    mockEq.mockReturnValue({ single: mockSingle } as any);

    const result = await getBusinessCardByProfileId("pid");
    expect(result).toEqual(mockData);
  });
});
