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
 * @param blocks
 */
export function generateMarkdownFromMandala(blocks: string[][]): string {
  if (!blocks || blocks.length !== 9) return "";

  let markdown = "";

  // ブロックの順序を定義 (★(0) を最初に持ってくる)
  const order = [4, 0, 1, 2, 3, 5, 6, 7, 8];

  for (const blockIndex of order) {
    const label = REVERSE_BLOCK_MAPPING[blockIndex];
    markdown += `---\n# ${label}\n`;

    const centerValue = blocks[blockIndex][4];
    if (centerValue) {
      markdown += `${centerValue}\n`;
    }
    markdown += `\n`;

    for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
      if (cellIndex === 4) continue;
      const value = blocks[blockIndex][cellIndex];

      const labelDigit = label === "★(0)" ? "0" : label;
      const subLabel = cellIndex < 4 ? cellIndex + 1 : cellIndex;

      markdown += `## ${labelDigit}-${subLabel}\n`;
      if (value) {
        markdown += `${value}\n`;
      }
      markdown += `\n`;
    }
  }

  return markdown.trim();
}

/**
 * Markdown テキストから 9x9 グリッドを生成する
 * @param markdown
 */
export function parseMarkdownToMandala(markdown: string): string[][] {
  const blocks: string[][] = Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => "")
  );

  const sections = markdown.split(/---/).filter(Boolean);

  for (const section of sections) {
    const lines = section.trim().split("\n");
    let currentBlockIndex = -1;
    let currentCellIndex = -1;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (trimmed.startsWith("# ")) {
        const label = trimmed.replace("# ", "").trim();
        currentBlockIndex = BLOCK_MAPPING[label] ?? -1;
        currentCellIndex = 4; // Block header refers to center cell
      } else if (trimmed.startsWith("## ")) {
        const subLabel = trimmed.replace("## ", "").trim();
        // Label format: "n-k"
        const parts = subLabel.split("-");
        if (parts.length === 2) {
          const k = Number.parseInt(parts[1], 10);
          if (!isNaN(k)) {
            currentCellIndex = k <= 4 ? k - 1 : k;
          }
        }
      } else {
        // Content line
        if (currentBlockIndex !== -1 && currentCellIndex !== -1) {
          // すでに値がある場合は改行でつなぐ（基本は1行想定だが）
          if (blocks[currentBlockIndex][currentCellIndex]) {
            blocks[currentBlockIndex][currentCellIndex] += "\n" + trimmed;
          } else {
            blocks[currentBlockIndex][currentCellIndex] = trimmed;
          }
        }
      }
    }
  }

  // 同期ロジックの適用 (Block 4 と他ブロックの同期)
  syncMandalaBlocks(blocks);

  return blocks;
}

/**
 * ブロック間の整合性を保つための同期
 * Block 4 の周辺セル <-> 周辺ブロックのセンターセル
 * @param blocks
 */
function syncMandalaBlocks(blocks: string[][]) {
  const mapping = [0, 1, 2, 3, null, 5, 6, 7, 8];

  // 1. Block 4 から周辺ブロックへの反映
  for (const [cellIndex, targetBlockIndex] of mapping.entries()) {
    if (targetBlockIndex !== null && blocks[4][cellIndex] && !blocks[targetBlockIndex][4]) {
      blocks[targetBlockIndex][4] = blocks[4][cellIndex];
    }
  }

  // 2. 周辺ブロックから Block 4 への反映 (周辺ブロックのセンターを優先する場合)
  for (const [cellIndex, targetBlockIndex] of mapping.entries()) {
    if (targetBlockIndex !== null && blocks[targetBlockIndex][4]) {
      blocks[4][cellIndex] = blocks[targetBlockIndex][4];
    }
  }
}
