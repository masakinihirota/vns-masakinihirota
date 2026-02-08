import { describe, expect, it } from "vitest";
import { createNewChart, syncGrids } from "./mandala-chart.logic";

describe("mandala-chart.logic", () => {
  describe("createNewChart", () => {
    it("デフォルト設定で新しいチャートを生成できる", () => {
      const chart = createNewChart();
      expect(chart.id).toBeDefined();
      expect(chart.title).toBe("新しい目標");
      expect(chart.grids).toHaveLength(9);
      expect(chart.grids[0]).toHaveLength(9);
    });
  });

  describe("syncGrids", () => {
    it("中央グリッドの周辺セルを更新すると、対応するサブグリッドの中心セルが同期される", () => {
      const chart = createNewChart();
      const grids = chart.grids.map((g) => [...g]);

      // 中央グリッド(4)の左上セル(0)を更新
      const updatedGrids = syncGrids(grids, 4, 0, "目標1");

      expect(updatedGrids[4][0]).toBe("目標1");
      expect(updatedGrids[0][4]).toBe("目標1"); // サブグリッド(0)の中心セル(4)
    });

    it("周辺サブグリッドの中心セルを更新すると、中央グリッドの対応するセルが同期される", () => {
      const chart = createNewChart();
      const grids = chart.grids.map((g) => [...g]);

      // サブグリッド(1)の中心セル(4)を更新
      const updatedGrids = syncGrids(grids, 1, 4, "目標2");

      expect(updatedGrids[1][4]).toBe("目標2");
      expect(updatedGrids[4][1]).toBe("目標2"); // 中央グリッド(4)の上セル(1)
    });

    it("中央グリッドの中心セル(大目標)を更新しても他のセルには影響しない", () => {
      const chart = createNewChart();
      const grids = chart.grids.map((g) => [...g]);

      const updatedGrids = syncGrids(grids, 4, 4, "大目標");

      expect(updatedGrids[4][4]).toBe("大目標");
      // 他のセルの同期は発生しない
      updatedGrids.forEach((grid, gIdx) => {
        grid.forEach((cell, cIdx) => {
          if (gIdx === 4 && cIdx === 4) return;
          expect(cell).toBe("");
        });
      });
    });
  });
});
