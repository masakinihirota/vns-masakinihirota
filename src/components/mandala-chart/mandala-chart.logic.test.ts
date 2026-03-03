import { describe, expect, it } from "vitest";
import { createDefaultChart, MandalaChart, updateCellWithSync } from "./mandala-chart.logic";

describe("MandalaChart 同期ロジック", () => {
  it("中央グリッドの周辺セルを更新すると、周辺グリッドの中心セルが同期されること", () => {
    const charts: MandalaChart[] = [createDefaultChart()];
    const activeIndex = 0;
    const gridIdx = 4; // 中央グリッド
    const cellIdx = 0; // 左上
    const newValue = "中目標1";

    const result = updateCellWithSync(charts, activeIndex, gridIdx, cellIdx, newValue);

    // 中央グリッドの指定セルが更新されていること
    expect(result[0].grids[4][0]).toBe(newValue);
    // 対応する周辺グリッド (gridIdx=0) の中心セル (cellIdx=4) が更新されていること
    expect(result[0].grids[0][4]).toBe(newValue);
  });

  it("周辺グリッドの中心セルを更新すると、中央グリッドの対応するセルが同期されること", () => {
    const charts: MandalaChart[] = [createDefaultChart()];
    const activeIndex = 0;
    const gridIdx = 2; // 右上グリッド
    const cellIdx = 4; // 周辺グリッドの中心
    const newValue = "中目標3";

    const result = updateCellWithSync(charts, activeIndex, gridIdx, cellIdx, newValue);

    // 周辺グリッドの中心セルが更新されていること
    expect(result[0].grids[2][4]).toBe(newValue);
    // 中央グリッド (gridIdx=4) の対応するセル (cellIdx=2) が更新されていること
    expect(result[0].grids[4][2]).toBe(newValue);
  });

  it("中央グリッドの中心セル(大目標)を更新しても、他のセルには影響しないこと", () => {
    const charts: MandalaChart[] = [createDefaultChart()];
    const activeIndex = 0;
    const gridIdx = 4;
    const cellIdx = 4;
    const newValue = "大目標";

    const result = updateCellWithSync(charts, activeIndex, gridIdx, cellIdx, newValue);

    expect(result[0].grids[4][4]).toBe(newValue);
    // 他のグリッドの中心セルが変わっていないこと (代表してgrid 0)
    expect(result[0].grids[0][4]).toBe("");
  });
});
