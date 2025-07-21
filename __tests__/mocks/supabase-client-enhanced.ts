import { vi } from "vitest";
import { createMockClientFunction } from "./supabase-enhanced-client";

// src/lib/supabase/client.ts のモック
export const createClient = vi
  .fn()
  .mockImplementation(createMockClientFunction);
