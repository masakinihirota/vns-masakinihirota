import { vi } from "vitest";
import { createMockServerClientFunction } from "./supabase";

// src/lib/supabase/server.ts のモック
export const createClient = vi
  .fn()
  .mockImplementation(createMockServerClientFunction);
