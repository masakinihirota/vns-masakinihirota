import { describe, expect, it } from "vitest";
import { userEntrySchema, workSchema } from "./schema";

describe("Work Registration Schema", () => {
  describe("workSchema", () => {
    it("validates a correct work object", () => {
      const validWork = {
        title: "Test Work",
        author: "Test Author",
        category: "manga",
        isPurchasable: true,
        isNew: true,
        isAiGenerated: false,
      };
      const result = workSchema.safeParse(validWork);
      expect(result.success).toBe(true);
    });

    it("requires title and author", () => {
      const invalidWork = {
        category: "anime",
      };
      const result = workSchema.safeParse(invalidWork);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.title).toBeDefined();
        expect(result.error.flatten().fieldErrors.author).toBeDefined();
      }
    });

    it("validates url fields if provided", () => {
      const workWithInvalidUrl = {
        title: "Test",
        author: "Test",
        category: "manga",
        officialUrl: "not-a-url",
      };
      const result = workSchema.safeParse(workWithInvalidUrl);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.officialUrl).toBeDefined();
      }
    });
  });

  describe("userEntrySchema", () => {
    it("validates a correct entry object", () => {
      const validEntry = {
        status: "expecting",
      };
      const result = userEntrySchema.safeParse(validEntry);
      expect(result.success).toBe(true);
    });

    it("requires status", () => {
      const invalidEntry = {};
      const result = userEntrySchema.safeParse(invalidEntry);
      expect(result.success).toBe(false);
    });
  });
});
