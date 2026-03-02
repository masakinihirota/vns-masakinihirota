import { describe, expect, it, vi } from "vitest";

// Mock dependencies to avoid DB/React issues
vi.mock("react", () => ({
  cache: (fn: any) => fn,
}));

vi.mock("@/lib/db/client", () => ({
  db: {
    select: vi.fn(),
  },
}));

import { checkPlatformAdmin } from "../rbac-helper";

describe("Simple Import Test", () => {
  it("should import rbac-helper without crashing", () => {
    expect(checkPlatformAdmin).toBeDefined();
  });
});
