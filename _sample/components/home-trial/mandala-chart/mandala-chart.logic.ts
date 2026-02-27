export type MandalaChart = {
  id: string;
  title: string;
  grids: string[][]; // 9x9 grids
  createdAt: string;
  updatedAt: string;
};

export const createNewChart = (title: string = "新しい目標"): MandalaChart => ({
  id: crypto.randomUUID(),
  title,
  grids: Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => "")),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

/**
 * Update a cell in the mandala chart and enforce synchronization rules.
 * - Center grid (4) outer cells (0-3, 5-8) sync with corresponding sub-grid center cells (4).
 * - Sub-grid center cells (4) sync with corresponding center grid (4) outer cells.
 * @param chart
 * @param gridIdx
 * @param gridIndex
 * @param cellIdx
 * @param cellIndex
 * @param value
 */
export const updateCell = (
  chart: MandalaChart,
  gridIndex: number,
  cellIndex: number,
  value: string
): MandalaChart => {
  // Deep clone to ensure immutability
  const newChart: MandalaChart = JSON.parse(JSON.stringify(chart));
  newChart.grids[gridIndex][cellIndex] = value;
  newChart.updatedAt = new Date().toISOString();

  // Synchronization Logic
  if (gridIndex === 4 && cellIndex !== 4) {
    // Center grid outer cell changed -> Sync to sub-grid center
    newChart.grids[cellIndex][4] = value;
  } else if (gridIndex !== 4 && cellIndex === 4) {
    // Sub-grid center cell changed -> Sync to center grid outer cell
    newChart.grids[4][gridIndex] = value;
  }

  return newChart;
};
