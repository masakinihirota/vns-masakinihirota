import { vi } from "vitest";

// Supabase のモック
export const mockUser = {
  id: "user-id",
  email: "test@example.com",
};

export const mockRootAccounts = [{ id: 1, name: "Test User" }];

export const mockGetUser = vi.fn();
export const mockSelect = vi.fn();
export const mockFrom = vi.fn();

export const mockSupabase = {
  auth: {
    getUser: mockGetUser,
  },
  from: mockFrom,
};

export const mockCreateClient = vi.fn().mockImplementation(() => mockSupabase);
