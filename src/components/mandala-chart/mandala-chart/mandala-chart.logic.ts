/**
 * マンダラチャートの 9x9 グリッドと Markdown テキストの相互変換ロジック (新フォーマット対応)
 *
 * フォーマット:
 * ---
 * # ★(0)
 * 中央テーマ (Block 4, Cell 4)
 *
 * ## 0-1
 * 項目 (Block 4, Cell 0)
 * ...
 * ---
 * # 1
 * サブテーマ (Block 0, Cell 4)
 *
 * ## 1-1
 * 項目 (Block 0, Cell 0)
 */

// 9x9 grid

const BLOCK_MAPPING: Record<string, number> = {
  "★(0)": 4,
  "1": 0,
  "2": 1,
  "3": 2,
  "4": 3,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
};

const REVERSE_BLOCK_MAPPING: Record<number, string> = Object.fromEntries(
  Object.entries(BLOCK_MAPPING).map(([k, v]) => [v, k])
);

/**
 * 9x9 グリッド (9ブロック形式) から Markdown テキストを生成する
 */
export function generateMarkdownFromMandala(blocks: string[][]): string {
  if (!blocks || blocks.length !== 9) return "";

  let markdown = "";

  // ブロックの順序を定義 (★(0) を最初に持ってくる)
  const order = [4, 0, 1, 2, 3, 5, 6, 7, 8];

  order.forEach((blockIdx) => {
    const label = REVERSE_BLOCK_MAPPING[blockIdx];
    markdown += `---\n# ${label}\n`;

    const centerValue = blocks[blockIdx][4];
    if (centerValue) {
      markdown += `${centerValue}\n`;
    }
    markdown += `\n`;

    for (let cellIdx = 0; cellIdx < 9; cellIdx++) {
      if (cellIdx === 4) continue;
      const val = blocks[blockIdx][cellIdx];

      const labelDigit = label === "★(0)" ? "0" : label;
      const subLabel = cellIdx < 4 ? cellIdx + 1 : cellIdx;

      markdown += `## ${labelDigit}-${subLabel}\n`;
      if (val) {
        markdown += `${val}\n`;
      }
      markdown += `\n`;
    }
  });

  return markdown.trim();
}

/**
 * Markdown テキストから 9x9 グリッドを生成する
 */
export function parseMarkdownToMandala(markdown: string): string[][] {
  const blocks = Array(9)
    .fill(0)
    .map(() => Array(9).fill(""));

  const sections = markdown.split(/---/).filter(Boolean);

  sections.forEach((section) => {
    const lines = section.trim().split("\n");
    let currentBlockIdx = -1;
    let currentCellIdx = -1;

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      if (trimmed.startsWith("# ")) {
        const label = trimmed.replace("# ", "").trim();
        currentBlockIdx = BLOCK_MAPPING[label] ?? -1;
        currentCellIdx = 4; // Block header refers to center cell
      } else if (trimmed.startsWith("## ")) {
        const subLabel = trimmed.replace("## ", "").trim();
        // Label format: "n-k"
        const parts = subLabel.split("-");
        if (parts.length === 2) {
          const k = parseInt(parts[1], 10);
          if (!isNaN(k)) {
            currentCellIdx = k <= 4 ? k - 1 : k;
          }
        }
      } else {
        // Content line
        if (currentBlockIdx !== -1 && currentCellIdx !== -1) {
          // すでに値がある場合は改行でつなぐ（基本は1行想定だが）
          if (blocks[currentBlockIdx][currentCellIdx]) {
            blocks[currentBlockIdx][currentCellIdx] += "\n" + trimmed;
          } else {
            blocks[currentBlockIdx][currentCellIdx] = trimmed;
          }
        }
      }
    });
  });

  // 同期ロジックの適用 (Block 4 と他ブロックの同期)
  syncMandalaBlocks(blocks);

  return blocks;
}

/**
 * ブロック間の整合性を保つための同期
 * Block 4 の周辺セル <-> 周辺ブロックのセンターセル
 */
function syncMandalaBlocks(blocks: string[][]) {
  const mapping = [0, 1, 2, 3, null, 5, 6, 7, 8];

  // 1. Block 4 から周辺ブロックへの反映
  mapping.forEach((targetBlockIdx, cellIdx) => {
    if (targetBlockIdx !== null) {
      if (blocks[4][cellIdx] && !blocks[targetBlockIdx][4]) {
        blocks[targetBlockIdx][4] = blocks[4][cellIdx];
      }
    }
  });

  // 2. 周辺ブロックから Block 4 への反映 (周辺ブロックのセンターを優先する場合)
  mapping.forEach((targetBlockIdx, cellIdx) => {
    if (targetBlockIdx !== null) {
      if (blocks[targetBlockIdx][4]) {
        blocks[4][cellIdx] = blocks[targetBlockIdx][4];
      }
    }
  });
}
