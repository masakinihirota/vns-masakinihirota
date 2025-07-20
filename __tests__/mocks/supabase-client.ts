import { vi } from "vitest";
import { createMockClientFunction } from "./supabase";

// src/lib/supabase/client.ts のモック
export const createClient = vi
  .fn()
  .mockImplementation(createMockClientFunction);
