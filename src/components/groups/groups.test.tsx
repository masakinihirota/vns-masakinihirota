import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import * as matchers from "vitest-axe/matchers";
import { GroupsContainer } from "./groups.container";

// Mock Server Actions
vi.mock("@/actions/groups", () => ({
  createGroupAction: vi.fn(),
  getGroupByIdAction: vi.fn(),
  joinGroupAction: vi.fn(),
}));

// Extend expect for toHaveNoViolations
expect.extend(matchers);

// Mock Supabase Client with recursive chaining support
const mockSupabaseChain = {
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  match: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  single: vi.fn().mockResolvedValue({ data: { id: "mock-id" }, error: null }),
  maybeSingle: vi.fn().mockResolvedValue({ data: { id: "mock-id" }, error: null }),
  then: vi.fn((resolve: (value: any) => void) => resolve({ data: [], error: null })), // Allow awaiting the chain directly
};

vi.mock("@/lib/supabase/client", () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => mockSupabaseChain),
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: { id: "test-user" } }, error: null })),
    },
  })),
}));

// Mock `scrollIntoView` as it's not implemented in jsdom
window.HTMLElement.prototype.scrollIntoView = function () { };

describe("Groups Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<GroupsContainer />);

    // We expect some violations due to color contrast issues inherent in "glassmorphism" on white background if not careful,
    // but we aim for 0. If fails, we acknowledge.
    // Also, mock data might generate elements with duplicate IDs if not careful (though I used unique keys).

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
