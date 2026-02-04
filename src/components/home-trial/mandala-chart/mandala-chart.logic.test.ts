import { describe, expect, it } from "vitest";
import { createNewChart, updateCell } from "./mandala-chart.logic";

// Mock crypto.randomUUID for consistent testing if needed, though mostly checking structure here.
// But Vitest environment usually has crypto. Let's rely on it.

describe("MandalaChart Logic", () => {
  describe("createNewChart", () => {
    it("should create a chart with default title and empty grids", () => {
      const chart = createNewChart();
      expect(chart.title).toBe("新しい目標");
      expect(chart.grids.length).toBe(9);
      chart.grids.forEach((grid) => {
        expect(grid.length).toBe(9);
        expect(grid.every((cell) => cell === "")).toBe(true);
      });
      expect(chart.id).toBeDefined();
      expect(chart.createdAt).toBeDefined();
      expect(chart.updatedAt).toBeDefined();
    });

    it("should create a chart with a specific title", () => {
      const chart = createNewChart("My Goal");
      expect(chart.title).toBe("My Goal");
    });
  });

  describe("updateCell", () => {
    it("should update a normal cell (no sync)", () => {
      const chart = createNewChart();
      // Update Grid 0, Cell 0 (Top-Left Subgrid, Top-Left Cell) - acts as normal cell
      const updated = updateCell(chart, 0, 0, "Test Value");
      expect(updated.grids[0][0]).toBe("Test Value");
      // Should not affect center grid
      expect(updated.grids[4][0]).toBe("");
    });

    it("should sync Center Grid Outer Cell -> Sub-grid Center", () => {
      const chart = createNewChart();
      // Update Center Grid (4), Top-Left Cell (0) -> Should sync to Subgrid 0 Center (4)
      const updated = updateCell(chart, 4, 0, "Main Goal 1");

      expect(updated.grids[4][0]).toBe("Main Goal 1"); // Center grid
      expect(updated.grids[0][4]).toBe("Main Goal 1"); // Subgrid 0 center
    });

    it("should sync Sub-grid Center -> Center Grid Outer Cell", () => {
      const chart = createNewChart();
      // Update Subgrid 2 (Top-Right), Center Cell (4) -> Should sync to Center Grid (4) Cell 2 (Top-Right)
      const updated = updateCell(chart, 2, 4, "Sub Goal 2");

      expect(updated.grids[2][4]).toBe("Sub Goal 2"); // Subgrid center
      expect(updated.grids[4][2]).toBe("Sub Goal 2"); // Center grid
    });

    it("should NOT sync Center Grid Center Cell (The Core Goal) to anywhere else automatically", () => {
      const chart = createNewChart();
      // Center Grid (4), Center Cell (4)
      const updated = updateCell(chart, 4, 4, "Core Vision");

      expect(updated.grids[4][4]).toBe("Core Vision");
      // Should check a few random other places to ensure no accidental sync
      expect(updated.grids[0][4]).toBe("");
      expect(updated.grids[4][0]).toBe("");
    });

    it("should update updatedAt timestamp", async () => {
      const chart = createNewChart();
      // Ensure time passes
      await new Promise((resolve) => setTimeout(resolve, 2));
      const updated = updateCell(chart, 0, 0, "New");
      expect(updated.updatedAt).not.toBe(chart.updatedAt);
    });
  });
});
