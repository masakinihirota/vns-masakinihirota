import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { cache } from "react";
import { describe, expect, it } from "vitest";

describe("Dependency Import Test", () => {
  it("should import react cache", () => {
    expect(cache).toBeDefined();
  });
  it("should import drizzle", () => {
    expect(drizzle).toBeDefined();
  });
  it("should import postgres", () => {
    expect(postgres).toBeDefined();
  });
});
